import math
import json
from typing import Dict, Tuple, List, Set, Iterable
from threading import Thread

import matplotlib.pyplot as plt
import networkx as nx
import numpy as np
from sklearn.cluster import DBSCAN

from Backend.Main.Models.constraint import PrerequisitesFulfilledConstraint, CorequisitesFulfilledConstraint
from Backend.Main.Models.unit import Unit


def unit_distance_metric(unit_1: Unit, unit_2: Unit) -> float:
    if unit_1.code == unit_2.code:
        return 0

    similarity = 0
    scale = 5

    # Calculate similarity score
    if unit_1.code[0] == unit_2.code[0]:
        similarity += 0.1 * scale
    if unit_1.code[:3] == unit_2.code[:3]:
        similarity += 0.1 * scale
    if unit_1.code[:4] == unit_2.code[:4]:
        similarity += 0.1 * scale
    # fixme: Prereqs and coreqs fields removed by previous commit, need to change this to work with the new Unit format
    for constraint in unit_1.constraints:
        if isinstance(constraint, PrerequisitesFulfilledConstraint) and unit_2 in constraint.prerequisites:
            similarity += 0.6 * scale
        elif isinstance(constraint, CorequisitesFulfilledConstraint) and unit_2 in constraint.corequisites:
            similarity += 0.6 * scale
    # fixme: Verify if similarity may be applied twice for the same pair
    for constraint in unit_2.constraints:
        if isinstance(constraint, PrerequisitesFulfilledConstraint) and unit_1 in constraint.prerequisites:
            similarity += 0.6 * scale
        elif isinstance(constraint, CorequisitesFulfilledConstraint) and unit_1 in constraint.corequisites:
            similarity += 0.6 * scale

    # Calculate distance using similarity score
    distance = math.exp(-similarity)

    return distance


class Cluster:
    def __init__(self, unit_codes: Iterable[str], distances: Dict[Tuple[str, str], float], label: int, graph: nx.DiGraph):
        self.unit_distances = distances
        self.unit_codes = unit_codes
        self.label = label
        self.graph = graph

    def distance(self, other_cluster):
        """Returns the average distance between two clusters"""
        total_distance = 0
        n_edges = 0
        for code_a in self.unit_codes:
            for code_b in other_cluster.unit_codes:
                if code_a == code_b:
                    continue
                edge = (code_a, code_b)
                if edge in self.unit_distances.keys():
                    total_distance += self.unit_distances[edge]
                    n_edges += 1

        return total_distance / n_edges


def build_cluster_network_layout(cluster: UnitCluster, scale: int=1):
    cluster.node_positions = nx.kamada_kawai_layout(cluster.graph, scale=scale)


def build_unit_network_layout(units: Dict[str, Unit], distances: Dict[Tuple[str, str], float]) -> Dict[str, Tuple[float, float]]:
    # Create an adjacency matrix with the distances between each unit as the edge weights
    distance_matrix = np.ones((len(units), len(units)), dtype=float)
    np.fill_diagonal(distance_matrix, 0)
    unit_codes = sorted(units.keys())
    unit_codes_to_index = {code: i for i, code in enumerate(unit_codes)}
    for (from_unit, to_unit), distance in distances.items():
        from_index = unit_codes_to_index[from_unit]
        to_index = unit_codes_to_index[to_unit]
        distance_matrix[from_index, to_index] = distance

    # Use calculated distances to determine which clusters to form and which cluster each unit should belong to
    # todo: Create hyperparameter tuner that minimizes the total number of nodes of all clusters by tuning epsilon
    #  Also consider the total number of clusters + noise nodes
    db = DBSCAN(eps=0.25, min_samples=3, metric='precomputed').fit(distance_matrix)
    labels = db.labels_
    n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
    n_noise = list(labels).count(-1)
    layout_threads = []
    clusters = {}  # Key: Cluster label, Value: Cluster object

    for label in range(n_clusters):
        # Create a graph using the nodes that belong to each cluster
        indices_of_units_in_cluster, = np.where(labels == label)
        units_in_cluster = {unit_codes[i]: units[unit_codes[i]] for i in indices_of_units_in_cluster}
        distances_between_units_in_cluster = {}
        for code_a in units_in_cluster.keys():
            for code_b in units_in_cluster.keys():
                if code_a == code_b:
                    continue
                edge = (code_a, code_b)
                if edge in distances.keys():
                    distances_between_units_in_cluster[edge] = distances[edge]

        # Use the Kamada-Kawai network layout algorithm on the nodes within each cluster in parallel
        cluster_graph = create_unit_network(units_in_cluster, distances_between_units_in_cluster)
        clusters[label] = Cluster(units_in_cluster.keys(), distances, label, cluster_graph)
        thread = Thread(target=build_cluster_network_layout, args=(clusters[label],))
        layout_threads.append(thread)
        thread.start()
    
    root_layout_scale = 1
    root_layout_graph = nx.DiGraph()

    # Add cluster nodes
    for i in range(n_clusters):
        root_layout_graph.add_node(i)

    # Add noise nodes
    indices_of_noise_units = np.where(labels == -1)
    for i in range(n_noise):
        label = -i - 1 # Noise nodes will have negative labels in the root graph starting from -1
        root_layout_graph.add_node(label)
        noise_unit_code = unit_codes[indices_of_noise_units[i]]
        clusters[label] = Cluster(noise_unit_code, distances, label, graph=None)

    # Add edges between nodes, with the distance between each node as the edge weight
    for node_1 in clusters.values():
        for node_2 in clusters.values():
            if node_1 == node_2:
                continue
            root_layout_graph.add_edge(node_1.label, node_2.label, weight=node_1.distance(node_2))

    # Use Kamada-Kawai on each cluster, treating each cluster itself as a node to determine centroid positions
    thread = Thread(target=build_cluster_network_layout, args=(root_layout_graph, root_layout_scale))
    layout_threads.append(thread)
    thread.start()

    # Wait for all threads to finish calculating the network layout
    for thread in layout_threads:
        thread.join()
    # todo: Offset the node positions in each cluster with the cluster's centroid
    pass


def draw_unit_network(network: nx.DiGraph, visible_edges: List[Tuple[str, str]], pos: Dict[str, Tuple[float, float]] = None):
    if pos is None:
        # Determine the layout of the graph using the Kamada-Kawai algorithm
        pos = nx.kamada_kawai_layout(network, scale=1)
    with open("unit_node_positions.json", "w") as fp:
        json_formatted_pos = {unit : {"x": x, "y": y} for unit, (x, y) in pos.items()}
        json.dump(json_formatted_pos, fp)

    # Draw the graph
    nx.draw_networkx_nodes(network, pos)
    nx.draw_networkx_labels(network, pos)
    # todo: Display co-requisite unit edges differently from prerequisites.
    # todo: Display incompatible unit relations somehow
    nx.draw_networkx_edges(network, pos, edgelist=visible_edges)

    plt.show()


def calculate_unit_distances(units: Dict[str, Unit]) -> Dict[Tuple[str, str], float]:
    # todo: Optimize for larger graphs if necessary. Consider using multithreading.
    # Calculate each unit's distance to each other
    unit_distances = {}
    for code_a, unit_a in units.items():
        for code_b, unit_b in units.items():
            if code_a == code_b:
                continue
            distance = unit_distance_metric(unit_a, unit_b)
            # Don't add an edge between unrelated units to reduce network layout computations
            if distance < 1:
                unit_distances[(code_a, code_b)] = distance

    return unit_distances


def find_visible_edges(units: Dict[str, Unit]) -> Set[Tuple[str, str]]:
    # Find all edges that need to be shown
    visible_edges = set()
    for code, unit in units.items():
        for constraint in unit.constraints:
            # Add prerequisite units
            if isinstance(constraint, PrerequisitesFulfilledConstraint):
                for prereq_unit in constraint.prerequisites:
                    edge = (prereq_unit.code, code)
                    if prereq_unit.code not in units.keys():
                        continue
                    visible_edges.add(edge)

            # Add co-requisite units
            if isinstance(constraint, CorequisitesFulfilledConstraint):
                for coreq_unit in constraint.corequisites:
                    edge = (coreq_unit.code, code)
                    if coreq_unit.code not in units.keys() or edge in visible_edges:
                        continue
                    visible_edges.add(edge)
            # todo: Think of a way to display incompatible units

    return visible_edges


def create_unit_network(units: Dict[str, Unit], distances: Dict[Tuple[str, str], float]) -> nx.DiGraph:
    G = nx.DiGraph()

    # Add units to graph
    for code in units.keys():
        G.add_node(code)

    # Calculate each unit's distance to each other
    for (code_a, code_b), distance in distances.items():
        G.add_edge(code_a, code_b, weight=distance)

    return G

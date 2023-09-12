import math
import json
from itertools import chain
from typing import Dict, Tuple, List, Set, Iterable
from threading import Thread
from abc import ABC, abstractmethod

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


class UnitNetwork(ABC):
    def __init__(self, unit_distances: Dict[Tuple[str, str], float]):
        self.unit_distances = unit_distances
        self.unit_positions = {}

class Node(ABC):
    default_distance = 1

    def __init__(self, network: UnitNetwork, depth: int=0, graph_label: int=0):
        self.network = network
        self.depth = depth
        self.graph_label = graph_label

    def distance(self, other_node):
        """Returns the average distance between two nodes"""
        total_distance = 0
        n_edges = 0
        for code_a in self:
            for code_b in other_node:
                if code_a == code_b:
                    continue
                edge = (code_a, code_b)
                if edge in self.network.unit_distances.keys():
                    total_distance += self.network.unit_distances[edge]
                    n_edges += 1

        return total_distance / n_edges if n_edges > 0 else Node.default_distance

    @abstractmethod
    def __iter__(self):
        """Returns an iterable of unit codes belonging to the node"""
        pass


class LeafNode(Node):

    def __init__(self, network: UnitNetwork, depth: int, graph_label: int, unit_code: str):
        super().__init__(network, depth, graph_label)
        self.unit_code = unit_code

    def __iter__(self):
        yield self.unit_code


class ClusterNode(Node):
    # Hyperparameters
    epsilon = 0.25
    min_samples_in_epsilon_neighborhood = 3
    scale = 10

    def __init__(self, network: UnitNetwork, depth: int, graph_label: int, units: Dict[str, Unit]):
        super().__init__(network, depth, graph_label)
        self.units = units
        self.layout_graph = nx.DiGraph()
        self.n_clusters = 0
        self.n_noise = 0
        self.sub_clusters = []
        self.leaf_nodes = []
        self.child_nodes_created = False
        self.layout_complete = False
        self.layouts_applied = False
        self.node_positions = {}
        self.graph_label_unit_code_map = {}

    def identify_and_break_into_sub_clusters(self):
        # Convert remaining nodes to leaf nodes and return if condition met
        # todo: Adjust this condition as necessary
        if self.depth == 2:
            for leaf_node_label, node_unit_code in enumerate(self.units.keys()):
                self.layout_graph.add_node(leaf_node_label)
                self.leaf_nodes.append(LeafNode(self.network, self.depth + 1, leaf_node_label, node_unit_code))
                self.graph_label_unit_code_map[leaf_node_label] = node_unit_code
            self.child_nodes_created = True

            return

        # Create an adjacency matrix with the distances between each unit as the edge weights
        distance_matrix = np.ones((len(self.units), len(self.units)), dtype=float)
        np.fill_diagonal(distance_matrix, 0)
        unit_codes = sorted(self.units.keys())
        unit_codes_to_index = {code: i for i, code in enumerate(unit_codes)}
        for from_unit in unit_codes:
            for to_unit in unit_codes:
                edge = (from_unit, to_unit)
                if edge not in self.network.unit_distances.keys():
                    continue
                from_index = unit_codes_to_index[from_unit]
                to_index = unit_codes_to_index[to_unit]
                distance_matrix[from_index, to_index] = self.network.unit_distances[edge]

        # Identify which cluster each unit belongs to based on their distance to each other
        db = DBSCAN(eps=ClusterNode.epsilon,
                    min_samples=ClusterNode.min_samples_in_epsilon_neighborhood,
                    metric='precomputed').fit(distance_matrix)
        labels = db.labels_
        n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
        n_noise_nodes = list(labels).count(-1)

        for cluster_node_label in range(n_clusters):
            # Create a cluster node containing the units identified by the clustering algorithm
            indices_of_units_in_cluster, = np.where(labels == cluster_node_label)
            units_in_cluster = {unit_codes[i]: self.units[unit_codes[i]] for i in indices_of_units_in_cluster}
            cluster_node = ClusterNode(self.network, self.depth + 1, cluster_node_label, units_in_cluster)

            # Add the cluster node to the layout graph and this cluster
            self.sub_clusters.append(cluster_node)
            self.layout_graph.add_node(cluster_node_label)

            # Process the sub-cluster node in a separate thread
            cluster_node.build()

        # Add the leaf nodes to the layout graph and this cluster
        indices_of_noise_units = np.where(labels == -1)
        for i in range(n_noise_nodes):
            leaf_node_label = -i - 1
            node_unit_code = unit_codes[indices_of_noise_units[i]]
            self.layout_graph.add_node(leaf_node_label)
            self.leaf_nodes.append(LeafNode(self.network, self.depth + 1, leaf_node_label, node_unit_code))
            self.graph_label_unit_code_map[leaf_node_label] = node_unit_code

        self.child_nodes_created = True

    def build_layout(self):
        assert self.child_nodes_created, "identify_and_break_into_sub_clusters() must be completed first"

        # Add edges between nodes, with the distance between each node as the edge weight
        all_nodes = chain(self.sub_clusters.__iter__(), self.leaf_nodes.__iter__())
        for node_1 in all_nodes:
            for node_2 in all_nodes:
                if node_1 == node_2:
                    continue
                self.layout_graph.add_edge(node_1.graph_label, node_2.graph_label, weight=node_1.distance(node_2))

        # Use the Kamada-Kawai network layout algorithm on the nodes to determine the layout
        self.node_positions = nx.kamada_kawai_layout(self.layout_graph, scale=ClusterNode.scale)

        self.layout_complete = True

    def apply_layout_to_sub_clusters(self):
        assert self.layout_complete, "build_layout() must be completed first"
        # fixme: Layout will probably be wrong the first time around, come back to this and adjust as necessary

        # Apply this cluster's layout to leaf nodes
        for node in self.leaf_nodes:
            node: LeafNode

            x, y = self.node_positions[node.graph_label]
            self.network.unit_positions[node.unit_code] = (x, y)

        # Apply this cluster's layout to sub-clusters
        for sub_cluster in self.sub_clusters:
            sub_cluster: ClusterNode
            cluster_centroid_x, cluster_centroid_y = self.node_positions[sub_cluster.graph_label]
            cluster_centroid_x *= ClusterNode.scale
            cluster_centroid_y *= ClusterNode.scale

            for graph_label, (x, y) in sub_cluster.node_positions.items():
                x += cluster_centroid_x
                y += cluster_centroid_y
                sub_cluster.node_positions[graph_label] = (x, y)

        self.layouts_applied = True

    def build(self):
        self.identify_and_break_into_sub_clusters()
        self.build_layout()
        self.apply_layout_to_sub_clusters()

    def __iter__(self):
        return self.units.keys().__iter__()


def build_unit_network_layout(units: Dict[str, Unit], unit_distances: Dict[Tuple[str, str], float]) -> Dict[str, Tuple[float, float]]:
    unit_network = UnitNetwork(unit_distances)
    root_node = ClusterNode(unit_network, units=units, depth=0, graph_label=0)
    root_node.build()

    return unit_network.unit_positions


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


def create_unit_graph(units: Dict[str, Unit], distances: Dict[Tuple[str, str], float]) -> nx.DiGraph:
    G = nx.DiGraph()

    # Add units to graph
    for code in units.keys():
        G.add_node(code)

    # Calculate each unit's distance to each other
    for (code_a, code_b), distance in distances.items():
        G.add_edge(code_a, code_b, weight=distance)

    return G

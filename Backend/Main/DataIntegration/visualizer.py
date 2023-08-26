import math
from typing import Dict, Tuple, List

import matplotlib.pyplot as plt
import networkx as nx

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
    if unit_1 in unit_2.prerequisites or unit_2 in unit_1.prerequisites \
            or unit_1 in unit_2.corequisites or unit_2 in unit_1.corequisites:
        similarity += 0.6 * scale

    # Calculate distance using similarity score
    distance = math.exp(-similarity)

    return distance


def draw_unit_network(network: nx.DiGraph, visible_edges: List[Tuple[str, str]]):
    # Determine the layout of the graph using the Kamada-Kawai algorithm
    pos = nx.kamada_kawai_layout(network, scale=1)

    # Draw the graph
    nx.draw_networkx_nodes(network, pos)
    nx.draw_networkx_labels(network, pos)
    # todo: Display co-requisite unit edges differently from prerequisites.
    # todo: Display incompatible unit relations somehow
    nx.draw_networkx_edges(network, pos, edgelist=visible_edges)

    plt.show()


def create_unit_network(units: Dict[str, Unit]) -> Tuple[nx.DiGraph, List[Tuple[str, str]]]:
    G = nx.DiGraph()

    # Add units to graph
    for code in units.keys():
        G.add_node(code)

    # todo: Optimize for larger graphs if necessary. Consider using multithreading.
    # Calculate each unit's "distance" to each other
    for code_a, unit_a in units.items():
        for code_b, unit_b in units.items():
            if code_a == code_b:
                continue
            distance = unit_distance_metric(unit_a, unit_b)
            if distance < 1:
                G.add_edge(code_a, code_b, weight=distance)

    # Find all edges that need to be shown
    visible_edges = set()
    for code, unit in units.items():
        # Add prerequisite units
        if unit.prerequisites:
            for prereq_unit in unit.prerequisites:
                edge = (prereq_unit.code, code)
                if prereq_unit.code not in units.keys():
                    continue
                visible_edges.add(edge)
        # Add co-requisite units
        if unit.corequisites:
            for coreq_unit in unit.corequisites:
                edge = (coreq_unit.code, code)
                if coreq_unit.code not in units.keys() or edge in visible_edges:
                    continue
                visible_edges.add(edge)
        # todo: Think of a way to display incompatible units

    return G, list(visible_edges)

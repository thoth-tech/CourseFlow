import math
from typing import Dict, Tuple, List

import matplotlib.pyplot as plt
import networkx as nx
import numpy as np
import tensorflow as tf
from keras import models
from keras import layers
from keras.callbacks import EarlyStopping
from keras.optimizers import RMSprop

from Backend.Main.Models.constraint import PrerequisitesFulfilledConstraint, CorequisitesFulfilledConstraint
from Backend.Main.Models.unit import Unit


class UnitNetworkOptimizer:
    def __init__(self):
        # todo
        pass

    def loss(self, _, unit_positions: tf.Tensor) -> float:
        # todo: note: input is tf.Tensor of shape (batch size, n units * 2), e.g: (None, 358)
        #  need to reshape into (batch size, n units, 2) or find a way to work with the data as is

        # todo: create loss function that:
        #  - increases as non-similar units are close together
        #  - increases as similar units are far from each other
        #  - increases by a lot when two units are too close to each other
        #  - uses tensorflow operations so it's easily parallelizable in the future

        # todo: possible solution: try to position each node so that they match the distances between each unit exactly?

        # TODO: replace dummy loss function with proper loss function
        mse = tf.keras.losses.MeanSquaredError()
        return mse(_, unit_positions)

    def build(self, units: Dict[str, Unit], distances: Dict[Tuple[str, str], float]) -> Dict[str, Tuple[float, float]]:
        """Uses a simple neural network to create an optimal network layout"""

        # Create an adjacency matrix with the distances between each unit as the edge weights
        distance_matrix = np.zeros((len(units), len(units)), dtype=float)
        unit_names = sorted(units.keys())
        for (from_unit, to_unit), distance in distances.items():
            # todo: optimize to O(1): these .index operations are linear searches
            from_index = unit_names.index(from_unit)
            to_index = unit_names.index(to_unit)
            distance_matrix[from_index, to_index] = distance

        # Create a simple neural network model
        n_hidden_layer_nodes = len(units) + 1
        n_output_layer_nodes = len(units) * 2  # One node in the output layer for each x, y position of each unit
        model = models.Sequential([
            layers.InputLayer(input_shape=(len(units), len(units))),
            layers.Dense(n_hidden_layer_nodes, activation="relu"),
            layers.Dense(n_output_layer_nodes, activation="linear")
        ])
        model.compile(
            optimizer=RMSprop(learning_rate=0.1),
            loss=self.loss
        )

        # Calculate the ideal positions for each unit in the network diagram
        model.fit(distance_matrix,
                  np.zeros((len(units),)),
                  epochs=100,
                  callbacks=[EarlyStopping(monitor="loss", patience=20, min_delta=0.01)]
                  )

        # Get the ideal positions
        positions = model.weights[-1].numpy().reshape(len(units), 2)
        return {name: tuple(positions[i]) for i, name in enumerate(unit_names)}


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


def create_unit_network(units: Dict[str, Unit], distances: Dict[Tuple[str, str], float]) -> Tuple[nx.DiGraph, List[Tuple[str, str]]]:
    G = nx.DiGraph()

    # Add units to graph
    for code in units.keys():
        G.add_node(code)

    # Calculate each unit's distance to each other
    for (code_a, code_b), distance in distances.items():
        G.add_edge(code_a, code_b, weight=distance)

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

    return G, list(visible_edges)

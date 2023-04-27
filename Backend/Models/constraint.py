from numpy._typing import ArrayLike

from Backend.Models.unit import Unit
from typing import Iterable


class Condition:
    """Base class for modeling constraint conditions"""
    # todo: consider using kwargs, fixed args may not be flexible enough. for example, some conditions may need to know
    #  the completed units, some might need to know the course being taken, etc.
    def check(self, units_completed: Iterable[Unit]) -> bool:
        raise NotImplementedError("Subclasses should implement this")


class MinimumNumberOfUnitsCondition(Condition):
    """Fulfilled when a minimum number of units is completed from a pre-defined set of units"""
    def __init__(self, unit_set: Iterable[Unit], minimum_count: int):
        self.set = set(unit_set)
        self.min = minimum_count

    def check(self, units_completed: Iterable[Unit]) -> bool:
        units_completed = set(units_completed)
        return len(self.set.intersection(units_completed)) >= self.min


class PrerequisitesFulfilledCondition(Condition):
    """Fulfilled when all the units from a pre-defined set of units has been completed"""
    def __init__(self, prerequisite_units: Iterable[Unit]):
        # todo: repeated across constructors, consider using super class for pre-processing constructor args
        self.prerequisites = set(prerequisite_units)

    def check(self, units_completed: Iterable[Unit]) -> bool:
        units_completed = set(units_completed)
        return self.prerequisites.issubset(units_completed)


# todo: having prerequisites and corequisites condition may be redundant
class CorequisitesFulfilledCondition(Condition):
    """Fulfilled when all the units from a pre-defined set of units has been completed or is being completed"""
    def __init__(self, corequisite_units: Iterable[Unit]):
        self.corequisites = set(corequisite_units)

    def check(self, units_completed_or_completing: Iterable[Unit]) -> bool:
        units_completed_or_completing = set(units_completed_or_completing)
        return self.corequisites.issubset(units_completed_or_completing)


# todo: may be redundant with coreqs condition
class MutualExclusiveUnitsCondition(Condition):
    """Fulfilled if none of the units from a pre-defined set of units has been completed or is being completed"""
    def __init__(self, incompatible_units: Iterable[Unit]):
        self.incompatible_units = set(incompatible_units)

    def check(self, units_completed_or_completing: Iterable[Unit]) -> bool:
        units_completed_or_completing = set(units_completed_or_completing)
        return bool(self.incompatible_units.intersection(units_completed_or_completing))


class EnrolledInSequenceCondition(Condition):
    """Fulfilled if the student is enrolled in the specified course or major/minor sequence"""
    def __init__(self, sequence: str):
        self.sequence = sequence

    def check(self, sequence: str) -> bool:
        return self.sequence == sequence


class Constraint:
    def __init__(self):
        self.conditions: list[Condition] = []

    def is_fulfilled(self, units_completed: Iterable[Unit]) -> bool:
        return all([condition.check(units_completed) for condition in self.conditions])

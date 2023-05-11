from numpy._typing import ArrayLike

from Backend.Models.stream import Stream
from Backend.Models.unit import Unit
from typing import Iterable, Callable


# todo: write tests for all of these constraints
class Constraint:
    """Base class for modeling constraints"""

    def check(self, **kwargs) -> bool:
        """
        Checks if the constraint has been fulfilled

        :key units_completed:
        :key units_enrolled:
        :key enrolled_stream:
        :key current_wam:

        :return: True if the constraint is met, otherwise False
        """
        raise NotImplementedError("Subclasses should implement this")

    def to_dict(self) -> dict:
        raise NotImplementedError("Subclasses should implement this")


class UniqueConstraint(Constraint):
    """Used to make constraints that have a very limited use case"""

    def __init__(self, constraint_checker: Callable):
        self.constraint_checker = constraint_checker

    def check(self, **kwargs) -> bool:
        return self.constraint_checker(**kwargs)

    def to_dict(self) -> dict:
        return {"type": "unique_constraint"}


class MinimumNumberOfUnitsConstraint(Constraint):
    """Fulfilled when a minimum number of units is completed from a pre-defined set of units"""

    def __init__(self, unit_set: Iterable[Unit], minimum_count: int):
        self.set = set(unit_set)
        self.min = minimum_count

    def check(self, units_completed: Iterable[Unit], **kwargs) -> bool:
        units_completed = set(units_completed)
        return len(self.set.intersection(units_completed)) >= self.min

    def to_dict(self) -> dict:
        return {
            "type": "min_units",
            "units": [unit.code for unit in self.set],
            "min_units": self.min
        }


class MaximumNumberOfUnitsConstraint(Constraint):
    """Fulfilled if the number of units completed from a pre-defined set of units does not exceed the maximum allowed"""

    def __init__(self, unit_set: Iterable[Unit], maximum_count: int):
        self.set = set(unit_set)
        self.max = maximum_count

    def check(self, units_completed: Iterable[Unit], **kwargs):
        units_completed = set(units_completed)
        return len(self.set.intersection(units_completed)) <= self.max

    def to_dict(self) -> dict:
        return {
            "type": "max_units",
            "units": [unit.code for unit in self.set],
            "min_units": self.max
        }


class PrerequisitesFulfilledConstraint(Constraint):
    """Fulfilled when all the units from a pre-defined set of units has been completed"""

    def __init__(self, prerequisite_units: Iterable[Unit]):
        # todo: repeated across constructors, consider using super class for pre-processing constructor args
        self.prerequisites = set(prerequisite_units)

    def check(self, units_completed: Iterable[Unit], **kwargs) -> bool:
        units_completed = set(units_completed)
        return self.prerequisites.issubset(units_completed)

    def to_dict(self) -> dict:
        return {
            "type": "prerequisites",
            "units": [unit.code for unit in self.prerequisites]
        }


# todo: having prerequisites and corequisites constraint may be redundant
class CorequisitesFulfilledConstraint(Constraint):
    """Fulfilled when all the units from a pre-defined set of units has been completed or is being completed"""

    def __init__(self, corequisite_units: Iterable[Unit]):
        self.corequisites = set(corequisite_units)

    def check(self, units_completed: Iterable[Unit], units_enrolled: Iterable[Unit], **kwargs) -> bool:
        units_completed_or_enrolled = set(units_completed).union(units_enrolled)
        return self.corequisites.issubset(units_completed_or_enrolled)

    def to_dict(self) -> dict:
        return {
            "type": "corequisites",
            "units": [unit.code for unit in self.corequisites]
        }


# todo: may be redundant with coreqs constraint
class MutualExclusiveUnitsConstraint(Constraint):
    """Fulfilled if none of the units from a pre-defined set of units has been completed or is being completed"""

    def __init__(self, incompatible_units: Iterable[Unit]):
        self.incompatible_units = set(incompatible_units)

    def check(self, units_completed: Iterable[Unit], units_enrolled: Iterable[Unit], **kwargs) -> bool:
        units_completed_or_enrolled = set(units_completed).union(units_enrolled)
        return bool(self.incompatible_units.intersection(units_completed_or_enrolled))

    def to_dict(self) -> dict:
        return {
            "type": "mutually_exclusive_units",
            "units": [unit.code for unit in self.incompatible_units]
        }


class EnrolledInStreamConstraint(Constraint):
    """Fulfilled if the student is enrolled in the specified stream"""

    def __init__(self, stream: Stream):
        self.stream = stream

    def check(self, enrolled_stream: Stream, **kwargs) -> bool:
        return self.stream == enrolled_stream

    def to_dict(self) -> dict:
        return {
            "type": "stream_enrollment",
            "stream_id": self.stream.ID
        }


class MinimumWamConstraint(Constraint):
    """Fulfilled if the student has the minimum amount of WAM"""

    def __init__(self, minimum_wam: float):
        self.minimum_wam = minimum_wam

    def check(self, current_wam: float, **kwargs) -> bool:
        return current_wam >= self.minimum_wam

    def to_dict(self) -> dict:
        return {
            "type": "minimum_wam",
            "minimum_wam": self.minimum_wam
        }


class AllConstraint(Constraint):
    """Fulfilled if all component constraints are met"""

    def __init__(self, constraints: Iterable[Constraint]):
        self.constraints = constraints

    def check(self,
              units_completed: Iterable[Unit],
              units_enrolled: Iterable[Unit],
              enrolled_stream: Stream,
              current_wam: float) -> bool:

        enrollment_info = {
            "units_completed": units_completed,
            "units_enrolled": units_enrolled,
            "enrolled_stream": enrolled_stream,
            "current_wam": current_wam
        }

        return all(constraint.check(**enrollment_info) for constraint in self.constraints)

    def to_dict(self) -> dict:
        return {
            "type": "pass_all",
            "constraints": [constraint.to_dict() for constraint in self.constraints]
        }


class AnyConstraint(Constraint):
    """Fulfilled if any component constraints are met"""

    def __init__(self, constraints: Iterable[Constraint]):
        self.constraints = constraints

    def check(self,
              units_completed: Iterable[Unit],
              units_enrolled: Iterable[Unit],
              enrolled_stream: Stream,
              current_wam: float) -> bool:

        enrollment_info = {
            "units_completed": units_completed,
            "units_enrolled": units_enrolled,
            "enrolled_stream": enrolled_stream,
            "current_wam": current_wam
        }

        return any(constraint.check(**enrollment_info) for constraint in self.constraints)

    def to_dict(self) -> dict:
        return {
            "type": "pass_any",
            "constraints": [constraint.to_dict() for constraint in self.constraints]
        }

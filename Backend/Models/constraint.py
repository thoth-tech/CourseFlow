from numpy._typing import ArrayLike

from Backend.Models.course import Course, Sequence
from Backend.Models.unit import Unit
from typing import Iterable, Callable


# todo: write tests for all of these constraints
class Constraint:
    """Base class for modeling constraints"""

    # todo: consider using kwargs, fixed args may not be flexible enough. for example, some constraints may need to know
    #  the completed units, some might need to know the course being taken, etc.
    def check(self, **kwargs) -> bool:
        """
        Checks if the constraint has been fulfilled

        :key units_completed:
        :key units_enrolled:
        :key enrolled_course:
        :key enrolled_sequence:
        :key current_wam:

        :return: True if the constraint is met, otherwise False
        """
        raise NotImplementedError("Subclasses should implement this")


class UniqueConstraint(Constraint):
    """Used to make constraints that have a very limited use case"""

    def __init__(self, constraint_checker: Callable):
        self.constraint_checker = constraint_checker

    def check(self, **kwargs) -> bool:
        return self.constraint_checker(**kwargs)


class MinimumNumberOfUnitsConstraint(Constraint):
    """Fulfilled when a minimum number of units is completed from a pre-defined set of units"""

    def __init__(self, unit_set: Iterable[Unit], minimum_count: int):
        self.set = set(unit_set)
        self.min = minimum_count

    def check(self, units_completed: Iterable[Unit], **kwargs) -> bool:
        units_completed = set(units_completed)
        return len(self.set.intersection(units_completed)) >= self.min


class MaximumNumberOfUnitsConstraint(Constraint):
    """Fulfilled if the number of units completed from a pre-defined set of units does not exceed the maximum allowed"""

    def __init__(self, unit_set: Iterable[Unit], maximum_count: int):
        self.set = set(unit_set)
        self.max = maximum_count

    def check(self, units_completed: Iterable[Unit], **kwargs):
        units_completed = set(units_completed)
        return len(self.set.intersection(units_completed)) <= self.max


class PrerequisitesFulfilledConstraint(Constraint):
    """Fulfilled when all the units from a pre-defined set of units has been completed"""

    def __init__(self, prerequisite_units: Iterable[Unit]):
        # todo: repeated across constructors, consider using super class for pre-processing constructor args
        self.prerequisites = set(prerequisite_units)

    def check(self, units_completed: Iterable[Unit], **kwargs) -> bool:
        units_completed = set(units_completed)
        return self.prerequisites.issubset(units_completed)


# todo: having prerequisites and corequisites constraint may be redundant
class CorequisitesFulfilledConstraint(Constraint):
    """Fulfilled when all the units from a pre-defined set of units has been completed or is being completed"""

    def __init__(self, corequisite_units: Iterable[Unit]):
        self.corequisites = set(corequisite_units)

    def check(self, units_completed: Iterable[Unit], units_enrolled: Iterable[Unit], **kwargs) -> bool:
        units_completed_or_enrolled = set(units_completed).union(units_enrolled)
        return self.corequisites.issubset(units_completed_or_enrolled)


# todo: may be redundant with coreqs constraint
class MutualExclusiveUnitsConstraint(Constraint):
    """Fulfilled if none of the units from a pre-defined set of units has been completed or is being completed"""

    def __init__(self, incompatible_units: Iterable[Unit]):
        self.incompatible_units = set(incompatible_units)

    def check(self, units_completed: Iterable[Unit], units_enrolled: Iterable[Unit], **kwargs) -> bool:
        units_completed_or_enrolled = set(units_completed).union(units_enrolled)
        return bool(self.incompatible_units.intersection(units_completed_or_enrolled))


class EnrolledInSequenceConstraint(Constraint):
    """Fulfilled if the student is enrolled in the specified major/minor sequence"""

    def __init__(self, sequence: Sequence):
        self.sequence = sequence

    def check(self, enrolled_sequence: Sequence, **kwargs) -> bool:
        return self.sequence == enrolled_sequence


class EnrolledInCourseConstraint(Constraint):
    """Fulfilled if the student is enrolled in the specified course"""

    def __init__(self, course: Course):
        self.course = course

    def check(self, enrolled_course: Course, **kwargs) -> bool:
        return self.course == enrolled_course


class MinimumWamConstraint(Constraint):
    """Fulfilled if the student has the minimum amount of WAM"""

    def __init__(self, minimum_wam: float):
        self.minimum_wam = minimum_wam

    def check(self, current_wam: float, **kwargs) -> bool:
        return current_wam >= self.minimum_wam


class AllConstraint(Constraint):
    """Fulfilled if all component constraints are met"""

    def __init__(self, constraints: Iterable[Constraint]):
        self.constraints = constraints

    def check(self,
              units_completed: Iterable[Unit],
              units_enrolled: Iterable[Unit],
              enrolled_course: Course,
              enrolled_sequence: Sequence,
              current_wam: float) -> bool:

        enrollment_info = {
            "units_completed": units_completed,
            "units_enrolled": units_enrolled,
            "enrolled_course": enrolled_course,
            "enrolled_sequence": enrolled_sequence,
            "current_wam": current_wam
        }

        return all(constraint.check(**enrollment_info) for constraint in self.constraints)


class AnyConstraint(Constraint):
    """Fulfilled if any component constraints are met"""

    def __init__(self, constraints: Iterable[Constraint]):
        self.constraints = constraints

    def check(self,
              units_completed: Iterable[Unit],
              units_enrolled: Iterable[Unit],
              enrolled_course: Course,
              enrolled_sequence: Sequence,
              current_wam: float) -> bool:

        enrollment_info = {
            "units_completed": units_completed,
            "units_enrolled": units_enrolled,
            "enrolled_course": enrolled_course,
            "enrolled_sequence": enrolled_sequence,
            "current_wam": current_wam
        }

        return any(constraint.check(**enrollment_info) for constraint in self.constraints)

import re
from typing import Dict

from Backend.Models.unit import Unit


# todo: write tests
# fixme: ACA711, ACR210 title capturing "Offering information"
# todo: write tests for second group's lookahead cases
def extract_unit_codes_and_titles(text: str) -> Dict[str, Unit]:
    # Comment partially generated by GPT-3.5 2023-04-06
    # Regex pattern to capture a unit code, title, and raw unit information from a handbook page.
    # 1. Matches three uppercase letters followed by three digits as the unit code,
    # 2. any text between a hyphen or em dash and the text " Enrolment modes:" or " Year:" as the title,
    # 3. and any text before the next unit code using a positive lookahead assertion.
    pattern = re.compile(r"([A-Z]{3}\d{3})"  # 1
                         r" [–-] "
                         r"(.+?)(?= Enrolment modes:| Year:| Offering information:)"  # 2
                         r"(.+?)(?=[A-Z]{3}\d{3} [–-])")  # 3

    units = {}
    # Create a new Unit object for each unit extracted from the handbook
    for match in pattern.finditer(text):
        unit = Unit()
        unit.code = match.group(1)
        unit.title = match.group(2)
        unit.raw_information = match.group(3).strip()

        units[unit.code] = unit

    return units


def extract_unit_enrolment_constraints(units: Dict[str, Unit]) -> Dict[str, Unit]:
    unit_pattern = re.compile(r"[A-Z]{3}\d{3}")

    for unit in list(units.values()):
        constraints_to_fill = [
            (r"Prerequisite: (.+) (?=Corequisite:)", unit.prerequisites),
            (r"Corequisite: (.+)(?=Incompatible with:)", unit.corequisites),
            (r"Incompatible with: (.+)(?=Scheduled learning activities)", unit.incompatible_with)
        ]
        for constraint_search_pattern, constraint in constraints_to_fill:
            # Find all unit codes that are part of the constraint
            constraint_search_result = re.search(constraint_search_pattern, unit.raw_information)
            if constraint_search_result is not None:
                constraint_search_result = unit_pattern.findall(constraint_search_result.group(1))

                # Note every unit listed as part of the constraint by the handbook
                for code in constraint_search_result:
                    if code not in units.keys():
                        new_unit = Unit()
                        units[code] = new_unit
                        new_unit.is_discontinued = True
                        new_unit.code = code
                    constraint.append(units[code])

    return units


def read_unit_details(text: str) -> Dict[str, Unit]:
    # Replace newline characters with spaces
    text = text.replace("\n", " ")
    # Convert any double spaces to single spaces
    text = re.sub(r" {2,}", " ", text)

    # Split the text by unit information
    units = extract_unit_codes_and_titles(text)
    extract_unit_enrolment_constraints(units)

    return units
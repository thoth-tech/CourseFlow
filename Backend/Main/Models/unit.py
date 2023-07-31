import json


class Unit:
    id = 1

    def __init__(self):
        self.code = f"DEFAULT_CODE_{Unit.id}"
        self.title = f"DEFAULT_TITLE_{Unit.id}"
        self.raw_information = ""
        self.description = ""
        self.constraints = []
        self.is_discontinued = False
        Unit.id += 1

    def to_dict(self):
        dict_representation = {
            "code": self.code,
            "title": self.title,
            "description": self.description,
            "constraints": [constraint.to_dict() for constraint in self.constraints],
            "is_discontinued": self.is_discontinued
        }

        return dict_representation

    def to_json(self):
        return json.dumps(self.to_dict(), sort_keys=True, indent=4)

    def __repr__(self):
        return f"{self.code} - {self.title}"

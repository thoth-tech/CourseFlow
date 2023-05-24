class Unit:
    id = 1

    def __init__(self):
        self.code = f"DEFAULT_CODE_{Unit.id}"
        self.title = f"DEFAULT_TITLE_{Unit.id}"
        self.raw_information = ""
        self.description = ""
        self.prerequisites = []
        self.corequisites = []
        self.incompatible_with = []
        self.constraints = {}
        self.is_discontinued = False
        Unit.id += 1

    def __repr__(self):
        return f"{self.code} - {self.title}"

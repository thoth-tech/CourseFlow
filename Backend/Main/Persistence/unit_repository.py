from abc import ABC, abstractmethod
from typing import Iterable

from Backend.Main.Models.unit import Unit
from Backend.Main.Persistence.connect import mongodb_connect


class UnitRepository(ABC):
    @abstractmethod
    def add_unit(self, unit: Unit):
        pass

    @abstractmethod
    def add_multiple_units(self, units: Iterable[Unit]):
        pass

    @abstractmethod
    def get_unit_by_code(self, unit_code: str):
        pass

    @abstractmethod
    def update_unit(self, unit_code: str, updated_unit: Unit):
        pass

    @abstractmethod
    def delete_unit(self, unit_code: str):
        pass


# todo: validation
class MongodbUnitRepository(UnitRepository):
    def __init__(self):
        db = mongodb_connect()
        self.unit_collection = db["unit"]

    def add_unit(self, unit: Unit):
        self.unit_collection.insert_one(unit.to_dict())

    def add_multiple_units(self, units: Iterable[Unit]):
        self.unit_collection.insert_many(unit.to_dict() for unit in units)

    def get_unit_by_code(self, unit_code: str):
        # todo: Can we somehow remove the hardcoded name of the unit code field?
        self.unit_collection.find_one({"code": unit_code})

    def update_unit(self, unit_code: str, updated_unit: Unit):
        self.unit_collection.update_one({"code": unit_code}, updated_unit.to_dict())

    def delete_unit(self, unit_code: str):
        self.unit_collection.delete_one({"code": unit_code})

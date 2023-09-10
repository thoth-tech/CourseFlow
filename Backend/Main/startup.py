from Backend.Main.Persistence.connect import mongodb_connect
from Backend.Main.Persistence.unit_repository import MongodbUnitRepository
from DataIntegration import handbook_reader
from DataIntegration import visualizer


def handbook_reader_and_unit_map_visualizer_demo():
    text = handbook_reader.create_or_read_handbook_text_cache()
    units = handbook_reader.read_unit_details(text)

    # todo: Remove debug filter. The filter is here to speed up the graph creation progress while in development.
    units = {code: unit for code, unit in units.items() if code.startswith("SIT") or code.startswith("MMS")}
    unit_distances = visualizer.calculate_unit_distances(units)
    visible_edges = list(visualizer.find_visible_edges(units))
    unit_network = visualizer.create_unit_network(units, unit_distances)
    positions = visualizer.build_network_layout(units, unit_distances)
    visualizer.draw_unit_network(unit_network, visible_edges)


def mongodb_test():
    class DebugMongodbUnitRepository(MongodbUnitRepository):
        def clear_all_units(self):
            self.unit_collection.delete_many({})

    print("Accessing database")
    controller = DebugMongodbUnitRepository()

    print("Clearing Unit collection")
    controller.clear_all_units()

    print("Reading unit information from handbook")
    text = handbook_reader.create_or_read_handbook_text_cache()
    units = handbook_reader.read_unit_details(text)

    print("Writing units to database")
    controller.add_multiple_units(units.values())


if __name__ == "__main__":
    handbook_reader_and_unit_map_visualizer_demo()

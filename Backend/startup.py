from Backend.Persistence.connect import mongodb_connect
from DataIntegration import handbook_reader
from DataIntegration import visualizer


def handbook_reader_and_unit_map_visualizer_demo():
    text = handbook_reader.create_or_read_handbook_text_cache()
    units = handbook_reader.read_unit_details(text)

    # todo: Remove debug filter. The filter is here to speed up the graph creation progress while in development.
    units = {code: unit for code, unit in units.items() if code.startswith("SIT")}
    unit_network, visible_edges = visualizer.create_unit_network(units)
    visualizer.draw_unit_network(unit_network, visible_edges)


def mongodb_test():
    db = mongodb_connect()
    unit_collection = db["unit"]
    # todo: debug only: clear collection before continuing
    print("Clearing Unit collection")
    unit_collection.delete_many({})

    # Load Units into unit database collection
    text = handbook_reader.create_or_read_handbook_text_cache()
    units = handbook_reader.read_unit_details(text)
    print("Writing units to database")
    unit_collection.insert_many(u.to_dict() for u in units.values())


if __name__ == "__main__":
    mongodb_test()

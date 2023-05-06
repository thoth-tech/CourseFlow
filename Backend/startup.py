from pymongo.errors import OperationFailure

from DataIntegration import handbook_reader
from DataIntegration import visualizer
import os
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


def handbook_reader_and_unit_map_visualizer_demo():
    text = handbook_reader.create_or_read_handbook_text_cache()
    units = handbook_reader.read_unit_details(text)

    # todo: Remove debug filter. The filter is here to speed up the graph creation progress while in development.
    units = {code: unit for code, unit in units.items() if code.startswith("SIT")}
    unit_network, visible_edges = visualizer.create_unit_network(units)
    visualizer.draw_unit_network(unit_network, visible_edges)


def mongodb_test():
    # Load secrets into environment variables
    load_dotenv("Secrets/mongodb_api.env")

    # Get MongoDB database URI. This will result in an error if Backups/Secrets/mongodb_api.env has not been configured
    api_key = os.environ.get("MONGODB_API_KEY")
    api_secret = os.environ.get("MONGODB_API_SECRET")
    uri = api_key.replace("<password>", api_secret)

    # Create a new client and connect to the server
    client = MongoClient(uri, server_api=ServerApi('1'))

    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except OperationFailure as e:
        # todo: handle authentication errors
        raise


if __name__ == "__main__":
    mongodb_test()

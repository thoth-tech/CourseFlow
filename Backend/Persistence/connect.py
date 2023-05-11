from pymongo.database import Database
from pymongo.errors import OperationFailure

import os
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


def mongodb_connect() -> Database:
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
    except OperationFailure as e:
        # todo: handle authentication errors
        raise
    db = client["development"]

    return db

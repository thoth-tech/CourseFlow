using Amazon.Runtime.Internal.Endpoints.StandardLibrary;
using CourseFlow.Backend.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using SharpCompress.Common;
using System;

namespace CourseFlow.Backend
{
    public static class Utils
    {
        public static void RegisterBsonClassMaps()
        {
            BsonClassMap.RegisterClassMap<Unit>(cm =>
            {
                cm.MapProperty(c => c.Code).SetElementName("code");
                cm.MapProperty(c => c.Title).SetElementName("title");
                cm.MapProperty(c => c.Description).SetElementName("description");
                cm.MapProperty(c => c.Constraints).SetElementName("constraints");
                cm.MapProperty(c => c.IsDiscontinued).SetElementName("name");
            });
        }

        private static void ReloadEnvironmentVariables()
        {
            // Load secrets into environment variables
            string filePath = "Secrets/mongodb_api.env";
            foreach (string line in File.ReadAllLines(filePath))
            {
                string[] parts = line.Split('=', StringSplitOptions.RemoveEmptyEntries);

                if (parts.Length != 2)
                    continue;

                Environment.SetEnvironmentVariable(parts[0], parts[1]);
            }
        }

        public static IMongoDatabase MongodbConnect()
        {
            ReloadEnvironmentVariables();

            // TODO: Review the security risks of loading and using secrets like this
            // todo: rename "KEY" -> "URI"
            // Get MongoDB database URI. This will result in an error if Backups/Secrets/mongodb_api.env has not been configured
            string? connectionURI = Environment.GetEnvironmentVariable("MONGODB_API_KEY");
            string? connectionPassword = Environment.GetEnvironmentVariable("MONGODB_API_SECRET");
            if (connectionURI == null || connectionPassword == null)
            {
                throw new ArgumentNullException("MONGODB_API_KEY or MONGODB_API_SECRET environment variables are empty or do not exist");
            }
            connectionURI = connectionURI.Replace("<password>", connectionPassword);

            var client = new MongoClient(connectionURI);
            return client.GetDatabase("development");
        }
    }
}

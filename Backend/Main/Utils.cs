using Amazon.Runtime.Internal.Endpoints.StandardLibrary;
using CourseFlow.Backend.Models;
using CourseFlow.Backend.Models.Constraints;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;
using SharpCompress.Common;
using System;

namespace CourseFlow.Backend
{
    public class ConstraintDiscriminatorConvention : IDiscriminatorConvention
    {
        private Dictionary<string, Type> discriminatorToTypeMap = new();
        private Dictionary<Type, string> typeToDiscriminatorMap = new();
        public string ElementName => "type";
        private IDiscriminatorConvention defaultConvention;

        public ConstraintDiscriminatorConvention()
        {
            defaultConvention = new HierarchicalDiscriminatorConvention(ElementName);
        }

        public ConstraintDiscriminatorConvention RegisterDiscriminator<T>(string discriminatorName) where T : AbstractConstraint
        { 
            discriminatorToTypeMap[discriminatorName] = typeof(T);
            typeToDiscriminatorMap[typeof(T)] = discriminatorName;
            BsonSerializer.RegisterDiscriminatorConvention(typeof(T), this);

            return this;
        }

        public void RemoveDiscriminator(string discriminatorName)
        {
            typeToDiscriminatorMap.Remove(discriminatorToTypeMap[discriminatorName]);
            discriminatorToTypeMap.Remove(discriminatorName);
        }        
        
        public void RemoveDiscriminator(Type discriminatorType)
        {
            discriminatorToTypeMap.Remove(typeToDiscriminatorMap[discriminatorType]);
            typeToDiscriminatorMap.Remove(discriminatorType);
        }

        public new Type GetActualType(IBsonReader bsonReader, Type nominalType)
        {
            var bookmark = bsonReader.GetBookmark();
            bsonReader.ReadStartDocument();
            if (bsonReader.FindElement(ElementName))
            {
                var documentDiscriminatorValue = bsonReader.ReadString();
                // Map the discriminator value to the corresponding concrete type
                foreach (string constraintDiscriminatorValue in discriminatorToTypeMap.Keys)
                {
                    if (documentDiscriminatorValue == constraintDiscriminatorValue)
                    {
                        bsonReader.ReturnToBookmark(bookmark);
                        return discriminatorToTypeMap[constraintDiscriminatorValue];
                    }
                }

                throw new NotImplementedException($"Discriminator value {documentDiscriminatorValue} does not belong to any registered constraint. Register constraints with discriminators using RegisterDiscriminator()");
            }

            bsonReader.ReturnToBookmark(bookmark);
            return defaultConvention.GetActualType(bsonReader, nominalType);
        }

        public BsonValue GetDiscriminator(Type nominalType, Type actualType)
        {
            if (!typeToDiscriminatorMap.Keys.Contains(actualType))
            { 
                throw new NotImplementedException($"Constraint {actualType} is not registered to a discriminator. Register constraints with discriminators using RegisterDiscriminator()");
            }
            return typeToDiscriminatorMap[actualType];
        }
    }

    public static class Utils
    {
        public static void RegisterBsonClassMaps()
        {
            // Fixes issue outlined at https://medium.com/it-dead-inside/net-mongodb-driver-2-19-breaking-serialization-errors-b456134a1a2d
            var objectSerializer = new ObjectSerializer(type => 
            ObjectSerializer.DefaultAllowedTypes(type)
            || type.FullName.StartsWith("CourseFlow.Backend"));
            BsonSerializer.RegisterSerializer(objectSerializer);

            BsonClassMap.RegisterClassMap<Unit>(cm =>
            {
                cm.MapProperty(c => c.Code).SetElementName("code");
                cm.MapProperty(c => c.Title).SetElementName("title");
                cm.MapProperty(c => c.Description).SetElementName("description");
                cm.MapProperty(c => c.Constraints).SetElementName("constraints");
                cm.MapProperty(c => c.IsDiscontinued).SetElementName("name");
            });

            // todo: Add discriminators to classmap definitions so that we can serialize documents to correct format and deserialize documents to correct object type
            BsonClassMap.RegisterClassMap<AllConstraint>(cm =>
            {
                cm.MapProperty(c => c.Constraints).SetElementName("constraints");
            });

            BsonClassMap.RegisterClassMap<AnyConstraint>(cm =>
            {
                cm.MapProperty(c => c.Constraints).SetElementName("constraints");
            });

            BsonClassMap.RegisterClassMap<CorequisitesFulfilledConstraint>(cm =>
            {
                cm.MapProperty(c => c.Corequisites).SetElementName("units");
            });

            BsonClassMap.RegisterClassMap<EnrolledInStreamConstraint>(cm =>
            {
                cm.MapProperty(c => c.StreamCode).SetElementName("stream_code");
            });

            BsonClassMap.RegisterClassMap<MaximumNumberOfUnitsConstraint>(cm =>
            {
                cm.MapProperty(c => c.UnitSet).SetElementName("units");
                cm.MapProperty(c => c.MaximumCount).SetElementName("max_units");
            });

            BsonClassMap.RegisterClassMap<MinimumNumberOfUnitsConstraint>(cm =>
            {
                cm.MapProperty(c => c.UnitSet).SetElementName("units");
                cm.MapProperty(c => c.MinimumCount).SetElementName("min_units");
            });

            BsonClassMap.RegisterClassMap<MinimumWamConstraint>(cm =>
            {
                cm.MapProperty(c => c.MinimumWam).SetElementName("minimum_wam");
            });

            BsonClassMap.RegisterClassMap<MutualExclusiveUnitsConstraint>(cm =>
            {
                cm.MapProperty(c => c.IncompatibleUnits).SetElementName("units");
            });

            BsonClassMap.RegisterClassMap<PrerequisitesFulfilledConstraint>(cm =>
            {
                cm.MapProperty(c => c.Prerequisites).SetElementName("units");
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

﻿using CourseFlow.Backend.Models;
using CourseFlow.Backend.Models.Constraints;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System.Linq;

namespace CourseFlow.Backend.Persistence;

// todo: Return all responses and response information in a BSON document
public class UnitRepository : IUnitRepository
{
    private readonly IMongoCollection<BsonDocument> unitsCollection;
    public UnitRepository()
    {
        IMongoDatabase db = Utils.MongodbConnect();
        unitsCollection = db.GetCollection<BsonDocument>("unit");
    }

    public void AddMultipleUnits(IEnumerable<IUnit> units)
    {
        unitsCollection.InsertMany(from unit in units select unit.ToBsonDocument());
    }

    public void AddUnit(IUnit unit)
    {
        unitsCollection.InsertOne(unit.ToBsonDocument());
    }

    public void DeleteUnit(string unitCode)
    {
        // todo: Security: Fix possible query injection exploit. Need to validate unitCode before use.
        var filter = Builders<BsonDocument>.Filter.Eq("code", unitCode);
        unitsCollection.DeleteOne(filter);
    }

    public IEnumerable<IUnit> GetAllUnits()
    {
        List<IUnit> units = new List<IUnit>();
        foreach (BsonDocument unitDocument in unitsCollection.Find(_ => true).ToEnumerable()) 
        {
            units.Add(BsonSerializer.Deserialize<Unit>(unitDocument));
        }

        return units;
    }

    public IUnit? GetUnitByCode(string unitCode)
    {
        // todo: Security: Fix possible query injection exploit. Need to validate unitCode before use.
        FilterDefinition<BsonDocument> filter = Builders<BsonDocument>.Filter.Eq("code", unitCode);
        BsonDocument unitDocument = unitsCollection.Find(filter).FirstOrDefault();

        if (unitDocument == null)
        {
            return null;
        }

        return BsonSerializer.Deserialize<Unit>(unitDocument);
    }

    public IEnumerable<IUnit> SearchUnits(UnitSearchQuery query)
    {
        // todo: Security: Fix possible query injection exploit. Need to validate query parameters before use.
        FilterDefinitionBuilder<BsonDocument> builder = Builders<BsonDocument>.Filter;
        FilterDefinition<BsonDocument> filter = builder.And(
            builder.Regex("code", query.Code),
            builder.Regex("title", query.Title),
            builder.Regex("description", string.Join("|", query.Keywords)),
            builder.Eq("level", query.Level));

        List<IUnit> units = new List<IUnit>();
        foreach (BsonDocument unitDocument in unitsCollection.Find(filter).ToEnumerable())
        {
            units.Add(BsonSerializer.Deserialize<Unit>(unitDocument));
        }

        return units;
    }

    public IEnumerable<IUnit> SearchUnitsByCode(string unitCode)
    {
        // todo: Security: Fix possible query injection exploit. Need to validate unitCode before use.
        FilterDefinition<BsonDocument> filter = Builders<BsonDocument>.Filter.Eq("code", unitCode);

        List<IUnit> units = new List<IUnit>();
        foreach (BsonDocument unitDocument in unitsCollection.Find(filter).ToEnumerable())
        {
            units.Add(BsonSerializer.Deserialize<Unit>(unitDocument));
        }

        return units;
    }

    public void UpdateUnit(string unitCode, IUnit updatedUnit)
    {
        // todo: Security: Fix possible query injection exploit. Need to validate unitCode before use.
        FilterDefinition<BsonDocument> filter = Builders<BsonDocument>.Filter.Eq("code", unitCode);
        UpdateDefinition<BsonDocument> updateDefinition = Builders<BsonDocument>.Update
            .Set("code", updatedUnit.Code)
            .Set("title", updatedUnit.Title)
            .Set("description", updatedUnit.Description)
            .Set("constraints", updatedUnit.Constraints.ToBsonDocument())
            .Set("is_discontinued", updatedUnit.IsDiscontinued);
        unitsCollection.UpdateOne(filter, updateDefinition);
    }
}

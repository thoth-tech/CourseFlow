using CourseFlow.Backend.Models;
using CourseFlow.Backend.Models.Constraints;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;

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

    public IUnit GetUnitByCode(string unitCode)
    {
        // todo: Security: Fix possible query injection exploit. Need to validate unitCode before use.
        FilterDefinition<BsonDocument> filter = Builders<BsonDocument>.Filter.Eq("code", unitCode);
        // todo: Handle possible nullref if FirstOrDefault defaults
        BsonDocument unitDocument = unitsCollection.Find(filter).FirstOrDefault();

        return BsonSerializer.Deserialize<Unit>(unitDocument);
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

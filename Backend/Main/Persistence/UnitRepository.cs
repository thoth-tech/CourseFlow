using CourseFlow.Backend.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace CourseFlow.Backend.Persistence
{
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
            throw new NotImplementedException();
        }

        public void AddUnit(IUnit unit)
        {
            throw new NotImplementedException();
        }

        public void DeleteUnit(string unitCode)
        {
            throw new NotImplementedException();
        }

        public IUnit GetUnitByCode(string unitCode)
        {
            throw new NotImplementedException();
        }

        public void UpdateUnit(string unitCode, IUnit updatedUnit)
        {
            throw new NotImplementedException();
        }
    }
}

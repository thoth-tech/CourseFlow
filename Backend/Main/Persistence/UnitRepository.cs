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

        public void DeleteUnit(string unit_code)
        {
            throw new NotImplementedException();
        }

        public IUnit GetUnitByCode(string unit_code)
        {
            throw new NotImplementedException();
        }

        public void UpdateUnit(string unit_code, IUnit unit)
        {
            throw new NotImplementedException();
        }
    }
}

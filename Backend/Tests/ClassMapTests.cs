using CourseFlow.Backend;
using CourseFlow.Backend.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;

namespace CourseFlow_Tests;

[TestClass]
public class ClassMapTests
{
    [TestMethod]
    public void serialize_unit_to_bson_test()
    {
        Utils.RegisterBsonClassMaps();

        Unit unit = new Unit();
        unit.Code = "TST123";
        unit.Title = "TEST_UNIT";
        unit.Description = "description ...";

        string document = unit.ToBsonDocument().ToString();

        Assert.Equals(document, "");
    }
}
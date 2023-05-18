using CourseFlow.Backend;
using CourseFlow.Backend.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;

namespace CourseFlow_Tests;

[TestClass]
public class ClassMapTests
{
    [TestMethod]
    public void serialize_unit_to_bson()
    {
        Utils.RegisterBsonClassMaps();

        Unit unit = new Unit();
        unit.Code = "TST123";
        unit.Title = "TEST_UNIT";
        unit.Description = "description ...";

        BsonDocument document = unit.ToBsonDocument();

        string expectedContents = "{ \"code\" : \"TST123\", \"title\" : \"TEST_UNIT\", \"description\" : \"description ...\", \"constraints\" : [], \"name\" : false }";
        Assert.AreEqual(document.ToString(), expectedContents);
    }
}
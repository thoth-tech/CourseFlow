using CourseFlow.Backend;
using CourseFlow.Backend.Models;
using CourseFlow.Backend.Models.Constraints;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;

namespace CourseFlow.Tests;

[TestClass]
public class UnitClassMapTests
{
    [TestMethod]
    public void serialize_unit_to_bson()
    {
        Unit unit = new Unit();
        unit.Code = "TST123";
        unit.Title = "TEST_UNIT";
        unit.Description = "description ...";

        BsonDocument document = unit.ToBsonDocument();

        string expectedContents = "{ \"code\" : \"TST123\", \"title\" : \"TEST_UNIT\", \"description\" : \"description ...\", \"constraints\" : [], \"name\" : false }";
        Assert.AreEqual(document.ToString(), expectedContents);
    }

    [TestMethod]
    public void serialize_unit_with_constraints_to_bson()
    {
        Unit unit = new Unit();
        unit.Code = "TST123";
        unit.Title = "TEST_UNIT";
        unit.Description = "description ...";
        unit.Constraints = new List<AbstractConstraint> { };

        BsonDocument document = unit.ToBsonDocument();

        string expectedContents = "{ \"code\" : \"TST123\", \"title\" : \"TEST_UNIT\", \"description\" : \"description ...\", \"constraints\" : [], \"name\" : false }";
        Assert.AreEqual(document.ToString(), expectedContents);
    }
}
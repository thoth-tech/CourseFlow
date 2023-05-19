using CourseFlow.Backend;
using CourseFlow.Backend.Models;
using CourseFlow.Backend.Models.Constraints;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseFlow.Tests;

[TestClass]
public class ConstraintClassMapTests
{
    [TestMethod]
    public void serialize_minimum_wam_constraint_to_bson()
    {
        MinimumWamConstraint constraint = new MinimumWamConstraint(65);
        BsonDocument document = constraint.ToBsonDocument();

        string expectedContents = "{ \"minimum_wam\" : 65.0 }";
        string actualContents = document.ToString();
        Assert.AreEqual(expectedContents, actualContents);
    }

    [TestMethod]
    public void serialize_all_constraint_to_bson()
    {
        AllConstraint constraint = new AllConstraint(new List<AbstractConstraint> 
        {
            new PrerequisitesFulfilledConstraint(MockupUnitSets.SetA),
            new CorequisitesFulfilledConstraint(MockupUnitSets.SetD),
            new MinimumWamConstraint(65)
        });
        BsonDocument document = constraint.ToBsonDocument();

        string expectedContents = "{ \"constraints\" : [{ \"_t\" : \"PrerequisitesFulfilledConstraint\", \"units\" : [{ \"_t\" : \"Unit\", \"code\" : \"TST1\", \"title\" : \"EXAMPLE_UNIT_1\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST2\", \"title\" : \"EXAMPLE_UNIT_2\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST3\", \"title\" : \"EXAMPLE_UNIT_3\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST4\", \"title\" : \"EXAMPLE_UNIT_4\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST5\", \"title\" : \"EXAMPLE_UNIT_5\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }] }, { \"_t\" : \"CorequisitesFulfilledConstraint\", \"units\" : [{ \"_t\" : \"Unit\", \"code\" : \"TST6\", \"title\" : \"EXAMPLE_UNIT_6\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST7\", \"title\" : \"EXAMPLE_UNIT_7\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST8\", \"title\" : \"EXAMPLE_UNIT_8\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST9\", \"title\" : \"EXAMPLE_UNIT_9\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST10\", \"title\" : \"EXAMPLE_UNIT_10\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }] }, { \"_t\" : \"MinimumWamConstraint\", \"minimum_wam\" : 65.0 }] }";
        string actualContents = document.ToString();
        Assert.AreEqual(expectedContents, actualContents);
    }

    [TestMethod]
    public void serialize_any_constraint_to_bson()
    {
        AnyConstraint constraint = new AnyConstraint(new List<AbstractConstraint> 
        {
            new PrerequisitesFulfilledConstraint(MockupUnitSets.SetA),
            new CorequisitesFulfilledConstraint(MockupUnitSets.SetD),
            new MinimumWamConstraint(65)
        });
        BsonDocument document = constraint.ToBsonDocument();

        string expectedContents = "{ \"constraints\" : [{ \"_t\" : \"PrerequisitesFulfilledConstraint\", \"units\" : [{ \"_t\" : \"Unit\", \"code\" : \"TST1\", \"title\" : \"EXAMPLE_UNIT_1\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST2\", \"title\" : \"EXAMPLE_UNIT_2\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST3\", \"title\" : \"EXAMPLE_UNIT_3\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST4\", \"title\" : \"EXAMPLE_UNIT_4\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST5\", \"title\" : \"EXAMPLE_UNIT_5\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }] }, { \"_t\" : \"CorequisitesFulfilledConstraint\", \"units\" : [{ \"_t\" : \"Unit\", \"code\" : \"TST6\", \"title\" : \"EXAMPLE_UNIT_6\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST7\", \"title\" : \"EXAMPLE_UNIT_7\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST8\", \"title\" : \"EXAMPLE_UNIT_8\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST9\", \"title\" : \"EXAMPLE_UNIT_9\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST10\", \"title\" : \"EXAMPLE_UNIT_10\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }] }, { \"_t\" : \"MinimumWamConstraint\", \"minimum_wam\" : 65.0 }] }";
        string actualContents = document.ToString();
        Assert.AreEqual(expectedContents, actualContents);
    }

    [TestMethod]
    public void serialize_corequisites_fulfilled_constraint_to_bson()
    {
        CorequisitesFulfilledConstraint constraint = new CorequisitesFulfilledConstraint(MockupUnitSets.SetA);
        BsonDocument document = constraint.ToBsonDocument();

        string expectedContents = "{ \"units\" : [{ \"_t\" : \"Unit\", \"code\" : \"TST1\", \"title\" : \"EXAMPLE_UNIT_1\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST2\", \"title\" : \"EXAMPLE_UNIT_2\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST3\", \"title\" : \"EXAMPLE_UNIT_3\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST4\", \"title\" : \"EXAMPLE_UNIT_4\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST5\", \"title\" : \"EXAMPLE_UNIT_5\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }] }";
        string actualContents = document.ToString();
        Assert.AreEqual(expectedContents, actualContents);
    }

    [TestMethod]
    public void serialize_enrolled_in_stream_constraint_to_bson()
    {
        EnrolledInStreamConstraint constraint = new EnrolledInStreamConstraint("TEST_STREAM_1");
        BsonDocument document = constraint.ToBsonDocument();

        string expectedContents = "{ \"stream_code\" : \"TEST_STREAM_1\" }";
        string actualContents = document.ToString();
        Assert.AreEqual(expectedContents, actualContents);
    }

    [TestMethod]
    public void serialize_max_units_constraint_to_bson()
    {
        MaximumNumberOfUnitsConstraint constraint = new MaximumNumberOfUnitsConstraint(MockupUnitSets.SetA, 3);
        BsonDocument document = constraint.ToBsonDocument();

        string expectedContents = "{ \"units\" : [{ \"_t\" : \"Unit\", \"code\" : \"TST1\", \"title\" : \"EXAMPLE_UNIT_1\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST2\", \"title\" : \"EXAMPLE_UNIT_2\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST3\", \"title\" : \"EXAMPLE_UNIT_3\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST4\", \"title\" : \"EXAMPLE_UNIT_4\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST5\", \"title\" : \"EXAMPLE_UNIT_5\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }], \"max_units\" : 3 }";
        string actualContents = document.ToString();
        Assert.AreEqual(expectedContents, actualContents);
    }

    [TestMethod]
    public void serialize_min_units_constraint_to_bson()
    {
        MinimumNumberOfUnitsConstraint constraint = new MinimumNumberOfUnitsConstraint(MockupUnitSets.SetA, 3);
        BsonDocument document = constraint.ToBsonDocument();

        string expectedContents = "{ \"units\" : [{ \"_t\" : \"Unit\", \"code\" : \"TST1\", \"title\" : \"EXAMPLE_UNIT_1\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST2\", \"title\" : \"EXAMPLE_UNIT_2\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST3\", \"title\" : \"EXAMPLE_UNIT_3\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST4\", \"title\" : \"EXAMPLE_UNIT_4\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST5\", \"title\" : \"EXAMPLE_UNIT_5\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }], \"min_units\" : 3 }";
        string actualContents = document.ToString();
        Assert.AreEqual(expectedContents, actualContents);
    }

    [TestMethod]
    public void serialize_mutually_exclusive_units_constraint_to_bson()
    {
        MutualExclusiveUnitsConstraint constraint = new MutualExclusiveUnitsConstraint(MockupUnitSets.SetA);
        BsonDocument document = constraint.ToBsonDocument();

        string expectedContents = "{ \"units\" : [{ \"_t\" : \"Unit\", \"code\" : \"TST1\", \"title\" : \"EXAMPLE_UNIT_1\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST2\", \"title\" : \"EXAMPLE_UNIT_2\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST3\", \"title\" : \"EXAMPLE_UNIT_3\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST4\", \"title\" : \"EXAMPLE_UNIT_4\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST5\", \"title\" : \"EXAMPLE_UNIT_5\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }] }";
        string actualContents = document.ToString();
        Assert.AreEqual(expectedContents, actualContents);
    }

    [TestMethod]
    public void serialize_prerequisites_fulfilled_constraint_to_bson()
    {
        PrerequisitesFulfilledConstraint constraint = new PrerequisitesFulfilledConstraint(MockupUnitSets.SetA);
        BsonDocument document = constraint.ToBsonDocument();

        string expectedContents = "{ \"units\" : [{ \"_t\" : \"Unit\", \"code\" : \"TST1\", \"title\" : \"EXAMPLE_UNIT_1\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST2\", \"title\" : \"EXAMPLE_UNIT_2\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST3\", \"title\" : \"EXAMPLE_UNIT_3\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST4\", \"title\" : \"EXAMPLE_UNIT_4\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }, { \"_t\" : \"Unit\", \"code\" : \"TST5\", \"title\" : \"EXAMPLE_UNIT_5\", \"description\" : \"...\", \"constraints\" : [], \"name\" : false }] }";
        string actualContents = document.ToString();
        Assert.AreEqual(expectedContents, actualContents);
    }
}

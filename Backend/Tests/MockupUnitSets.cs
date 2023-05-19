using CourseFlow.Backend.Models;
using CourseFlow.Backend.Models.Constraints;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseFlow.Tests;

public static class MockupUnitSets
{
    /// <summary>
    /// Contains 5 example units, with 2 units overlapping with set B
    /// </summary>
    public static List<Unit> SetA 
    {
        get
        { 
            return new List<Unit> {
                new Unit("TST1", "EXAMPLE_UNIT_1", "...", new List<AbstractConstraint>(), false),
                new Unit("TST2", "EXAMPLE_UNIT_2", "...", new List<AbstractConstraint>(), false),
                new Unit("TST3", "EXAMPLE_UNIT_3", "...", new List<AbstractConstraint>(), false),
                new Unit("TST4", "EXAMPLE_UNIT_4", "...", new List<AbstractConstraint>(), false),
                new Unit("TST5", "EXAMPLE_UNIT_5", "...", new List<AbstractConstraint>(), false)
            };
        }
    }

    /// <summary>
    /// Contains 4 example units, with 2 units overlapping with set A
    /// </summary>
    public static List<Unit> SetB
    {
        get
        {
            return new List<Unit> {
                new Unit("TST4", "EXAMPLE_UNIT_4", "...", new List<AbstractConstraint>(), false),
                new Unit("TST5", "EXAMPLE_UNIT_5", "...", new List<AbstractConstraint>(), false),
                new Unit("TST6", "EXAMPLE_UNIT_6", "...", new List<AbstractConstraint>(), false),
                new Unit("TST7", "EXAMPLE_UNIT_7", "...", new List<AbstractConstraint>(), false)
            };
        }
    }

    /// <summary>
    /// Contains 10 example units, with sets A and B being proper subsets of this set
    /// </summary>
    public static List<Unit> SetC
    {
        get
        {
            return new List<Unit> {
                new Unit("TST1", "EXAMPLE_UNIT_1", "...", new List<AbstractConstraint>(), false),
                new Unit("TST2", "EXAMPLE_UNIT_2", "...", new List<AbstractConstraint>(), false),
                new Unit("TST3", "EXAMPLE_UNIT_3", "...", new List<AbstractConstraint>(), false),
                new Unit("TST4", "EXAMPLE_UNIT_4", "...", new List<AbstractConstraint>(), false),
                new Unit("TST5", "EXAMPLE_UNIT_5", "...", new List<AbstractConstraint>(), false),
                new Unit("TST6", "EXAMPLE_UNIT_6", "...", new List<AbstractConstraint>(), false),
                new Unit("TST7", "EXAMPLE_UNIT_7", "...", new List<AbstractConstraint>(), false),
                new Unit("TST8", "EXAMPLE_UNIT_8", "...", new List<AbstractConstraint>(), false),
                new Unit("TST9", "EXAMPLE_UNIT_9", "...", new List<AbstractConstraint>(), false),
                new Unit("TST10", "EXAMPLE_UNIT_10", "...", new List<AbstractConstraint>(), false),
            };
        }
    }

    /// <summary>
    /// Contains 5 example units. Sets A and D have no overlapping units. The union of A and D is C.
    /// </summary>
    public static List<Unit> SetD
    {
        get
        {
            return new List<Unit> {
                new Unit("TST6", "EXAMPLE_UNIT_6", "...", new List<AbstractConstraint>(), false),
                new Unit("TST7", "EXAMPLE_UNIT_7", "...", new List<AbstractConstraint>(), false),
                new Unit("TST8", "EXAMPLE_UNIT_8", "...", new List<AbstractConstraint>(), false),
                new Unit("TST9", "EXAMPLE_UNIT_9", "...", new List<AbstractConstraint>(), false),
                new Unit("TST10", "EXAMPLE_UNIT_10", "...", new List<AbstractConstraint>(), false),
            };
        }
    }
}

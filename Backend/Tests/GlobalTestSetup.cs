using CourseFlow.Backend;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseFlow.Tests;

[TestClass]
public class GlobalTestSetup
{
    [AssemblyInitialize]
    public static void Initialize(TestContext testContext)
    {
        Utils.RegisterBsonClassMaps();
    }
}

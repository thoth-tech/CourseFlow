using CourseFlow.Backend.Models.Constraints;

namespace CourseFlow.Backend.Models;

public interface IUnit
{
    string Code { get; set; }
    string Title { get; set; }
    string Description { get; set; }
    IEnumerable<AbstractConstraint> Constraints { get; set; }
    bool IsDiscontinued { get; set; }
}

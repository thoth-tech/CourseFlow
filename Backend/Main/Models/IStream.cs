using CourseFlow.Backend.Models.Constraints;

namespace CourseFlow.Backend.Models;

public interface IStream
{
    string Code { get; set; }

    /// <summary>
    /// URL to the official handbook webpage for this stream
    /// </summary>
    string HandbookUrl { get; set; }

    /// <summary>
    /// Array of constraint objects that describe the rules for completing this stream
    /// </summary>
    IEnumerable<AbstractConstraint> Constraints { get; set; }
}

using CourseFlow.Backend.Models.Constraints;

namespace CourseFlow.Backend.Models;

// todo: Write BSON serializer in CourseFlow.Backend.Utils.RegisterBsonClassMaps
public class Stream : IStream
{
    public string Code { get; set; }
    public string HandbookUrl { get; set; }
    public IEnumerable<AbstractConstraint> Constraints { get; set; }
}

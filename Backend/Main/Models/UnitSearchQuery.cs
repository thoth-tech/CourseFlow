using CourseFlow.Backend.Models.Constraints;

namespace CourseFlow.Backend.Models;

public class UnitSearchQuery
{
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public IEnumerable<string> Keywords { get; set; } = new List<string>();
    public int Level { get; set; }
}
 
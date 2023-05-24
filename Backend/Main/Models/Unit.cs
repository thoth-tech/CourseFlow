using CourseFlow.Backend.Models.Constraints;

namespace CourseFlow.Backend.Models;

public class Unit : IUnit
{
    private static int id = 0;
    public string Code { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public IEnumerable<AbstractConstraint> Constraints { get; set; }
    public bool IsDiscontinued { get; set; }

    public Unit() : this($"DEFAULT_CODE_{id}", $"DEFAULT_TITLE_{id}", "", new List<AbstractConstraint>(), false) { }

    public Unit(string code, string title, string description, IEnumerable<AbstractConstraint> constraints, bool isDiscontinued)
    {
        Code = code;
        Title = title;
        Description = description;
        Constraints = constraints;
        IsDiscontinued = isDiscontinued;
        id++;
    }

    public override bool Equals(object? obj)
    {
        if (obj is not Unit other)
        {
            return false;
        }

        return Code == other.Code;
    }
}

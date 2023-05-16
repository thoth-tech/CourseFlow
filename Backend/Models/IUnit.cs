namespace CourseFlow.Backend.Models
{
    public interface IUnit
    {
        string Code { get; set; }
        string Title { get; set; }
        string Description { get; set; }
        IEnumerable<IConstraint> Constraints { get; set; }
        bool IsDiscontinued { get; set; }
    }
}

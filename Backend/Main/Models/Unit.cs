using CourseFlow.Backend.Models.Constraints;

namespace CourseFlow.Backend.Models
{
    // todo: override default equality comparer so the constraints checkers work
    public class Unit : IUnit
    {
        private static int id = 0;
        public string Code { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public IEnumerable<IConstraint> Constraints { get; set; }
        public bool IsDiscontinued { get; set; }

        public Unit() : this($"DEFAULT_CODE_{id}", $"DEFAULT_TITLE_{id}", "", new List<IConstraint>(), false) { }

        public Unit(string code, string title, string description, IEnumerable<IConstraint> constraints, bool isDiscontinued)
        {
            Code = code;
            Title = title;
            Description = description;
            Constraints = constraints;
            IsDiscontinued = isDiscontinued;
            id++;
        }
    }
}

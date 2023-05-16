namespace CourseFlow.Backend.Models
{
    public class Unit : IUnit
    {
        private static int id = 0;
        public Unit()
        {
            Code = $"DEFAULT_CODE_{id}";
            Title = $"DEFAULT_TITLE_{id}";
            Description = "";
            Constraints = new List<IConstraint>();
            IsDiscontinued = false;
            id++;
        }

        public string Code { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public IEnumerable<IConstraint> Constraints { get; set; }
        public bool IsDiscontinued { get; set; }
    }
}

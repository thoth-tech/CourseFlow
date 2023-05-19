namespace CourseFlow.Backend.Models.Constraints
{
    /// <summary>
    /// Fulfilled when all the units from a pre-defined set of units has been completed
    /// </summary>
    public class PrerequisitesFulfilledConstraint : AbstractConstraint
    {
        private HashSet<IUnit> prerequisites;
        public IEnumerable<IUnit> Prerequisites 
        {
            get => prerequisites;
            set => prerequisites = new HashSet<IUnit>(value);
        }

        public PrerequisitesFulfilledConstraint(IEnumerable<IUnit> prerequisites)
        {
            this.prerequisites = new HashSet<IUnit>(prerequisites);
        }

        private bool Check(IEnumerable<IUnit>? unitsCompleted)
        { 
            return unitsCompleted != null && prerequisites.IsSubsetOf(unitsCompleted);
        }

        public override bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            return Check(unitsCompleted);
        }

        public override bool Equals(object? obj)
        {
            var other = obj as PrerequisitesFulfilledConstraint;
            if (other == null) return false;

            return Enumerable.SequenceEqual(prerequisites.OrderBy(e => e.GetType().Name), prerequisites.OrderBy(e => e.GetType().Name));
        }
    }
}

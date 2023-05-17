namespace CourseFlow.Backend.Models.Constraints
{
    /// <summary>
    /// Fulfilled when all the units from a pre-defined set of units has been completed
    /// </summary>
    public class PrerequisitesFulfilledConstraint : IConstraint
    {
        private HashSet<IUnit> prerequisites;
        public PrerequisitesFulfilledConstraint(IEnumerable<IUnit> prerequisites)
        {
            this.prerequisites = new HashSet<IUnit>(prerequisites);
        }

        private bool Check(IEnumerable<IUnit>? unitsCompleted)
        { 
            return unitsCompleted != null && prerequisites.IsSubsetOf(unitsCompleted);
        }

        public bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            return Check(unitsCompleted);
        }
    }
}

namespace CourseFlow.Backend.Models.Constraints
{
    /// <summary>
    /// Fulfilled when all the units from a pre-defined set of units has been completed or is being completed
    /// </summary>
    public class CorequisitesFulfilledConstraint : IConstraint
    {
        private HashSet<IUnit> corequisites;
        public CorequisitesFulfilledConstraint(IEnumerable<IUnit> corequisites)
        {
            this.corequisites = new HashSet<IUnit>(corequisites);
        }

        private bool Check(IEnumerable<IUnit>? unitsCompleted, IEnumerable<IUnit>? unitsEnrolled)
        {
            HashSet<IUnit> unitsCompletedOrEnrolled = new HashSet<IUnit>();

            if (unitsCompleted != null)
            {
                unitsCompletedOrEnrolled.UnionWith(unitsCompleted);
            }
            if (unitsEnrolled != null)
            {
                unitsCompletedOrEnrolled.UnionWith(unitsEnrolled);
            }

            return corequisites.IsSubsetOf(unitsCompletedOrEnrolled);
        }

        public bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            return Check(unitsCompleted, unitsEnrolled);
        }
    }
}

namespace CourseFlow.Backend.Models.Constraints
{
    /// <summary>
    /// Fulfilled when all the units from a pre-defined set of units has been completed or is being completed
    /// </summary>
    public class CorequisitesFulfilledConstraint : AbstractConstraint
    {
        private HashSet<IUnit> corequisites;
        public IEnumerable<IUnit> Corequisites
        {
            get => corequisites;
            set => corequisites = new HashSet<IUnit>(value);
        }

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

        public override bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            return Check(unitsCompleted, unitsEnrolled);
        }

        public override bool Equals(object? obj)
        {
            var other = obj as CorequisitesFulfilledConstraint;
            if (other == null) return false;

            return Enumerable.SequenceEqual(corequisites.OrderBy(e => e.GetType().Name), corequisites.OrderBy(e => e.GetType().Name));
        }
    }
}

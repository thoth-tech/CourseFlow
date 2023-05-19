namespace CourseFlow.Backend.Models.Constraints
{
    /// <summary>
    /// Fulfilled if none of the units from a pre-defined set of units has been completed or is being completed
    /// </summary>
    public class MutualExclusiveUnitsConstraint : AbstractConstraint
    {
        private HashSet<IUnit> incompatibleUnits;
        public IEnumerable<IUnit> IncompatibleUnits
        {
            get => incompatibleUnits;
            set => incompatibleUnits = new HashSet<IUnit>(value);
        }

        public MutualExclusiveUnitsConstraint(IEnumerable<IUnit> incompatibleUnits)
        {
            this.incompatibleUnits = new HashSet<IUnit>(incompatibleUnits);
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

            return incompatibleUnits.Intersect(unitsCompletedOrEnrolled).Count() == 0;
        }

        public override bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            return Check(unitsCompleted, unitsEnrolled);
        }

        public override bool Equals(object? obj)
        {
            var other = obj as MutualExclusiveUnitsConstraint;
            if (other == null) return false;

            return Enumerable.SequenceEqual(incompatibleUnits.OrderBy(e => e.GetType().Name), incompatibleUnits.OrderBy(e => e.GetType().Name));
        }
    }
}

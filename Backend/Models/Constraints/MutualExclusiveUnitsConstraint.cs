namespace CourseFlow.Backend.Models.Constraints
{
    public class MutualExclusiveUnitsConstraint : IConstraint
    {
        private HashSet<IUnit> incompatibleUnits;

        public MutualExclusiveUnitsConstraint(HashSet<IUnit> incompatibleUnits)
        {
            this.incompatibleUnits = incompatibleUnits;
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

        public bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            return Check(unitsCompleted, unitsEnrolled);
        }
    }
}

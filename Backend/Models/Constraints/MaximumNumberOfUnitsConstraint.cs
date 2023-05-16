namespace CourseFlow.Backend.Models.Constraints
{
    public class MaximumNumberOfUnitsConstraint : IConstraint
    {
        private HashSet<IUnit> unitSet;
        private int maximumCount;
        public MaximumNumberOfUnitsConstraint(IEnumerable<IUnit> unitSet, int maximumCount)
        {
            this.unitSet = new HashSet<IUnit>(unitSet);
            this.maximumCount = maximumCount;
        }

        private bool Check(IEnumerable<IUnit>? unitsCompleted)
        {
            int count = 0;
            if (unitsCompleted != null)
            {
                count = unitsCompleted.Intersect(unitSet).Count();
            }

            return count <= maximumCount;
        }

        public bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            return Check(unitsCompleted);
        }
    }
}

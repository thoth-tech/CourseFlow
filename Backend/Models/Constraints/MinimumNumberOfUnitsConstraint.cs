namespace CourseFlow.Backend.Models.Constraints
{
    public class MinimumNumberOfUnitsConstraint : IConstraint
    {
        private HashSet<IUnit> unitSet;
        private int minimumCount;
        public MinimumNumberOfUnitsConstraint(IEnumerable<IUnit> unitSet, int minimumCount)
        {
            this.unitSet = new HashSet<IUnit>(unitSet);
            this.minimumCount = minimumCount;
        }

        // toco: recheck if unitsEnrolled is needed
        private bool Check(IEnumerable<IUnit>? unitsCompleted)
        {
            int count = 0;
            if (unitsCompleted != null)
            { 
                count = unitsCompleted.Intersect(unitSet).Count();
            }

            return count >= minimumCount;
        }

        public bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            return Check(unitsCompleted);
        }
    }
}

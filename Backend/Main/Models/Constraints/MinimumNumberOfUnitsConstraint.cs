namespace CourseFlow.Backend.Models.Constraints
{
    /// <summary>
    /// Fulfilled when a minimum number of units is completed from a pre-defined set of units
    /// </summary>
    public class MinimumNumberOfUnitsConstraint : AbstractConstraint
    {
        private HashSet<IUnit> unitSet;
        public IEnumerable<IUnit> UnitSet
        {
            get => unitSet;
            set => unitSet = new HashSet<IUnit>(value);
        }
        public int MinimumCount { get; set; }

        public MinimumNumberOfUnitsConstraint(IEnumerable<IUnit> unitSet, int minimumCount)
        {
            this.unitSet = new HashSet<IUnit>(unitSet);
            this.MinimumCount = minimumCount;
        }

        // toco: recheck if unitsEnrolled is needed
        private bool Check(IEnumerable<IUnit>? unitsCompleted)
        {
            int count = 0;
            if (unitsCompleted != null)
            { 
                count = unitsCompleted.Intersect(unitSet).Count();
            }

            return count >= MinimumCount;
        }

        public override bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            return Check(unitsCompleted);
        }

        public override bool Equals(object? obj)
        {
            var other = obj as MinimumNumberOfUnitsConstraint;
            if (other == null) return false;

            return MinimumCount == other.MinimumCount && Enumerable.SequenceEqual(unitSet.OrderBy(e => e.GetType().Name), unitSet.OrderBy(e => e.GetType().Name));
        }
    }
}

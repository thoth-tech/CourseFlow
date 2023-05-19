namespace CourseFlow.Backend.Models.Constraints
{
    /// <summary>
    /// Fulfilled if the number of units completed from a pre-defined set of units does not exceed the maximum allowed
    /// </summary>
    public class MaximumNumberOfUnitsConstraint : AbstractConstraint
    {
        private HashSet<IUnit> unitSet;
        public IEnumerable<IUnit> UnitSet
        {
            get => unitSet;
            set => unitSet = new HashSet<IUnit>(value);
        }
        public int MaximumCount { get; set; }

        public MaximumNumberOfUnitsConstraint(IEnumerable<IUnit> unitSet, int maximumCount)
        {
            this.unitSet = new HashSet<IUnit>(unitSet);
            this.MaximumCount = maximumCount;
        }

        private bool Check(IEnumerable<IUnit>? unitsCompleted)
        {
            int count = 0;
            if (unitsCompleted != null)
            {
                count = unitsCompleted.Intersect(unitSet).Count();
            }

            return count <= MaximumCount;
        }

        public override bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            return Check(unitsCompleted);
        }

        public override bool Equals(object? obj)
        {
            var other = obj as MaximumNumberOfUnitsConstraint;
            if (other == null) return false;

            return MaximumCount == other.MaximumCount && Enumerable.SequenceEqual(unitSet.OrderBy(e => e.GetType().Name), unitSet.OrderBy(e => e.GetType().Name));
        }
    }
}

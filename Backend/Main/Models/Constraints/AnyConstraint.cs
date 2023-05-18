namespace CourseFlow.Backend.Models.Constraints
{
    /// <summary>
    /// Fulfilled if any component constraints are met
    /// </summary>
    public class AnyConstraint : IConstraint
    {
        public IEnumerable<IConstraint> Constraints { get; set; }

        public AnyConstraint(IEnumerable<IConstraint> constraints)
        {
            Constraints = constraints;
        }

        public bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            foreach (IConstraint constraint in Constraints)
            {
                if (constraint.Check(unitsCompleted, unitsEnrolled, enrolledStream, currentWam))
                {
                    return true;
                }
            }

            return false;
        }
    }
}

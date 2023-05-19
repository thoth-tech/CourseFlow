namespace CourseFlow.Backend.Models.Constraints
{
    /// <summary>
    /// Fulfilled if any component constraints are met
    /// </summary>
    public class AnyConstraint : AbstractConstraint
    {
        public IEnumerable<AbstractConstraint> Constraints { get; set; }

        public AnyConstraint(IEnumerable<AbstractConstraint> constraints)
        {
            Constraints = constraints;
        }

        public override bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            foreach (AbstractConstraint constraint in Constraints)
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

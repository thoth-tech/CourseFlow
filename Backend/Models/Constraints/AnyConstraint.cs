namespace CourseFlow.Backend.Models.Constraints
{
    public class AnyConstraint : IConstraint
    {
        IEnumerable<IConstraint> constraints;

        public AnyConstraint(IEnumerable<IConstraint> constraints)
        {
            this.constraints = constraints;
        }

        public bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            foreach (IConstraint constraint in constraints)
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

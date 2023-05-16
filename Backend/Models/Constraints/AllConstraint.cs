namespace CourseFlow.Backend.Models.Constraints
{
    /// <summary>
    /// Fulfilled if all component constraints are met
    /// </summary>
    public class AllConstraint : IConstraint
    {
        IEnumerable<IConstraint> constraints;

        public AllConstraint(IEnumerable<IConstraint> constraints)
        {
            this.constraints = constraints;
        }

        public bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            foreach (IConstraint constraint in constraints)
            {
                if (!constraint.Check(unitsCompleted, unitsEnrolled, enrolledStream, currentWam))
                { 
                    return false;
                }
            }

            return true;
        }
    }
}

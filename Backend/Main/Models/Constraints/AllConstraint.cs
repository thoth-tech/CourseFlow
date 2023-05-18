namespace CourseFlow.Backend.Models.Constraints
{
    /// <summary>
    /// Fulfilled if all component constraints are met
    /// </summary>
    public class AllConstraint : IConstraint
    {
        public IEnumerable<IConstraint> Constraints { get; set; }

        public AllConstraint(IEnumerable<IConstraint> constraints)
        {
            Constraints = constraints;
        }

        public bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            foreach (IConstraint constraint in Constraints)
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

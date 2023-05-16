namespace CourseFlow.Backend.Models.Constraints
{
    public class MinimumWamConstraint : IConstraint
    {
        private float minimumWam;

        public MinimumWamConstraint(float minimumWam)
        {
            this.minimumWam = minimumWam;
        }

        private bool Check(float currentWam)
        { 
            return currentWam >= minimumWam;
        }

        public bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            return Check(currentWam);
        }
    }
}

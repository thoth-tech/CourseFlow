namespace CourseFlow.Backend.Models.Constraints
{
    public class EnrolledInStreamConstraint : IConstraint
    {
        private IStream stream;

        public EnrolledInStreamConstraint(IStream stream)
        {
            this.stream = stream;
        }

        private bool Check(IStream? enrolledStream)
        {
            return enrolledStream == stream;
        }

        public bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            return Check(enrolledStream);
        }
    }
}

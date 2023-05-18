namespace CourseFlow.Backend.Models.Constraints
{
    /// <summary>
    /// Fulfilled if the student is enrolled in the specified stream
    /// </summary>
    public class EnrolledInStreamConstraint : IConstraint
    {
        public IStream Stream { get; set; }

        public EnrolledInStreamConstraint(IStream stream)
        {
            Stream = stream;
        }

        private bool Check(IStream? enrolledStream)
        {
            return enrolledStream == Stream;
        }

        public bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            return Check(enrolledStream);
        }
    }
}

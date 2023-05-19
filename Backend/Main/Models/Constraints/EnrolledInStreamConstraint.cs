namespace CourseFlow.Backend.Models.Constraints
{
    /// <summary>
    /// Fulfilled if the student is enrolled in the specified stream
    /// </summary>
    public class EnrolledInStreamConstraint : AbstractConstraint
    {
        public string StreamCode { get; set; }

        public EnrolledInStreamConstraint(string streamCode)
        {
            StreamCode = streamCode;
        }

        private bool Check(IStream? enrolledStream)
        {
            return enrolledStream != null && enrolledStream.Code == StreamCode;
        }

        public override bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            return Check(enrolledStream);
        }

        public override bool Equals(object? obj)
        {
            EnrolledInStreamConstraint? other = obj as EnrolledInStreamConstraint;
            if (other == null) return false;
            return other.StreamCode == StreamCode;
        }
    }
}

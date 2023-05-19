namespace CourseFlow.Backend.Models.Constraints
{
    /// <summary>
    /// Fulfilled if the student has the minimum amount of WAM
    /// </summary>
    public class MinimumWamConstraint : AbstractConstraint
    {
        public float MinimumWam { get; set; }
        public MinimumWamConstraint(float minimumWam)
        {
            MinimumWam = minimumWam;
        }

        private bool Check(float currentWam)
        { 
            return currentWam >= MinimumWam;
        }

        public override bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
        {
            return Check(currentWam);
        }

        public override bool Equals(object? obj)
        {
            MinimumWamConstraint? other = obj as MinimumWamConstraint;
            if (other == null) return false;
            return other.MinimumWam == MinimumWam;
        }
    }
}

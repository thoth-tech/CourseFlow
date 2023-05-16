namespace CourseFlow.Backend.Models.Constraints
{
    public interface IConstraint
    {
        bool Check(IEnumerable<IUnit>? unitsCompleted=null, IEnumerable<IUnit>? unitsEnrolled=null, IStream? enrolledStream=null, float currentWam=-1);
    }
}

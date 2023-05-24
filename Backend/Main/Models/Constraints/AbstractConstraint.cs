namespace CourseFlow.Backend.Models.Constraints;

/// <summary>
/// Base interface used for modelling constraints
/// </summary>
public abstract class AbstractConstraint
{
    /// <param name="unitsCompleted">The units a student has already completed</param>
    /// <param name="unitsEnrolled">The units a student is current enrolled in</param>
    /// <param name="enrolledStream">The stream a student is enrolled in</param>
    /// <param name="currentWam">The current WAM of a student</param>
    /// <returns>Returns true if the constraint passes</returns>
    public abstract bool Check(IEnumerable<IUnit>? unitsCompleted=null, IEnumerable<IUnit>? unitsEnrolled=null, IStream? enrolledStream=null, float currentWam=-1);
}

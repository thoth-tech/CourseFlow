namespace CourseFlow.Backend.Models.Constraints;

/// <summary>
/// Fulfilled if all component constraints are met
/// </summary>
public class AllConstraint : AbstractConstraint
{
    public IEnumerable<AbstractConstraint> Constraints { get; set; }

    public AllConstraint(IEnumerable<AbstractConstraint> constraints)
    {
        Constraints = constraints;
    }

    public override bool Check(IEnumerable<IUnit>? unitsCompleted = null, IEnumerable<IUnit>? unitsEnrolled = null, IStream? enrolledStream = null, float currentWam = -1)
    {
        foreach (AbstractConstraint constraint in Constraints)
        {
            if (!constraint.Check(unitsCompleted, unitsEnrolled, enrolledStream, currentWam))
            { 
                return false;
            }
        }

        return true;
    }

    public override bool Equals(object? obj)
    {
        var other = obj as AllConstraint;
        if (other == null) return false;

        return Enumerable.SequenceEqual(Constraints.OrderBy(e => e.GetType().Name), other.Constraints.OrderBy(e => e.GetType().Name));
    }
}

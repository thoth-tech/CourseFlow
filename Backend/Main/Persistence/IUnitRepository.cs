using CourseFlow.Backend.Models;

namespace CourseFlow.Backend.Persistence
{
    public interface IUnitRepository
    {
        void AddUnit(IUnit unit);
        void AddMultipleUnits(IEnumerable<IUnit> units);
        IUnit GetUnitByCode(string unit_code);
        void UpdateUnit(string unit_code, IUnit unit);
        void DeleteUnit(string unit_code);
    }
}

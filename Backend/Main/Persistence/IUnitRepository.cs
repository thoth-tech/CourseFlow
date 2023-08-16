using CourseFlow.Backend.Models;

namespace CourseFlow.Backend.Persistence;

public interface IUnitRepository
{
    void AddUnit(IUnit unit);
    void AddMultipleUnits(IEnumerable<IUnit> units);
    IUnit? GetUnitByCode(string unitCode);
    IEnumerable<IUnit> GetAllUnits();
    IEnumerable<IUnit> SearchUnitsByCode(string unitCode);
    void UpdateUnit(string unitCode, IUnit updatedUnit);
    void DeleteUnit(string unitCode);
}

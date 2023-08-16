using CourseFlow.Backend.Models;
using CourseFlow.Backend.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace CourseFlow.Backend.Controllers;

[ApiController]
[Route("api/units")]
public class UnitsController : ControllerBase
{
    private readonly IUnitRepository _unitsRepo;
    public UnitsController(IUnitRepository unitsRepo)
    { 
        _unitsRepo = unitsRepo;
    }

    [HttpGet("{code}")]
    public IActionResult GetUnitByCode(string code)
    { 
        IUnit? unit = _unitsRepo.GetUnitByCode(code);

        if (unit == null)
        {
            return NotFound();
        }

        return Ok(unit);
    }

    [HttpGet()]
    public IActionResult GetAllUnits()
    {
        return Ok(_unitsRepo.GetAllUnits());
    }

    [HttpGet("search/{code}")]
    public IActionResult SearchUnitsByCode(string code)
    {
        return Ok(_unitsRepo.SearchUnitsByCode(code));
    }

    [HttpPost()]
    public IActionResult SearchUnits(UnitSearchQuery query)
    {
        return Ok(_unitsRepo.SearchUnits(query));
    }
}

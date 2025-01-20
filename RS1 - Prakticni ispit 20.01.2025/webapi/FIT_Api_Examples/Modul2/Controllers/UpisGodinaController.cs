using FIT_Api_Examples.Data;
using FIT_Api_Examples.Modul2.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;


namespace FIT_Api_Examples.Modul2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UpisGodinaController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        public UpisGodinaController(ApplicationDbContext dbContext)
        {
            this._dbContext = dbContext;
        }

        [HttpGet]
        [Route("/GetAllUpis")]

        public ActionResult <List<UpisGodina>> GetAll(int studentId)
        {
            var upisGodine = _dbContext.UpisGodina.Include(x => x.akademskaGodina).Include(x => x.nastavnik).Include(x => x.student).Where(x => x.studentId == studentId).ToList();

            if (studentId == 0)
            {
                return NotFound();
            }
            return Ok(upisGodine);

        }

        [HttpPost]
        [Route("/AddUpisGodina")]
        public ActionResult AddUpis([FromBody] UpisGodineVM y)
        {
            if(y.studentId == 0 ||y.akademskaGodinaId == 0 ||y.nastavnikId == 0)
            {
                return NotFound();
            }
            if (_dbContext.UpisGodina.ToList().Exists(x=> x.studentId == y.studentId && x.godinaStudija == y.godinaStudija  && x.obnova == false)) {
                return NotFound();
            }
            UpisGodina upisGodine = new UpisGodina
            {
                datumUpisa = y.datumUpisa,
                godinaStudija = y.godinaStudija,
                akademskaGodinaId = y.akademskaGodinaId,
                cijenaSkolarine = y.cijenaSkolarine,
                obnova = y.obnova,
                nastavnikId = y.nastavnikId,
                studentId = y.studentId
            };
            _dbContext.Add(upisGodine);
            _dbContext.SaveChanges();
            return Ok(upisGodine);
        }

        [HttpPost]
        [Route("/PostOvjera")]
        public ActionResult AddOvjera([FromBody] OvjeraGodineVM x)
        {
            if(x.id == 0)
            {
                return NotFound();
            }
            var OvjeraGodine = _dbContext.UpisGodina.Find(x.id);
            OvjeraGodine.napomenaOvjere = x.napomenaOvjere;
            OvjeraGodine.datumOvjere = x.datumOvjere;
            _dbContext.SaveChanges();
            return Ok(OvjeraGodine);
        }

    }
}

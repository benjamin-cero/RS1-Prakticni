using System;
using System.Collections.Generic;
using System.Diagnostics.Eventing.Reader;
using System.IO;
using System.Linq;
using FIT_Api_Examples.Data;
using FIT_Api_Examples.Helper;
using FIT_Api_Examples.Helper.AutentifikacijaAutorizacija;
using FIT_Api_Examples.Modul2.ViewModels;
using Microsoft.AspNetCore.Identity.UI.V4.Pages.Internal.Account.Manage;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FIT_Api_Examples.Modul2.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("[controller]/[action]")]
    public class StudentController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public StudentController(ApplicationDbContext dbContext)
        {
            this._dbContext = dbContext;
        }

        [HttpGet]
        public ActionResult<List<Student>> GetAll(string ime_prezime)
        {
            var data = _dbContext.Student
                .Include(s => s.opstina_rodjenja.drzava)
                .Where(x => (ime_prezime == null || (x.ime + " " + x.prezime).StartsWith(ime_prezime) || (x.prezime + " " + x.ime).StartsWith(ime_prezime)) && 
                x.Delete == false)
                .OrderByDescending(s => s.id)
                .AsQueryable();
            return data.Take(100).ToList();
        }
         
        [HttpGet]
        [Route("/GetById")]

        public ActionResult<Student> GetById(int StudentId){
            var student = _dbContext.Student.Find(StudentId);

            if (StudentId == 0) {
                return NotFound();
            }
            return Ok(student);

        }
        [HttpPost]
        [Route("/StudentAddUpdate")]

        public ActionResult AddUpdate([FromBody] StudentVM x)
        {
            Student student;
            if(x.id != 0)
            {
                student = _dbContext.Student.Find(x.id);
                student.ime = x.ime;
                student.prezime = x.prezime;
                student.opstina_rodjenja_id = x.opstina_rodjenja_id;
            }
            else
            {
                student = new Student
                {
                    ime = x.ime,
                    prezime = x.prezime,
                    opstina_rodjenja_id = x.opstina_rodjenja_id
                };

                _dbContext.Student.Add(student);
            }
            
            _dbContext.SaveChanges();
            return Ok(student);
        }
        [HttpPost]
        [Route("/StudentDelete")]
        public ActionResult StudentDelete([FromBody] int StudentId){
            var student = _dbContext.Student.Find(StudentId);

            if(StudentId == 0)
            {
                return NotFound();
            }
            student.Delete = true;
            _dbContext.SaveChanges();
            return Ok(student);

        }


    }
}

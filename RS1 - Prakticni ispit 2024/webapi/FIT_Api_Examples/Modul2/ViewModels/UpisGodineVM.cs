using FIT_Api_Examples.Data;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace FIT_Api_Examples.Modul2.ViewModels
{
    public class UpisGodineVM
    {
        public DateTime datumUpisa { get; set; }
        public int godinaStudija { get; set; }
        public int akademskaGodinaId { get; set; }
        public float cijenaSkolarine { get; set; }
        public bool obnova { get; set; }

        public int nastavnikId { get; set; }
        public int studentId { get; set; }
    }
}

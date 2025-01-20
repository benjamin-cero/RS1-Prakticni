using FIT_Api_Examples.Data;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace FIT_Api_Examples.Modul2.ViewModels
{
    public class OvjeraGodineVM
    {
        public int id { get; set; }
        public DateTime datumOvjere { get; set; }
        public string napomenaOvjere { get; set; }

    }
}

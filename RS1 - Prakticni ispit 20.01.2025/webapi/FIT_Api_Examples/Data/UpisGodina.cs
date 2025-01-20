using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace FIT_Api_Examples.Data
{
    public class UpisGodina
    {
        public int id { get; set; }
        public DateTime datumUpisa { get; set; }
        public int godinaStudija { get; set; }
        [ForeignKey(nameof(akademskaGodina))]
        public int akademskaGodinaId { get; set; }
        public AkademskaGodina akademskaGodina { get; set; }
        public float cijenaSkolarine { get; set; }
        public bool obnova { get; set; }
        public DateTime? datumOvjere { get; set; }
        public string? napomenaOvjere { get; set; }

        [ForeignKey(nameof(nastavnik))]
        public int nastavnikId { get; set; }
        public Nastavnik nastavnik { get; set; }
        [ForeignKey(nameof(student))]
        public int studentId { get; set; }
        public Student student { get; set; }

    }
}

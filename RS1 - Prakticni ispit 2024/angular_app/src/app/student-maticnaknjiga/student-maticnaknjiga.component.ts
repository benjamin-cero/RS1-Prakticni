import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MojConfig} from "../moj-config";
import {HttpClient} from "@angular/common/http";
import {AutentifikacijaHelper} from "../_helpers/autentifikacija-helper";

declare function porukaSuccess(a: string):any;
declare function porukaError(a: string):any;

@Component({
  selector: 'app-student-maticnaknjiga',
  templateUrl: './student-maticnaknjiga.component.html',
  styleUrls: ['./student-maticnaknjiga.component.css']
})
export class StudentMaticnaknjigaComponent implements OnInit {
  Maticna: any;
  StudentId:any;
  Student:any;
  Upisi: any;
  AkademskaGodina:any;
  Ovjera:any;
  constructor(private httpKlijent: HttpClient, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.StudentId = params['id'];
    })
  }

  GetImeStudent() {
    this.httpKlijent.get(MojConfig.adresa_servera+ "/GetById", {
      params: {studentId: this.StudentId}
    }).subscribe(x=>{
      this.Student = x;

    });
  }
GetUpisi(){
  this.httpKlijent.get(MojConfig.adresa_servera+ "/GetAllUpis", {
    params: {studentId: this.StudentId}
  }).subscribe(x=>{
    this.Upisi = x;
  });
}
  ovjeriLjetni(s:any) {

  }

  upisLjetni(s:any) {

  }

  ovjeriZimski(s:any) {

  }

  ngOnInit(): void {
    this.GetImeStudent();
    this.GetUpisi();
    this.AKGodina();
  }

  OtvoriUpis() {
    this.Maticna = {
      datumUpisa: '',
      godinaStudija: 1,
      akademskaGodinaId: 1,
      cijenaSkolarine: 0,
      obnova: false,
      studentId : this.StudentId,
      nastavnikId: AutentifikacijaHelper.getLoginInfo().autentifikacijaToken.korisnickiNalogId
    }
  }

  DodajMaticnu() {
    this.httpKlijent.post(MojConfig.adresa_servera + "/AddUpisGodina", this.Maticna, MojConfig.http_opcije())
      .subscribe((x: any) => {
        porukaSuccess("Maticna dodana");
        this.ngOnInit();
        this.Maticna=null;
      },error => {
        porukaError("Upis nije dodan jer niste oznacili obnovu");
      }  );
  }

  AKGodina() {
    this.httpKlijent.get(MojConfig.adresa_servera+ "/GetAllAkademska", MojConfig.http_opcije()).subscribe(x=>{
      this.AkademskaGodina = x;
    });
  }

  Ovjeri() {
    this.httpKlijent.post(MojConfig.adresa_servera + "/PostOvjera", this.Ovjera, MojConfig.http_opcije())
      .subscribe((x: any) => {
        porukaSuccess("Ovjereno");
        this.ngOnInit();
        this.Ovjera=null;
      });
  }
}

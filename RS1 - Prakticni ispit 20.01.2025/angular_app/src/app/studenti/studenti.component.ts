import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MojConfig} from "../moj-config";
import {Router} from "@angular/router";
declare function porukaSuccess(a: string):any;
declare function porukaError(a: string):any;

@Component({
  selector: 'app-studenti',
  templateUrl: './studenti.component.html',
  styleUrls: ['./studenti.component.css']
})
export class StudentiComponent implements OnInit {

  title:string = 'angularFIT2';
  ime_prezime:string = '';
  opstina: string = '';
  studentPodaci: any;
  filter_ime_prezime: boolean;
  filter_opstina: boolean;
  StudentPrikazi:any;
  Opstine:any;
  StudentUpdate: any;
  constructor(private httpKlijent: HttpClient, private router: Router) {
  }

  testirajWebApi() :void {
    this.httpKlijent.get(MojConfig.adresa_servera+ "/Student/GetAll", MojConfig.http_opcije()).subscribe(x=>{
      this.studentPodaci = x;
    });
  }

  ngOnInit(): void {
    this.testirajWebApi();
    this.SveOpstine();
  }

  filterStudent() {
    if (this.filter_ime_prezime!=false){
    return this.studentPodaci.filter((x : any) =>
      ((x.ime.toLowerCase() + ' ' + x.prezime.toLowerCase()).startsWith(this.ime_prezime.toLowerCase())||
        (x.prezime.toLowerCase() + ' ' + x.ime.toLowerCase()).startsWith(this.ime_prezime.toLowerCase())));
    }
    else if(this.filter_opstina!=false){
      return this.studentPodaci.filter((x : any) =>
        (x.opstina_rodjenja.description.toLowerCase().startsWith(this.opstina.toLowerCase())));
    }
    else if(this.filter_opstina!=false && this.filter_ime_prezime!=false){
      return this.studentPodaci.filter((x : any) =>
        ((x.ime.toLowerCase() + ' ' + x.prezime.toLowerCase()).startsWith(this.ime_prezime.toLowerCase())||
          (x.prezime.toLowerCase() + ' ' + x.ime.toLowerCase()).startsWith(this.ime_prezime.toLowerCase()))&&
        (x.opstina_rodjenja.description.toLowerCase().startsWith(this.opstina.toLowerCase())));
    }
    else{
      return this.studentPodaci;
    }
  }

  StudentUnos() {
    this.StudentPrikazi = {
      ime: this.ime_prezime,
      prezime: '',
      opstina_rodjenja_id: 1
    }
  }

  SveOpstine(){
    this.httpKlijent.get(MojConfig.adresa_servera+ "/GetOpstine", MojConfig.http_opcije()).subscribe(x=>{
      this.Opstine = x;
    });
  }
  DodajStudenta() {
    this.httpKlijent.post(MojConfig.adresa_servera + "/StudentAddUpdate", this.StudentPrikazi, MojConfig.http_opcije())
      .subscribe((x: any) => {
        porukaSuccess("Student spasen");
        this.ngOnInit();
      });
    this.StudentPrikazi=null;
  }

  UrediStudenta() {
    this.httpKlijent.post(MojConfig.adresa_servera + "/StudentAddUpdate", this.StudentUpdate, MojConfig.http_opcije())
      .subscribe((x: any) => {
        porukaSuccess("Student uredjen");
        this.ngOnInit();
      });
    this.StudentUpdate=null;
  }

  StudentDelete(id:any) {
    this.httpKlijent.post(MojConfig.adresa_servera + "/StudentDelete", id, MojConfig.http_opcije())
      .subscribe((x: any) => {
        porukaSuccess("Student Obrisan");
        this.ngOnInit();
      });
  }
}

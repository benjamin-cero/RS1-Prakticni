import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';

export interface SemesterGetByIdResponse {
  id:number;
  academicYearInfo:string;
  yearOfStudy:number;
  renewal:boolean;
  dateOfEnrollment:Date;
  myAppUserName:string;
}

@Injectable({
  providedIn: 'root'
})
export class SemesterGetByIdEndpoint implements MyBaseEndpointAsync<number, SemesterGetByIdResponse> {
  private apiUrl = `${MyConfig.api_address}/semesters`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(id: number) {
    return this.httpClient.get<SemesterGetByIdResponse>(`${this.apiUrl}/${id}`);
  }
}

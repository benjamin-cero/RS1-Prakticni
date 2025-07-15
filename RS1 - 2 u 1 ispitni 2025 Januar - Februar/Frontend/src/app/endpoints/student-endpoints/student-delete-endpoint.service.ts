import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';

export interface StudentDeleteRequest {
  id?: number;  // Optional or 0 for new city insertion
  deletedByUsername:string;

}

@Injectable({
  providedIn: 'root'
})
export class StudentDeleteEndpoint implements MyBaseEndpointAsync<StudentDeleteRequest, number> {
  private apiUrl = `${MyConfig.api_address}/deleteBy`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: StudentDeleteRequest) {
    return this.httpClient.post<number>(`${this.apiUrl}`, request);
  }
}

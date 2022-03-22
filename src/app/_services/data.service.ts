import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '@environments/environment';
import {CheckIn} from '@app/_models';

@Injectable({providedIn: 'root'})
export class DataService {
  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.post<any>(`${environment.apiUrl}/get_all_data`, null);
  }

  getCheckIns(time: number, eventId: string) {
    return this.http.post<CheckIn[]>(`${environment.apiUrl}/get_check_in?param2=` + eventId + `&param3=` + time, null);
  }

  updateStatus(ticketId: string, status: string) {
    return this.http.post<any>(`${environment.apiUrl}/update_ticket_status?param2=` + ticketId + `&param3=` + status, null);
  }
}

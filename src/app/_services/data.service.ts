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

  deleteTestTickets() {
    return this.http.post<any>(`${environment.apiUrl}/delete_test_tickets`, null);
  }

  //TODO
  updateTicket(ticketId: string, attendeeName: string, attendeeId: string, accompanist: string) {
    return this.http.post<any>(`${environment.apiUrl}/update_ticket?id=` + ticketId + `&name=` + attendeeName + `&attendee-id=` + attendeeId + `&accompanist=` + accompanist, null);
  }

  //TODO
  resendTicket(ticketId: string) {
    return this.http.post<any>(`${environment.apiUrl}/send_ticket?id=` + ticketId, null);
  }

  updateCoupon(ticketId: string, add: boolean) {
    return this.http.post<any>(`${environment.apiUrl}/update_coupon?id=` + ticketId + `&add=` + (add ? '1' : '0') , null);
  }

  checkin(ticketId: string) {
    return this.http.post<any>(`${environment.apiUrl}/checkin?id=` + ticketId, null);
  }

  modifyEventPass(event: string, pass: string) {
    return this.http.post<any>(`${environment.apiUrl}/event_visibility?event=` + event + `&pass=` + pass, null);
  }
}

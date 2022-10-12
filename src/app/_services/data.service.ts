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

  updateTicket(ticketId: string, attendeeName: string, attendeeId: string, accompanist: string) {
    return this.http.post<any>(`${environment.apiUrl}/update_ticket?id=` + ticketId + `&name=` + attendeeName + `&attendee-id=` + attendeeId + `&accompanist=` + accompanist, null);
  }

  resendTicket(ticketId: string) {
    return this.http.post<any>(`${environment.apiUrl}/send_ticket?id=` + ticketId, null);
  }

  updateCoupon(ticketId: string, coupon: string) {
    return this.http.post<any>(`${environment.apiUrl}/update_coupon?id=` + ticketId + `&coupon=` + coupon , null);
  }

  checkin(ticketId: string) {
    return this.http.post<any>(`${environment.apiUrl}/checkin?id=` + ticketId, null);
  }
}

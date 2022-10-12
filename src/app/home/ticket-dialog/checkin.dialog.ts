import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Ticket} from '@app/_models/ticket';
import {DataService} from '@app/_services';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {observable, Observable} from 'rxjs';

export interface CheckinDialogData {
  tickets: Ticket[];
}

@Component({
  selector: 'checkin-dialog',
  templateUrl: 'checkin.dialog.html',
})
export class CheckinDialog implements AfterViewInit {
  myControl = new FormControl('');
  filteredOptions: Observable<Ticket[]>;
  search: string;
  selectedTicket: Ticket;
  codeReader = true;
  color = "white";

  @ViewChild('search') private searchRef: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<CheckinDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CheckinDialogData,
    private dataService: DataService,
  ) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(ticket => (ticket ? this._filterTickets(ticket) : [] /*this.data.tickets.slice()*/)),
    );

    this.myControl.valueChanges.subscribe(observable => {
      if(observable.match(/^[0-9]{11}$/) != null) {
        this.checkIn(observable);
        this.myControl.setValue('');
      }
    });
  }

  ngAfterViewInit(): void {
    this.searchRef.nativeElement.focus();
  }

  private _filterTickets(value: string): Ticket[] {
    const filterValue = value.toLowerCase();
    const tickets = this.data.tickets.filter(ticket => ticket.WooCommerceEventsTicketID.toLowerCase().includes(filterValue) || ticket.attendeeName.toLowerCase().includes(filterValue));
    return tickets.length == 1 && value == tickets[1].WooCommerceEventsTicketID ? [] : tickets;
  }

  checkIn(id: string) {
    this.selectedTicket = this.data.tickets.filter(ticket => ticket.WooCommerceEventsTicketID === id)[0];
    this.color = this.selectedTicket.WooCommerceEventsStatus == "Not Checked In" ? "green" : "yellow";
    /*this.dataService.checkin(id).subscribe(result => {
      this.selectedTicket = result;
      this.searchRef.nativeElement.focus();
    });*/
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

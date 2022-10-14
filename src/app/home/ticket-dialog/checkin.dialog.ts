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
  oldStatus : string;

  @ViewChild('search') private searchRef: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<CheckinDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CheckinDialogData,
    private dataService: DataService,
  ) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(ticket => ((ticket && !this.codeReader) ? this._filterTickets(ticket) : [] /*this.data.tickets.slice()*/)),
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
    return this.data.tickets.filter(ticket => ticket.WooCommerceEventsTicketID.toLowerCase().includes(filterValue) || ticket.attendeeName.toLowerCase().includes(filterValue));
  }

  checkIn(id: string) {
    this.selectedTicket = this.data.tickets.filter(ticket => ticket.WooCommerceEventsTicketID === id)[0];
    this.color = this.selectedTicket.WooCommerceEventsStatus == "Not Checked In" ? "white" : "yellow";
    this.oldStatus = "?";
      this.dataService.checkin(id).subscribe(result => {
      this.oldStatus = result.oldStatus;

      if(result.response == "Status updated" && result.oldStatus == "Not Checked In") {
        this.color = "lawngreen";
        this.selectedTicket.WooCommerceEventsStatus = "Checked In";
      } else {
        this.color = "red";
      }
      this.searchRef.nativeElement.focus();
    });
  }

  updateStatus(status: string) {
    this.dataService.updateStatus(this.selectedTicket.WooCommerceEventsTicketID, status).subscribe(result => {
      this.selectedTicket.WooCommerceEventsStatus = status;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

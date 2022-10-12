import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Ticket} from '@app/_models/ticket';
import {DataService} from '@app/_services';
import {timer} from 'rxjs';

export interface DialogData {
  ticket: Ticket;
}

@Component({
  selector: 'edit-dialog',
  templateUrl: 'edit.dialog.html',
})
export class EditDialog {
  resendClicked = false;
  constructor(
    public dialogRef: MatDialogRef<EditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
  ) {
  }

  updateData() {
    this.dataService.updateTicket(this.data.ticket.WooCommerceEventsTicketID, this.data.ticket.attendeeName, this.data.ticket.attendeeId, this.data.ticket.accompanist).subscribe(() => {
    });
  }

  resendEmail() {
    this.resendClicked = true;
    this.dataService.resendTicket(this.data.ticket.WooCommerceEventsTicketID).subscribe(() =>  {
      timer(5 * 1000).subscribe(() => {
        this.resendClicked = false;
      });
    });
  }

  updateCoupon(add: boolean) {
    this.dataService.updateCoupon(this.data.ticket.WooCommerceEventsTicketID, add).subscribe(() =>  {
      if(add) {
        this.data.ticket.coupon = 'ceremony';
      } else {
        this.data.ticket.coupon = '';
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

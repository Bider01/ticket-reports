import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Ticket} from '@app/_models/ticket';
import {DataService} from '@app/_services';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {observable, Observable} from 'rxjs';
import {BrowserMultiFormatReader, NotFoundException} from "@zxing/library";

export interface CheckinDialogData {
  tickets: Ticket[];
}

@Component({
  selector: 'checkin-dialog',
  templateUrl: 'checkin.dialog.html',
  styleUrls: ['checkin.dialog.scss']
})
export class CheckinDialog implements AfterViewInit {
  myControl = new FormControl('');
  filteredOptions: Observable<Ticket[]>;
  search: string;
  selectedTicket: Ticket;
  codeReader = false;
  color = "white";
  oldStatus : string;

  phoneMode: boolean;
  cameraRun: boolean;
  camera: BrowserMultiFormatReader;
  cameraIndex = 0;
  cameraIndexMax: number;
  locked = false;

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
      if(observable.match(/^[0-9ö]{11}$/) != null) {
        this.checkIn(observable.replace('ö','0'));
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

  modeChange(event: any) {
    if (this.phoneMode) {
      if(this.camera == undefined) {
        this.camera = new BrowserMultiFormatReader();
      }
      this.scanBarcode();
    } else {
      this.camera.reset();
    }
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async scanBarcode() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputDevices = devices.filter(device => device.kind === 'videoinput');
    this.cameraIndexMax = videoInputDevices.length;

    try {
      if (videoInputDevices.length > 0) {
        this.cameraRun = true;
        const deviceId = videoInputDevices[this.cameraIndex].deviceId;
        do {
          const result = await this.camera.decodeOnceFromVideoDevice(deviceId, 'video');
          this.checkIn(result.getText());
          this.locked = true;
          await this.delay(4000);
          this.locked = false;
        } while(this.cameraRun)
      } else {
        throw new NotFoundException("Camera not found");
      }
    } finally {
      this.cameraRun = false;
      this.locked = false;
      this.camera.reset();
    }
  }

  changeCamera() {
    if(!this.cameraRun) {
      this.scanBarcode();
    } else {
      if((this.cameraIndex + 1) >= this.cameraIndexMax) {
        this.cameraIndex = 0;
      } else {
        this.cameraIndex++;
      }
      this.camera.reset();
      this.scanBarcode();
    }
  }
}

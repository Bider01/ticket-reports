export interface Ticket {
  WooCommerceEventsTicketID: string;
  WooCommerceEventsStatus: string;
  WooCommerceEventsVariationID: string;
  WooCommerceEventsCustomAttendeeFields: Attendee;
}

export interface Attendee {
  ID: string;
  'Név/Name': string;
  'Kísért személy/Accompanied person (Kísérő meghívó esetén kötelező/Obligatory with Companion invitation)': string;
}

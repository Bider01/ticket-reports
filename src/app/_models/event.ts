import {Ticket} from '@app/_models/ticket';

export interface WooComerceEvent {
  WooCommerceEventsName: string;
  WooCommerceEventsProductID: string;
  eventTickets: Ticket[];
}

import { randomUUID } from 'node:crypto';
import type { Booking } from './booker-client';

export function bookingData(): Booking {
  return {
    firstname: 'Automation',
    lastname: `QA-${randomUUID()}`,
    totalprice: 125,
    depositpaid: true,
    bookingdates: { checkin: '2030-06-10', checkout: '2030-06-13' },
    additionalneeds: 'Breakfast',
  };
}

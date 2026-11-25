import type { APIRequestContext } from '@playwright/test';

export type Booking = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds: string;
};

export class BookerClient {
  constructor(private readonly request: APIRequestContext) {}

  authenticate(username: string, password: string) {
    return this.request.post('/auth', { data: { username, password } });
  }

  create(booking: Booking) {
    return this.request.post('/booking', { data: booking, headers: { Accept: 'application/json' } });
  }

  get(id: number) {
    return this.request.get(`/booking/${id}`, { headers: { Accept: 'application/json' } });
  }

  update(id: number, booking: Booking, token?: string) {
    return this.request.put(`/booking/${id}`, {
      data: booking,
      headers: { Accept: 'application/json', ...this.cookie(token) },
    });
  }

  delete(id: number, token: string) {
    return this.request.delete(`/booking/${id}`, { headers: this.cookie(token) });
  }

  private cookie(token?: string): Record<string, string> {
    return token === undefined ? {} : { Cookie: `token=${token}` };
  }
}

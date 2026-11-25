import { expect, test as base } from '@playwright/test';
import { ApiAssertions as api } from '../support/api-assertions';
import { config } from '../support/config';
import { BookerClient, type Booking } from './booker-client';

type BookingSession = {
  client: BookerClient;
  authenticate: () => Promise<string>;
  create: (booking: Booking) => Promise<number>;
};

export const test = base.extend<{ booker: BookingSession }>({
  booker: async ({ request }, use) => {
    const client = new BookerClient(request);
    const created = new Map<number, string>();
    let token: string | undefined;

    async function authenticate() {
      const response = await client.authenticate(config.api.username, config.api.password);
      api.expectOk(response, 'POST');
      const body = await api.parseJson(response);
      if (!body || typeof body !== 'object' || !('token' in body) || typeof body.token !== 'string' || !body.token) {
        throw new Error('Valid demo credentials did not return a non-empty auth token');
      }
      api.expectFieldCount(body, 1);
      token = body.token;
      return token;
    }

    async function create(booking: Booking) {
      const response = await client.create(booking);
      api.expectOk(response, 'POST');
      const body = await api.parseJson(response);
      if (!body || typeof body !== 'object' || !('bookingid' in body)
          || typeof body.bookingid !== 'number' || !Number.isSafeInteger(body.bookingid) || body.bookingid <= 0) {
        throw new Error('Create booking did not return a positive integer bookingid');
      }
      created.set(body.bookingid, booking.lastname);
      api.expectField(body, 'booking', booking);
      return body.bookingid;
    }

    try {
      await use({ client, authenticate, create });
    } finally {
      for (const [id, owner] of created) {
        const response = await client.get(id);
        if (response.status() === 404) continue;
        api.expectOk(response, 'GET');
        const body = await api.parseJson(response);
        if (body && typeof body === 'object' && 'lastname' in body && body.lastname === owner) {
          api.expectCreated(await client.delete(id, token ?? await authenticate()), 'DELETE');
        } else {
          throw new Error(`Cleanup skipped for booking ${id} because its ownership could not be verified`);
        }
      }
    }
  },
});

export { expect };

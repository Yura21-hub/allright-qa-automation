import { ApiAssertions as api } from '../support/api-assertions';
import { config } from '../support/config';
import { bookingData } from './booking-data';
import { expect, test } from './fixtures';

test('authenticates, creates, updates, deletes, and confirms a booking is gone', async ({ booker }) => {
  const token = await test.step('Get an authentication token', () => booker.authenticate());
  const initial = bookingData();
  const id = await test.step('Create a unique booking', () => booker.create(initial));
  const updated = {
    ...initial,
    totalprice: 165,
    additionalneeds: 'Late arrival',
    bookingdates: { ...initial.bookingdates, checkout: '2030-06-14' },
  };

  await test.step('Update the booking and read back the saved data', async () => {
    const update = await booker.client.update(id, updated, token);
    api.expectOk(update, 'PUT');
    expect(await api.parseJson(update)).toEqual(updated);

    const read = await booker.client.get(id);
    api.expectOk(read, 'GET');
    const body = await api.parseJson(read);
    api.expectField(body, 'bookingdates.checkout', updated.bookingdates.checkout);
    expect(body).toEqual(updated);
  });

  await test.step('Delete the booking and confirm a subsequent GET returns 404', async () => {
    api.expectCreated(await booker.client.delete(id, token), 'DELETE');
    api.expectNotFound(await booker.client.get(id), 'GET');
  });
});

test('incorrect credentials return a reason and no token', async ({ booker }) => {
  const response = await booker.client.authenticate(config.api.username, `${config.api.password}-incorrect`);
  api.expectOk(response, 'POST');
  const body = await api.parseJson(response);
  api.expectField(body, 'reason', 'Bad credentials');
  expect(body).not.toHaveProperty('token');
});

test('an unauthenticated update is forbidden and leaves the booking unchanged', async ({ booker }) => {
  const booking = bookingData();
  const id = await booker.create(booking);

  api.expectForbidden(await booker.client.update(id, { ...booking, totalprice: 250 }), 'PUT');

  const read = await booker.client.get(id);
  api.expectOk(read, 'GET');
  expect(await api.parseJson(read)).toEqual(booking);
});

test('an invalid token cannot delete a booking', async ({ booker }) => {
  const booking = bookingData();
  const id = await booker.create(booking);

  api.expectForbidden(await booker.client.delete(id, 'invalid-test-token'), 'DELETE');

  const read = await booker.client.get(id);
  api.expectOk(read, 'GET');
  expect(await api.parseJson(read)).toEqual(booking);
});

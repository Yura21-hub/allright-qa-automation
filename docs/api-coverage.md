# API coverage

## Current coverage

| Operation | Automated cases | Spec |
| --- | --- | --- |
| `POST /auth` | Token for valid credentials, failure reason and no token for invalid credentials. | [booking.spec.ts](../tests/api/booking.spec.ts) |
| `POST /booking` | Create a unique booking and verify its ID and returned fields. | [booking.spec.ts](../tests/api/booking.spec.ts) |
| `PUT /booking/{id}` | Update with a token and read back persisted values. Missing token is rejected and the record is unchanged. | [booking.spec.ts](../tests/api/booking.spec.ts) |
| `GET /booking/{id}` | Read updated or unchanged data, then receive `404` after deletion. | [booking.spec.ts](../tests/api/booking.spec.ts) |
| `DELETE /booking/{id}` | Delete with a token. Invalid token is rejected and the booking remains readable. | [booking.spec.ts](../tests/api/booking.spec.ts) |

## Gaps and open requirements

Missing coverage includes booking search and filters, partial updates, alternatives to token authentication, XML and form payloads, malformed inputs, invalid IDs, and date boundaries. Full expected statuses, error response schemas, and validation rules are needed to assess contract coverage.

## Observed behavior and discrepancies

Creation returns `200`, deletion returns `201`, and invalid authentication returns `200` with a reason and no token. These are checked as demo behavior. A create request with no first name also returns `500`. See the [validation bug report](../README.md#rb-1-missing-first-name-returns-http-500).

## Expansion criteria

Once the API documentation defines success and error statuses, payload schemas, and validation rules, add operation-level specs such as `create-token.spec.ts`, `create-booking.spec.ts`, and `update-booking.spec.ts`. Cover every documented positive, negative, and boundary case. Keep the booking lifecycle as a separate integration test.

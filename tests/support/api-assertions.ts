import { expect, type APIResponse } from '@playwright/test';

export class ApiAssertions {
  static expectOk(response: APIResponse, method: string) {
    this.expectStatus(response, method, 200);
  }

  static expectCreated(response: APIResponse, method: string) {
    this.expectStatus(response, method, 201);
  }

  static expectForbidden(response: APIResponse, method: string) {
    this.expectStatus(response, method, 403);
  }

  static expectNotFound(response: APIResponse, method: string) {
    this.expectStatus(response, method, 404);
  }

  private static expectStatus(response: APIResponse, method: string, expected: number) {
    expect(response.status(), `${method} ${response.url()} should return HTTP ${expected}`).toBe(expected);
  }

  static async parseJson(response: APIResponse): Promise<unknown> {
    try {
      return await response.json();
    } catch (error) {
      throw new Error(`Expected JSON from ${response.url()} (HTTP ${response.status()})`, { cause: error });
    }
  }

  static expectField(body: unknown, path: string | string[], value: unknown) {
    expect(body).toHaveProperty(path, value);
  }

  static expectFieldCount(body: unknown, count: number) {
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
      throw new Error('Expected a JSON object before counting its fields');
    }
    expect(Object.keys(body)).toHaveLength(count);
  }
}

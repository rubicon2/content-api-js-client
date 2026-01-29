import GuardianContentClient from '../dist/index';
import { describe, expect, it } from 'vitest';

const TEST_API_KEY = 'test';
const client = new GuardianContentClient(TEST_API_KEY);

describe('GuardianContentClient', () => {
  it('each endpoint throws an error if user is unauthorized, e.g. if api key is invalid', async () => {
    const invalidClient = new GuardianContentClient('my-invalid-api-key');
    const expectedError = 'Fetch request failed: 401';
    await expect(() => invalidClient.item()).rejects.toThrowError(
      expectedError,
    );
    await expect(() => invalidClient.search()).rejects.toThrowError(
      expectedError,
    );
    await expect(() =>
      invalidClient.next('some/content/id'),
    ).rejects.toThrowError(expectedError);
    await expect(() => invalidClient.tags()).rejects.toThrowError(
      expectedError,
    );
    await expect(() => invalidClient.sections()).rejects.toThrowError(
      expectedError,
    );
    await expect(() => invalidClient.editions()).rejects.toThrowError(
      expectedError,
    );
  });
});

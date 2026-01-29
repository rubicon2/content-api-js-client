import GuardianContentClient from '../dist/index';
import * as testData from '../mocks/apiResponseData';
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

  describe('item endpoint', () => {
    it('given an invalid id, throw an error with an appropriate message', async () => {
      await expect(client.item('my-invalid-item-id')).rejects.toThrowError(
        'Fetch request failed: 404',
      );
    });

    it('should take an id and return the item as an object', async () => {
      // Since testData uses actual data from api, compare against that.
      const content = testData.item.response.content;
      const data = await client.item(content.id);
      expect(data).toStrictEqual(content);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const item = await client.item(testData.item.response.content.id, {
        showFields: ['body', 'last-modified'],
      });
      expect(item.fields.body).toBeDefined();
      expect(item.fields.lastModified).toBeDefined();
    });
  });

  describe('search endpoint', () => {
    it('returns an array of content items', async () => {
      const content = await client.search();
      expect(Array.isArray(content)).toStrictEqual(true);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const content = await client.search({
        q: 'mega',
        queryFields: ['headline'],
        showFields: ['headline'],
      });
      for (const item of content) {
        expect(item.fields.headline).toMatch(/mega/i);
      }
    });
  });
});

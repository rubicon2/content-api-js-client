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

    it('q parameter works with boolean operators', async () => {
      const content = await client.search({
        q: 'china AND (chicken OR beef)',
        queryFields: ['headline'],
        showFields: ['headline'],
      });
      for (const item of content) {
        const headline = item.fields.headline;
        expect(headline).toMatch(/china/i);
        expect(headline).toMatch(/chicken|beef/i);
      }
    });
  });

  describe('next endpoint', () => {
    it('given an invalid id, throw an error with an appropriate message', async () => {
      await expect(client.next('my-invalid-item-id')).rejects.toThrowError(
        'Fetch request failed: 404',
      );
    });

    it('returns the next set of results after the provided id parameter', async () => {
      let originalContent = await client.search({
        q: 'mega',
        queryFields: ['headline'],
        showFields: ['headline'],
        orderBy: 'oldest',
      });
      // Make sure we have enough items to page over.
      expect(originalContent.length).toBeGreaterThan(2);

      // Get last item which we will skip over with next.
      const lastItem = originalContent[0];
      const nextContent = await client.next(lastItem.id, {
        q: 'mega',
        queryFields: ['headline'],
        showFields: ['headline'],
        orderBy: 'oldest',
      });
      // So the first piece of content in nextContent should match the second in originalContent.
      expect(nextContent[0]).toStrictEqual(originalContent[1]);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const originalContent = await client.search({
        q: 'mega',
        queryFields: ['headline'],
        showFields: ['headline'],
        orderBy: 'oldest',
      });
      const nextContent = await client.next(
        originalContent[originalContent.length - 1].id,
        {
          q: 'mega',
          queryFields: ['headline'],
          showFields: ['headline'],
        },
      );
      for (const item of nextContent) {
        expect(item.fields.headline).toMatch(/mega/i);
      }
    });
  });

  describe('tags endpoint', () => {
    it('returns an array of tag items', async () => {
      const tags = await client.tags();
      expect(Array.isArray(tags)).toStrictEqual(true);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const tags = await client.tags({
        q: 'mega',
      });
      for (const tag of tags) {
        expect(tag.webTitle).toMatch(/mega/i);
      }
    });
  });

  describe('sections endpoint', () => {
    it('returns an array of section items', async () => {
      const sections = await client.sections();
      expect(Array.isArray(sections)).toStrictEqual(true);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const sections = await client.sections({
        q: 'football',
      });
      for (const section of sections) {
        expect(section.webTitle).toMatch(/football/i);
      }
    });
  });

  describe('editions endpoint', () => {
    it('returns an array of edition items', async () => {
      const editions = await client.editions();
      expect(Array.isArray(editions)).toStrictEqual(true);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const editions = await client.editions({
        q: 'europe',
      });
      for (const edition of editions) {
        expect(edition.edition).toMatch(/europe/i);
      }
    });
  });
});

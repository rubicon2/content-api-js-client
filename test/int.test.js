import GuardianContentClient from '../dist/index';
import * as testData from '../mocks/apiResponseData';
import { describe, expect, it } from 'vitest';

const TEST_API_KEY = 'test';
const client = new GuardianContentClient(TEST_API_KEY);

describe('GuardianContentClient', () => {
  it.each([
    {
      method: 'item',
      args: [],
    },
    {
      method: 'search',
      args: [],
    },
    {
      method: 'next',
      args: ['some/content/id'],
    },
    {
      method: 'tags',
      args: [],
    },
    {
      method: 'sections',
      args: [],
    },
    {
      method: 'editions',
      args: [],
    },
  ])(
    '$method endpoint returns status: error, code and message properties if user is unauthorized, e.g. if api key is invalid',
    async ({ method, args }) => {
      const invalidClient = new GuardianContentClient('my-invalid-api-key');
      const expected = {
        ok: false,
        data: null,
        meta: null,
        code: 401,
        message: 'Unauthorized',
      };
      let response = await invalidClient[method](...args);
      expect(response).toStrictEqual(expected);
    },
  );

  it.each([
    { method: 'search', args: [] },
    { method: 'next', args: [testData.search.response.results[0].id] },
    { method: 'tags', args: [] },
  ])(
    '$method endpoint should contain the necessary properties to page through the results',
    async ({ method, args }) => {
      const { ok, meta } = await client[method](...args);
      // Make sure method was called successfully before checking meta fields,
      // since meta will not appear if method failed or hit an error.
      expect(ok).toStrictEqual(true);
      expect(meta.currentPage).toBeDefined();
      expect(meta.pageSize).toBeDefined();
      expect(meta.startIndex).toBeDefined();
      expect(meta.total).toBeDefined();
    },
  );

  describe('item endpoint', () => {
    it('given an invalid id, return with status code number, message string, and ok boolean properties', async () => {
      const response = await client.item('my-invalid-item-id');
      expect(response).toStrictEqual({
        ok: false,
        data: null,
        meta: null,
        code: 404,
        message: 'Not Found',
      });
    });

    it('should take an id and return the item on the data property', async () => {
      // Since testData uses actual data from api, compare against that.
      const content = testData.item.response.content;
      const response = await client.item(
        'technology/2014/feb/18/doge-such-questions-very-answered',
      );
      expect(response.data).toStrictEqual(content);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const { data } = await client.item(testData.item.response.content.id, {
        showFields: ['body', 'last-modified'],
      });
      expect(data.fields.body).toBeDefined();
      expect(data.fields.lastModified).toBeDefined();
    });
  });

  describe('search endpoint', () => {
    it('returns an array of content items on the data property', async () => {
      const { data } = await client.search();
      expect(Array.isArray(data)).toStrictEqual(true);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const { data } = await client.search({
        q: 'mega',
        queryFields: ['headline'],
        showFields: ['headline'],
      });
      for (const item of data) {
        expect(item.fields.headline).toMatch(/mega/i);
      }
    });

    it('q parameter works with boolean operators', async () => {
      const { data } = await client.search({
        q: 'china AND (chicken OR beef)',
        queryFields: ['headline'],
        showFields: ['headline'],
      });
      for (const item of data) {
        const headline = item.fields.headline;
        expect(headline).toMatch(/china/i);
        expect(headline).toMatch(/chicken|beef/i);
      }
    });

    it('when given Date objects for fromDate and toDate, turns into correct format for API', async () => {
      const fromDate = new Date('2026-02-15');
      const toDate = new Date('2026-02-16');
      const response = await client.search({
        fromDate: fromDate,
        toDate: toDate,
      });
      for (const item of response.data) {
        const date = new Date(item.webPublicationDate);
        expect(date.getTime()).toBeGreaterThanOrEqual(fromDate.getTime());
        expect(date.getTime()).toBeLessThanOrEqual(toDate.getTime());
      }
    });

    it('when given string format dates for fromDate and toDate, turns into correct format for API', async () => {
      const fromDate = '2026-02-15';
      const toDate = '2026-02-16';
      const response = await client.search({
        fromDate,
        toDate,
      });
      for (const item of response.data) {
        const date = new Date(item.webPublicationDate);
        expect(date.getTime()).toBeGreaterThanOrEqual(
          new Date(fromDate).getTime(),
        );
        expect(date.getTime()).toBeLessThanOrEqual(new Date(toDate).getTime());
      }
    });
  });

  describe('next endpoint', () => {
    it('given an invalid id, return with status code number, message string, and ok boolean properties', async () => {
      const response = await client.next('my-invalid-item-id');
      expect(response).toStrictEqual({
        ok: false,
        data: null,
        meta: null,
        code: 404,
        message: 'Not Found',
      });
    });

    it('returns a data property containing the next set of results after the provided id parameter', async () => {
      let { data: originalContent } = await client.search({
        q: 'mega',
        queryFields: ['headline'],
        showFields: ['headline'],
        orderBy: 'oldest',
      });
      // Make sure we have enough items to page over.
      expect(originalContent.length).toBeGreaterThan(2);

      // Get last item which we will skip over with next.
      const lastItem = originalContent[0];
      const { data: nextContent } = await client.next(lastItem.id, {
        q: 'mega',
        queryFields: ['headline'],
        showFields: ['headline'],
        orderBy: 'oldest',
      });
      // So the first piece of content in nextContent should match the second in originalContent.
      expect(nextContent[0]).toStrictEqual(originalContent[1]);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const { data: originalContent } = await client.search({
        q: 'mega',
        queryFields: ['headline'],
        showFields: ['headline'],
        orderBy: 'oldest',
      });
      const { data: nextContent } = await client.next(
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

    it('when given Date objects for fromDate and toDate, turns into correct format for API', async () => {
      const params = {
        q: 'mega',
        queryFields: ['headline'],
        showFields: ['headline'],
        orderBy: 'oldest',
        fromDate: new Date('2016-02-15'),
        toDate: new Date('2026-02-15'),
      };

      let { data: originalContent } = await client.search(params);
      // Make sure we have enough items to page over.
      expect(originalContent.length).toBeGreaterThan(2);

      // Get first item which we will skip over with next.
      const lastItem = originalContent[0];

      const response = await client.next(lastItem.id, params);
      for (const item of response.data) {
        const date = new Date(item.webPublicationDate);
        expect(date.getTime()).toBeGreaterThanOrEqual(
          new Date(params.fromDate).getTime(),
        );
        expect(date.getTime()).toBeLessThanOrEqual(
          new Date(params.toDate).getTime(),
        );
      }
    });

    it('when given string format dates for fromDate and toDate, turns into correct format for API', async () => {
      const params = {
        q: 'mega',
        queryFields: ['headline'],
        showFields: ['headline'],
        orderBy: 'oldest',
        fromDate: '2016-02-15',
        toDate: '2026-02-15',
      };

      let { data: originalContent } = await client.search(params);
      // Make sure we have enough items to page over.
      expect(originalContent.length).toBeGreaterThan(2);

      // Get first item which we will skip over with next.
      const lastItem = originalContent[0];

      const response = await client.next(lastItem.id, params);
      for (const item of response.data) {
        const date = new Date(item.webPublicationDate);
        expect(date.getTime()).toBeGreaterThanOrEqual(
          new Date(params.fromDate).getTime(),
        );
        expect(date.getTime()).toBeLessThanOrEqual(
          new Date(params.toDate).getTime(),
        );
      }
    });
  });

  describe('tags endpoint', () => {
    it('returns an array of tag items on the data property', async () => {
      const { data } = await client.tags();
      expect(Array.isArray(data)).toStrictEqual(true);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const { data } = await client.tags({
        q: 'mega',
      });
      for (const tag of data) {
        expect(tag.webTitle).toMatch(/mega/i);
      }
    });
  });

  describe('sections endpoint', () => {
    it('returns an array of section items on the data property', async () => {
      const { data } = await client.sections();
      expect(Array.isArray(data)).toStrictEqual(true);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const { data } = await client.sections({
        q: 'football',
      });
      for (const section of data) {
        expect(section.webTitle).toMatch(/football/i);
      }
    });
  });

  describe('editions endpoint', () => {
    it('returns an array of edition items on the data property', async () => {
      const { data } = await client.editions();
      expect(Array.isArray(data)).toStrictEqual(true);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const { data } = await client.editions({
        q: 'europe',
      });
      for (const edition of data) {
        expect(edition.edition).toMatch(/europe/i);
      }
    });
  });
});

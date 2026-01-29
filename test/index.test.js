import GuardianContentClient from '../dist/index';
import * as testData from '../mocks/apiResponseData';
import { describe, expect, it, vi } from 'vitest';

// The unit test fetch requests should be intercepted by MSW server, so api key doesn't matter.
const TEST_API_KEY = 'some-random-key';
const client = new GuardianContentClient(TEST_API_KEY);

describe('GuardianContentClient', () => {
  it('each endpoint should return a promise', () => {
    expect(
      client.item('technology/2014/feb/18/doge-such-questions-very-answered'),
    ).toBeInstanceOf(Promise);
    expect(client.search({ q: 'tennis' })).toBeInstanceOf(Promise);
    expect(
      client.next(
        'sport/live/2026/jan/27/australian-open-2026-gauff-svitolina-alcaraz-de-minaur-live',
      ),
    ).toBeInstanceOf(Promise);
    expect(client.tags()).toBeInstanceOf(Promise);
    expect(client.sections()).toBeInstanceOf(Promise);
    expect(client.editions()).toBeInstanceOf(Promise);
  });

  it('each endpoint should reject a parameter of format with a value other than json', async () => {
    const expectedError =
      'Fetch request failed: client only supports json format response';

    await expect(() =>
      client.item('technology/2014/feb/18/doge-such-questions-very-answered', {
        format: 'xml',
      }),
    ).rejects.toThrowError(expectedError);

    await expect(() => client.search({ format: 'xml' })).rejects.toThrowError(
      expectedError,
    );

    await expect(() =>
      client.next('technology/2014/feb/18/doge-such-questions-very-answered', {
        format: 'xml',
      }),
    ).rejects.toThrowError(expectedError);

    await expect(() => client.tags({ format: 'xml' })).rejects.toThrowError(
      expectedError,
    );

    await expect(() => client.editions({ format: 'xml' })).rejects.toThrowError(
      expectedError,
    );
  });

  it('each endpoint should reject a parameter of callback', async () => {
    const expectedError =
      'Fetch request failed: client does not support callback parameter';

    await expect(() =>
      client.item('technology/2014/feb/18/doge-such-questions-very-answered', {
        callback: 'whatever',
      }),
    ).rejects.toThrowError(expectedError);

    await expect(() =>
      client.search({
        callback: 'whatever',
      }),
    ).rejects.toThrowError(expectedError);

    await expect(() =>
      client.next(
        'sport/live/2026/jan/27/australian-open-2026-gauff-svitolina-alcaraz-de-minaur-live',
        {
          callback: 'whatever',
        },
      ),
    ).rejects.toThrowError(expectedError);

    await expect(() =>
      client.tags({
        callback: 'whatever',
      }),
    ).rejects.toThrowError(expectedError);

    await expect(() =>
      client.editions({ callback: 'whatever' }),
    ).rejects.toThrowError(expectedError);
  });

  describe('item endpoint', () => {
    it('given an invalid id, throw an error with an appropriate message', () => {
      expect(
        async () => await client.item('my-invalid-item-id'),
      ).rejects.toThrowError('Fetch request failed: 404');
    });

    it('should take an id and return the item as an object', async () => {
      const data = await client.item(
        'technology/2014/feb/18/doge-such-questions-very-answered',
      );
      expect(data).toStrictEqual(testData.item.response.content);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch');
      await client.search({
        showFields: ['body', 'last-modified'],
        showTags: 'all',
      });
      // Just need to make sure the http request is provided the correct query string.
      const fetchUrl = fetchSpy.mock.lastCall[0];
      expect(fetchUrl).toMatch('show-fields=body,last-modified&show-tags=all');
    });
  });

  describe('search endpoint', () => {
    it('returns an array of content items', async () => {
      const content = await client.search();
      expect(content).toStrictEqual(testData.search.response.results);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch');
      await client.search({
        q: 'mega',
        queryFields: ['body', 'headline', 'byline'],
        starRating: 5,
        lang: 'en',
        orderBy: 'newest',
      });
      // Just need to make sure the http request is provided the correct query string.
      const fetchUrl = fetchSpy.mock.lastCall[0];
      expect(fetchUrl).toMatch(
        'q=mega&query-fields=body,headline,byline&star-rating=5&lang=en&order-by=newest',
      );
    });
  });

  describe('next endpoint', () => {
    it('given an invalid id, throw an error with an appropriate message', async () => {
      await expect(client.next('my-invalid-item-id')).rejects.toThrowError(
        'Fetch request failed: 404',
      );
    });

    it('returns the next set of results after the provided id parameter', async () => {
      const originalContent = testData.search.response.results;
      let lastItem = originalContent[0];
      for (let i = 1; i < originalContent.length; i++) {
        const nextContent = await client.next(lastItem.id);
        const expectedContent = originalContent.slice(
          originalContent.findIndex((content) => content.id === lastItem.id) +
            1,
        );
        expect(nextContent).toStrictEqual(expectedContent);
        expect(nextContent.length).toStrictEqual(originalContent.length - i);
        lastItem = nextContent[0];
      }
    });

    it('with a second parameter of query object, turn into a query string and append to request', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch');
      const lastItem = testData.search.response.results[0];
      await client.next(lastItem.id, {
        q: 'mega',
        queryFields: ['body', 'headline', 'byline'],
        starRating: 5,
        lang: 'en',
        orderBy: 'newest',
      });
      // Just need to make sure the http request is provided the correct query string.
      const fetchUrl = fetchSpy.mock.lastCall[0];
      expect(fetchUrl).toMatch(
        'q=mega&query-fields=body,headline,byline&star-rating=5&lang=en&order-by=newest',
      );
    });
  });

  describe('tags endpoint', () => {
    it('returns an array of tag items', async () => {
      const tags = await client.tags();
      expect(tags).toStrictEqual(testData.tags.response.results);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch');
      await client.tags({
        q: 'mega',
        queryFields: ['body', 'headline', 'byline'],
        starRating: 5,
        lang: 'en',
        orderBy: 'newest',
      });
      // Just need to make sure the http request is provided the correct query string.
      const fetchUrl = fetchSpy.mock.lastCall[0];
      expect(fetchUrl).toMatch(
        'q=mega&query-fields=body,headline,byline&star-rating=5&lang=en&order-by=newest',
      );
    });
  });

  describe('sections endpoint', () => {
    it('returns an array of section items', async () => {
      const sections = await client.sections();
      expect(sections).toStrictEqual(testData.sections.response.results);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch');
      await client.sections({
        q: 'mega',
        queryFields: ['body', 'headline', 'byline'],
        starRating: 5,
        lang: 'en',
        orderBy: 'newest',
      });
      // Just need to make sure the http request is provided the correct query string.
      const fetchUrl = fetchSpy.mock.lastCall[0];
      expect(fetchUrl).toMatch(
        'q=mega&query-fields=body,headline,byline&star-rating=5&lang=en&order-by=newest',
      );
    });
  });

  describe('editions endpoint', () => {
    it('returns an array of edition items', async () => {
      const editions = await client.editions();
      expect(editions).toStrictEqual(testData.editions.response.results);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch');
      await client.editions({
        q: 'mega',
        queryFields: ['body', 'headline', 'byline'],
        starRating: 5,
        lang: 'en',
        orderBy: 'newest',
      });
      // Just need to make sure the http request is provided the correct query string.
      const fetchUrl = fetchSpy.mock.lastCall[0];
      expect(fetchUrl).toMatch(
        'q=mega&query-fields=body,headline,byline&star-rating=5&lang=en&order-by=newest',
      );
    });
  });
});

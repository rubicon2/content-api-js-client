import GuardianContentClient from '../dist/index';
import * as testData from '../mocks/apiResponseData';
import { describe, expect, it, vi } from 'vitest';

const TEST_API_KEY = 'test';
const client = new GuardianContentClient(TEST_API_KEY);

describe('GuardianContentClient', () => {
  it('each endpoint should return a promise', () => {
    expect(
      client.item('technology/2014/feb/18/doge-such-questions-very-answered'),
    ).toBeInstanceOf(Promise);
  });

  describe('item endpoint', () => {
    // Is there any way/point to mocking this out?
    // it('should throw an error if user is unauthorized, e.g. if api key is invalid', async () => {
    //   const invalidClient = new GuardianContentClient('my-invalid-api-key');
    //   await expect(() =>
    //     invalidClient.item(
    //       '/technology/2014/feb/18/doge-such-questions-very-answered',
    //     ),
    //   ).rejects.toThrowError('Fetch request failed: 401');
    // });

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
  });

  describe('search endpoint', () => {
    it('returns an array of content items', async () => {
      const content = await client.content();
      expect(content).toStrictEqual(testData.search.response.results);
    });

    it('with a first parameter of query object, turn into a query string and append to request', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch');
      await client.content({
        format: 'json',
        callback: 'myCallback',
        q: 'mega',
        queryFields: ['body', 'headline', 'byline'],
        starRating: 5,
        lang: 'en',
        orderBy: 'newest',
      });
      // Just need to make sure the http request is provided the correct query string.
      const fetchUrl = fetchSpy.mock.lastCall[0];
      expect(fetchUrl).toMatch(
        'format=json&callback=myCallback&q=mega&query-fields=body,headline,byline&star-rating=5&lang=en&order-by=newest',
      );
    });
  });
});

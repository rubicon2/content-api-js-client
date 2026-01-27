import GuardianContentClient from '../dist/index';
import * as testData from '../mocks/apiResponseData';
import { describe, expect, it } from 'vitest';

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
});

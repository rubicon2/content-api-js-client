import GuardianContentClient from '../dist/index';
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
    it('should throw an error if user is unauthorized, e.g. if api key is invalid', async () => {
      const invalidClient = new GuardianContentClient('my-invalid-api-key');
      await expect(() => invalidClient.item('whatever')).rejects.toThrowError(
        'Fetch request failed: 401',
      );
    });

    it('given an invalid id, throw an error with an appropriate message', () => {
      expect(
        async () => await client.item('my-invalid-item-id'),
      ).rejects.toThrowError('Fetch request failed: 404');
    });

    it('should take an id and return the item as an object', async () => {
      const data = await client.item(
        'technology/2014/feb/18/doge-such-questions-very-answered',
      );

      expect(data).toStrictEqual({
        apiUrl:
          'https://content.guardianapis.com/technology/2014/feb/18/doge-such-questions-very-answered',
        id: 'technology/2014/feb/18/doge-such-questions-very-answered',
        isHosted: false,
        pillarId: 'pillar/news',
        pillarName: 'News',
        sectionId: 'technology',
        sectionName: 'Technology',
        type: 'article',
        webPublicationDate: '2014-02-18T10:25:30Z',
        webTitle: 'What is Doge?',
        webUrl:
          'https://www.theguardian.com/technology/2014/feb/18/doge-such-questions-very-answered',
      });
    });
  });
});

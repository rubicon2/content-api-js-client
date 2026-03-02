import type { QueryContentParams } from '../dist/index';
import Client from '../dist/index';
import { describe, it, expect } from 'vitest';

const client = new Client('test');

describe('README examples', () => {
  it('simple query example works', () => {
    client
      .search({
        q: 'outer AND (wilds OR worlds)',
        queryFields: ['headline'],
        showFields: ['headline'],
      })
      .then((response) => {
        expect(response.data).not.toBeNull();
        if (response.data) {
          // Do something with the data.
        }
      });
  });

  it('error handling example works', async () => {
    const response = await client.item('some/article/id');
    expect(response.data).toBeNull();
    expect(response.meta).toBeNull();
    if (response.ok) {
      // Do something with the data and/or meta objects.
    } else {
      // If the request fails for any reason, we will have a
      // message, and an http status code if fetch returned one.
      const { code, message } = response;
      expect(code).toStrictEqual(404);
      // Can use code to respond differently to different failure states.
      switch (code) {
        case 403: {
          // User is unauthorized, e.g. api key needs updating or ran out of calls.
          break;
        }
        case 404: {
          // Will get this if you use the item or next endpoints with an invalid id.
          break;
        }
        default: {
          // Triggered if code is undefined or not in any other case.
          break;
        }
      }
      console.log(message);
    }
  });

  it('deep paging example works', async () => {
    const params: QueryContentParams = {
      q: 'sausages',
      queryFields: ['headline'],
      showFields: ['headline'],
      orderBy: 'oldest',
      pageSize: 10,
    };

    let response = await client.search(params);
    if (!response.ok)
      throw new Error(`Initial search failed: ${response.message}`);

    // Make sure we have enough results to page through.
    expect(response.data.length).toStrictEqual(10);
    expect(response.meta.pages).toBeGreaterThanOrEqual(2);

    // Response ok was true, so we know data and meta are not null.
    const allData = [...response.data];

    do {
      const lastId = allData[allData.length - 1].id;
      response = await client.next(lastId, params);
      expect(response.data).not.toBeNull();
      if (response.data) {
        allData.push(...response.data);
      } else break;
      // While data length is same as pageSize, there are more results to get.
    } while (response.data.length === params.pageSize);
  });
});

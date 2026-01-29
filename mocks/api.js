import * as data from './apiResponseData';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const BASE_URL = 'https://content.guardianapis.com';

export const server = setupServer(
  http.get(
    `${BASE_URL}/technology/2014/feb/18/doge-such-questions-very-answered`,
    () => {
      return HttpResponse.json(data.item);
    },
  ),
  http.get(`${BASE_URL}/search`, () => {
    return HttpResponse.json(data.search);
  }),
  http.get(`${BASE_URL}/content/:id*/next`, ({ params }) => {
    const testData = data.search.response.results;
    // Since item id contains forward slashes, this is interpreted as many different path segments.
    // MSW returns this as an array, so will need to join together to get the actual id.
    const lastItemId = params.id.join('/');
    const lastItem = testData.find((item) => item.id === lastItemId);
    if (!lastItem) {
      return HttpResponse.json(
        {
          response: {
            status: 'error',
            message: 'The requested resource could not be found.',
          },
        },
        { status: 404 },
      );
    }
    // Get all results after that item.
    const results = testData.slice(
      testData.findIndex((item) => item.id === lastItem.id) + 1,
    );
    return HttpResponse.json({
      response: {
        results,
      },
    });
  }),
  http.get(`${BASE_URL}/tags`, () => {
    return HttpResponse.json(data.tags);
  }),
  http.get(`${BASE_URL}/sections`, () => {
    return HttpResponse.json(data.sections);
  }),
  http.get(`${BASE_URL}/editions`, () => {
    return HttpResponse.json(data.editions);
  }),
  http.all(`${BASE_URL}*`, () => {
    // I.e. not caught by any other routes. 404.
    return HttpResponse.json(
      {
        response: {
          status: 'error',
          message: 'The requested resource could not be found.',
        },
      },
      { status: 404 },
    );
  }),
);

server.events.on('request:start', ({ request }) => {
  console.log('MSW intercepted:', request.method, request.url);
});

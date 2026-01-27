import * as data from './apiResponseData';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const server = setupServer(
  http.get(
    'https://content.guardianapis.com/technology/2014/feb/18/doge-such-questions-very-answered',
    () => {
      return HttpResponse.json(data.item);
    },
  ),
  http.all('https://content.guardianapis.com*', () => {
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

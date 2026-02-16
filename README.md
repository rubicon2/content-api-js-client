# content-api-js-client

A JS client library for the Guardian's Content API.

Provides code suggestions to make it easier to create complex queries without having to refer to the documentation.

## Install

```bash
npm install content-api-js-client
```

## Usage

### A Simple Query

```js
import GuardianClient from 'content-api-js-client';

const client = new GuardianClient('my-api-key');

client.search({
  q: 'outer AND (wilds OR worlds)'
  queryFields: ['headline'],
  showFields: ['headline']
}).then((response) => {
  if (response.data) {
    // Do something with the data.
  }
})
```

### Handling Errors

If you want to deal with different failure states, you can do something like the following:

```js
client.search('some/article/id')
  .then((response) => {
    if (response.ok) {
      const { data, meta } = response;
      // Do something with the data and/or meta objects.
    } else {
      // If the request fails for any reason, we will have a
      // message, and an http status code if fetch returned one.
      const { code, message } = response;
      // Can use code to respond differently to different failure states.
      switch (code) {
        case: 403: {
          // User is unauthorized, e.g. api key needs updating or ran out of calls.
          break;
        }
        case: 404: {
          // ID is invalid, so e.g. add to some ignore list.
          break;
        }
        default: {
          // Triggered if code is undefined or not in any other case.
          break;
        }
      }
      console.log(message);
    }
})
```

### Deeply Paging Through Content

```js
// Use same params for search and next methods to page through results.
// If using typescript, import and use QueryContentParams interface for type-checking.
const params = {
  q: 'outer AND (wilds OR worlds)',
  queryFields: ['headline'],
  showFields: ['headline'],
  orderBy: 'oldest',
  pageSize: 10,
};

let response = await client.search(params);
if (!response.ok) throw new Error(`Initial search failed: ${response.message}`);

let { data } = response;
const allData = [...data];

// While data length is same as pageSize, there are more results to get.
while (data.length === params.pageSize) {
  const lastId = data[data.length - 1].id;
  response = await client.next(lastId, params);
  if (response.data) {
    allData.push(...response.data);
  }
}

console.log(`allData (${allData.length}):`, allData);
```

## Methods

| Name | Description |
| ---- | ----------- |
| ```search``` | Search for articles. Can use the ```page``` query parameter to page through results, although the ```next``` method is a better choice for content items. |
| ```next``` | Search for articles, using a content id as a cursor. Can be used to deeply paginate through results, unlike the ```search``` method with the ```page``` query parameter. |
| ```tags``` | Search for tags. Can use the ```page``` query parameter to page through results. |
| ```sections``` | Search for sections. |
| ```editions``` | Search for editions. |
| ```item``` | Retrieve an individual article by its id. |

## The Response Object

Each method returns a promise that resolves to an object. What properties are available on the object depends on whether or not the API call was successful or not.

### A Successful Response

| Property | Type | Description |
| -------- | ----- | ----------- |
| ok | true | Always true. Can be used for conditional statements to respond differently to a successful API call or a failure. |
| data | array, object | An array of results, or an individual item, depending on the method. |
| meta | object | An object containing information about the request, returned by the API. Contains page info on ```search```, ```next``` and ```tags``` methods, for paging through results. |

#### The Meta Object

The fields on this object depend on the method, since each API route returns different information.

| Method | Properties |
| ------ | ---------- |
| ```item```, ```editions```, ```sections``` | ```{ status: 'ok' \| 'error', userTier: 'developer' \| 'commercial', total: number }``` |
| ```tags``` | As above, plus: ```{ startIndex: number, pageSize: number, currentPage: number, pages: number }``` |
| ```search``` | Same as tags, plus: ```{ orderBy: 'newest' \| 'oldest' \| 'relevance' }``` |

### An Unsuccessful Response

This format object will be returned if the API request fails for any reason, including 404s when you are trying to get a specific piece of content with the ```item``` method.

| Property | Type | Description |
| -------- | ----- | ----------- |
| ok | false | Always false. |
| data | null | Always null. |
| meta | null | Always null. |
| code | number, undefined | If the fetch request returned a status code, this will be a number. If the client failed for some other reason  (e.g. not connected to the internet), the code will be undefined. |
| message | string | A human-readable message detailing why the request failed. |

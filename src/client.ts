import { paramsToStr } from './params.js';

class Client {
  #apiKey: string;
  #baseUrl: string = 'https://content.guardianapis.com';

  constructor(apiKey: string) {
    this.#apiKey = apiKey;
  }

  async item(id: string): Promise<object> {
    const response: Response = await fetch(
      `${this.#baseUrl}/${id}?api-key=${this.#apiKey}`,
    );

    if (response.ok) {
      const apiResponse: ApiResponse = (await response?.json()) as ApiResponse;
      const data = apiResponse.response as ApiResponseSingle;
      return data.content;
    } else {
      throw new Error('Fetch request failed: ' + response.status);
    }
  }

  async search(params: QueryContentParams = {}): Promise<Array<Content>> {
    const response: Response = await fetch(
      `${this.#baseUrl}/search?api-key=${this.#apiKey}&${paramsToStr(params)}`,
    );

    if (response.ok) {
      const apiResponse: ApiResponse = (await response?.json()) as ApiResponse;
      const data = apiResponse.response as ApiSearchResponse;
      return data.results;
    } else {
      throw new Error('Fetch request failed: ' + response.status);
    }
  }

  async next(
    id: string,
    params: QueryContentParams = {},
  ): Promise<Array<Content>> {
    const response: Response = await fetch(
      `${this.#baseUrl}/content/${id}/next?api-key=${this.#apiKey}&${paramsToStr(params)}`,
    );

    if (response.ok) {
      const apiResponse: ApiResponse = (await response?.json()) as ApiResponse;
      const data = apiResponse.response as ApiSearchResponse;
      return data.results;
    } else {
      throw new Error('Fetch request failed: ' + response.status);
    }
  }

  async tags(params: QueryTagParams = {}): Promise<Array<Tag>> {
    const response: Response = await fetch(
      `${this.#baseUrl}/tags?api-key=${this.#apiKey}&${paramsToStr(params)}`,
    );

    if (response.ok) {
      const apiResponse: ApiResponse = (await response?.json()) as ApiResponse;
      const data = apiResponse.response as ApiTagsResponse;
      return data.results;
    } else {
      throw new Error('Fetch request failed: ' + response.status);
    }
  }

  async sections(params: QuerySectionParams = {}): Promise<Array<Section>> {
    const response: Response = await fetch(
      `${this.#baseUrl}/sections?api-key=${this.#apiKey}&${paramsToStr(params)}`,
    );

    if (response.ok) {
      const apiResponse: ApiResponse = (await response?.json()) as ApiResponse;
      const data = apiResponse.response as ApiSectionsResponse;
      return data.results;
    } else {
      throw new Error('Fetch request failed: ' + response.status);
    }
  }

  async editions(params: QueryEditionParams = {}): Promise<Array<Edition>> {
    const response: Response = await fetch(
      `${this.#baseUrl}/editions?api-key=${this.#apiKey}&${paramsToStr(params)}`,
    );

    if (response.ok) {
      const apiResponse: ApiResponse = (await response?.json()) as ApiResponse;
      const data = apiResponse.response as ApiEditionsResponse;
      return data.results;
    } else {
      throw new Error('Fetch request failed: ' + response.status);
    }
  }
}

export default Client;

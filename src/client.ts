import { paramsToStr } from './params.js';

class Client {
  #apiKey: string;
  #baseUrl: string = 'https://content.guardianapis.com';

  constructor(apiKey: string) {
    this.#apiKey = apiKey;
  }

  async #apiFetch<ReturnType>(
    url: string,
    params:
      | ContentParams
      | QueryContentParams
      | QueryTagParams
      | QuerySectionParams
      | QueryEditionParams,
  ) {
    const response: Response = await fetch(
      `${this.#baseUrl}/${url}?api-key=${this.#apiKey}&${paramsToStr(params)}`,
    );

    if (response.ok) {
      const apiResponse: ApiResponse = (await response?.json()) as ApiResponse;
      const data = apiResponse.response as ReturnType;
      return data;
    } else {
      throw new Error('Fetch request failed: ' + response.status);
    }
  }

  async item(id: string, params: ContentParams = {}): Promise<Content> {
    const data: ApiResponseSingle = await this.#apiFetch(id, params);
    return data.content;
  }

  async search(params: QueryContentParams = {}): Promise<Array<Content>> {
    const data: ApiSearchResponse = await this.#apiFetch('search', params);
    return data.results;
  }

  async next(
    id: string,
    params: QueryContentParams = {},
  ): Promise<Array<Content>> {
    const data: ApiSearchResponse = await this.#apiFetch(
      `content/${id}/next`,
      params,
    );
    return data.results;
  }

  async tags(params: QueryTagParams = {}): Promise<Array<Tag>> {
    const data: ApiTagsResponse = await this.#apiFetch('tags', params);
    return data.results;
  }

  async sections(params: QuerySectionParams = {}): Promise<Array<Section>> {
    const data: ApiSectionsResponse = await this.#apiFetch('sections', params);
    return data.results;
  }

  async editions(params: QueryEditionParams = {}): Promise<Array<Edition>> {
    const data: ApiEditionsResponse = await this.#apiFetch('editions', params);
    return data.results;
  }
}

export default Client;

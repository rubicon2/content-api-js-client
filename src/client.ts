import type {
  ContentParams,
  QueryContentParams,
  QueryTagParams,
  QuerySectionParams,
  QueryEditionParams,
} from './params.js';
import type {
  ApiResponse,
  ApiResponseSingle,
  ApiResponseMultiple,
  ApiSearchResponse,
  Content,
  Tag,
  Section,
  Edition,
} from './api.js';
import { paramsToStr } from './params.js';

/**
 * A client to interface with the Guardian's content API.
 */
class Client {
  #apiKey: string;
  #baseUrl: string = 'https://content.guardianapis.com';

  /**
   * @param {string} apiKey Your API key, which can be acquired from here: {@link https://open-platform.theguardian.com/access}
   */
  constructor(apiKey: string) {
    this.#apiKey = apiKey;
  }

  /**
   * A private function to simplify the fetch process and sanitize the url.
   */
  async #apiFetch<ReturnType>(
    url: string,
    params:
      | ContentParams
      | QueryContentParams
      | QueryTagParams
      | QuerySectionParams
      | QueryEditionParams,
  ) {
    const sanitizedUrl = new URL(
      `${url}?api-key=${this.#apiKey}&${paramsToStr(params)}`,
      this.#baseUrl,
    );
    const response: Response = await fetch(sanitizedUrl);

    if (response.ok) {
      const apiResponse: ApiResponse = (await response?.json()) as ApiResponse;
      const data = apiResponse.response as ReturnType;
      return data;
    } else {
      throw new Error('Fetch request failed: ' + response.status);
    }
  }

  /**
   * Retrieve an individual item by its id.
   * @param {string} id The id of the item to be retrieved.
   * @param {ContentParams} params The parameters of the query. See {@link https://open-platform.theguardian.com/documentation/item} for details.
   */
  async item(id: string, params: ContentParams = {}): Promise<Content> {
    const data: ApiResponseSingle<Content> = await this.#apiFetch(id, params);
    return data.content;
  }

  /**
   * Retrieve items based on query parameters.
   * @param {QueryContentParams} params The parameters of the query. See {@link https://open-platform.theguardian.com/documentation/search} for details.
   */
  async search(params: QueryContentParams = {}): Promise<Array<Content>> {
    const data: ApiSearchResponse<Content> = await this.#apiFetch(
      'search',
      params,
    );
    return data.results;
  }

  /**
   * Retrieve the next set of items based on query parameters, and after the provided id.
   * This method allows for deep pagination, unlike the page/pageSize fields, which can only
   * page through several thousand results. Simply provide the id of the last item in the
   * previous set of results (from a search or previous calls to next), and use the same params
   * to page through the results.
   * @param {string} id The id of the last item retrieved.
   * @param {QueryContentParams} params The parameters of the query. See {@link https://open-platform.theguardian.com/documentation/search} for details.
   */
  async next(
    id: string,
    params: QueryContentParams = {},
  ): Promise<Array<Content>> {
    const data: ApiSearchResponse<Content> = await this.#apiFetch(
      `content/${id}/next`,
      params,
    );
    return data.results;
  }

  /**
   * Retrieve tags based on query parameters.
   * @param {QueryTagParams} params The parameters of the query. See {@link https://open-platform.theguardian.com/documentation/tag} for details.
   */
  async tags(params: QueryTagParams = {}): Promise<Array<Tag>> {
    const data: ApiResponseMultiple<Tag> = await this.#apiFetch('tags', params);
    return data.results;
  }

  /**
   * Retrieve sections based on query parameters.
   * @param {QuerySectionParams} params The parameters of the query. See {@link https://open-platform.theguardian.com/documentation/section} for details.
   */
  async sections(params: QuerySectionParams = {}): Promise<Array<Section>> {
    const data: ApiResponseMultiple<Section> = await this.#apiFetch(
      'sections',
      params,
    );
    return data.results;
  }

  /**
   * Retrieve editions based on query parameters.
   * @param {QueryEditionParams} params The parameters of the query. See {@link https://open-platform.theguardian.com/documentation/edition} for details.
   */
  async editions(params: QueryEditionParams = {}): Promise<Array<Edition>> {
    const data: ApiResponseMultiple<Edition> = await this.#apiFetch(
      'editions',
      params,
    );
    return data.results;
  }
}

export default Client;

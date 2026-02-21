import type {
  QueryItemParams,
  QueryContentParams,
  QueryTagParams,
  QuerySectionParams,
  QueryEditionParams,
} from './params.js';
import type {
  ApiResponse,
  ApiResponseSingle,
  ApiResponseMultiple,
  ApiPagedResponse,
  ApiResponseMeta,
  ApiPagedResponseMeta,
  Content,
  Tag,
  Section,
  Edition,
} from './api.js';
import { paramsToStr } from './params.js';

/**
 * Format of internal #apiFetch response.
 */
interface ClientFetchSuccess<T> {
  ok: true;
  data: T;
}

/**
 * Format returned by a successful call to a client endpoint.
 */
export interface ClientSuccess<DataT, MetaT> extends ClientFetchSuccess<DataT> {
  meta: MetaT;
}

/**
 * Format returned by an unsuccessful call to a client endpoint.
 */
export interface ClientError {
  ok: false;
  data: null;
  meta: null;
  message: string;
  code?: number;
}

export type ClientItemResponse =
  | ClientSuccess<Content, ApiResponseMeta>
  | ClientError;
export type ClientSearchResponse =
  | ClientSuccess<Content[], ApiPagedResponseMeta>
  | ClientError;
export type ClientNextResponse = ClientSearchResponse;
export type ClientTagsResponse =
  | ClientSuccess<Tag[], Omit<ApiPagedResponseMeta, 'orderBy'>>
  | ClientError;
export type ClientSectionsResponse =
  | ClientSuccess<Section[], ApiResponseMeta>
  | ClientError;
export type ClientEditionsResponse =
  | ClientSuccess<Edition[], ApiResponseMeta>
  | ClientError;

/**
 * A client to interface with the Guardian's content API.
 */
export default class Client {
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
      | QueryItemParams
      | QueryContentParams
      | QueryTagParams
      | QuerySectionParams
      | QueryEditionParams,
  ): Promise<ClientFetchSuccess<ReturnType> | ClientError> {
    const sanitizedUrl = new URL(
      `${url}?api-key=${this.#apiKey}&${paramsToStr(params)}`,
      this.#baseUrl,
    );
    try {
      const response: Response = await fetch(sanitizedUrl);

      if (response.ok) {
        const apiResponse: ApiResponse =
          (await response?.json()) as ApiResponse;
        const data = apiResponse.response as ReturnType;
        return {
          ok: true,
          data,
        };
      } else {
        return {
          ok: false,
          data: null,
          meta: null,
          code: response.status,
          message: response.statusText,
        };
      }
    } catch (error) {
      // Any type of data can be thrown in js, not just Error.
      // So have to check before accessing message.
      if (error instanceof Error) {
        return {
          ok: false,
          data: null,
          meta: null,
          message: error.message,
        };
      } else {
        return {
          ok: false,
          data: null,
          meta: null,
          message: 'An unexpected error occurred',
        };
      }
    }
  }

  /**
   * Retrieve an individual item by its id.
   * @param {string} id The id of the item to be retrieved.
   * @param {ContentParams} params The parameters of the query. See {@link https://open-platform.theguardian.com/documentation/item} for details.
   */
  async item(
    id: string,
    params: QueryItemParams = {},
  ): Promise<ClientItemResponse> {
    const response = await this.#apiFetch<ApiResponseSingle<Content>>(
      id,
      params,
    );
    if (response.ok) {
      const { content, ...meta } = response.data;
      return {
        ok: true,
        data: content,
        meta,
      };
    } else {
      return response;
    }
  }

  /**
   * Retrieve items based on query parameters.
   * @param {QueryContentParams} params The parameters of the query. See {@link https://open-platform.theguardian.com/documentation/search} for details.
   */
  async search(params: QueryContentParams = {}): Promise<ClientSearchResponse> {
    const response = await this.#apiFetch<ApiPagedResponse<Content>>(
      'search',
      params,
    );
    if (response.ok) {
      const { results, ...meta } = response.data;
      return {
        ok: true,
        data: results,
        meta,
      };
    } else {
      return response;
    }
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
  ): Promise<ClientNextResponse> {
    const response = await this.#apiFetch<ApiPagedResponse<Content>>(
      `content/${id}/next`,
      params,
    );
    if (response.ok) {
      const { results, ...meta } = response.data;
      return {
        ok: true,
        data: results,
        meta,
      };
    } else {
      return response;
    }
  }

  /**
   * Retrieve tags based on query parameters.
   * @param {QueryTagParams} params The parameters of the query. See {@link https://open-platform.theguardian.com/documentation/tag} for details.
   */
  async tags(params: QueryTagParams = {}): Promise<ClientTagsResponse> {
    // Omit 'orderBy' from ApiPagedResponse interface, since for some reason it is not included in api response.
    const response = await this.#apiFetch<
      Omit<ApiPagedResponse<Tag>, 'orderBy'>
    >('tags', params);
    if (response.ok) {
      // Split out content and metadata, so consumer can easily use only what they need.
      const { results, ...meta } = response.data;
      return {
        ok: true,
        data: results,
        meta,
      };
    } else {
      return response;
    }
  }

  /**
   * Retrieve sections based on query parameters.
   * @param {QuerySectionParams} params The parameters of the query. See {@link https://open-platform.theguardian.com/documentation/section} for details.
   */
  async sections(
    params: QuerySectionParams = {},
  ): Promise<ClientSectionsResponse> {
    const response = await this.#apiFetch<ApiResponseMultiple<Section>>(
      'sections',
      params,
    );
    if (response.ok) {
      // Split out content and metadata, so consumer can easily use only what they need.
      const { results, ...meta } = response.data;
      return {
        ok: true,
        data: results,
        meta,
      };
    } else {
      return response;
    }
  }

  /**
   * Retrieve editions based on query parameters.
   * @param {QueryEditionParams} params The parameters of the query. See {@link https://open-platform.theguardian.com/documentation/edition} for details.
   */
  async editions(
    params: QueryEditionParams = {},
  ): Promise<ClientEditionsResponse> {
    const response = await this.#apiFetch<ApiResponseMultiple<Edition>>(
      'editions',
      params,
    );
    if (response.ok) {
      // Split out content and metadata, so consumer can easily use only what they need.
      const { results, ...meta } = response.data;
      return {
        ok: true,
        data: results,
        meta,
      };
    } else {
      return response;
    }
  }
}

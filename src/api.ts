import type { FieldName, SortOrder } from './params.js';

// Deal with the shape of the initial JSON response.
export interface ApiResponse {
  response: ApiResponseSuccessBody | ApiResponseErrorBody;
}

export interface ApiResponseErrorBody {
  status: 'error';
  message: string;
}

export interface ApiResponseSuccessBody {
  /**
   * The status of the response. It refers to the state of the API. Successful
   * calls will receive an "ok" even if your query did not return any results.
   */
  status: 'ok';
  /**
   * The tier associated with the API key used for the request.
   */
  userTier: 'developer' | 'commercial';
  /**
   * 	The number of results available for your search overall.
   */
  total: number;
}

export interface ApiResponseSingle<T> extends ApiResponseSuccessBody {
  /**
   * The single item returned by the API.
   */
  content: T;
}

export interface ApiResponseMultiple<T> extends ApiResponseSuccessBody {
  /**
   * An array of items returned by the API.
   */
  results: Array<T>;
}

export interface ApiPagedResponse<T> extends ApiResponseMultiple<T> {
  startIndex: number;
  /**
   * The number of items returned in this call.
   */
  pageSize: number;
  /**
   * The number of the page you are browsing.
   */
  currentPage: number;
  /**
   * The total amount of pages that are in this call.
   */
  pages: number;
  /**
   * The sort order used.
   */
  orderBy: SortOrder;
}

export interface ApiItem {
  /**
   * The path to content.
   */
  id: string;
  /**
   * The title of the html content.
   */
  webTitle: string;
  /**
   * The URL of the html content.
   */
  webUrl: string;
  /**
   * The URL of the raw content.
   */
  apiUrl: string;
}

export interface Content extends ApiItem {
  /**
   * The type of content.
   */
  type: string;
  /**
   * The id of the section.
   */
  sectionId: string;
  /**
   * The name of the section.
   */
  sectionName: string;
  /**
   * The combined date and time of publication.
   */
  webPublicationDate: Date;
  isHosted: boolean;
  pillarId: string;
  pillarName: string;
  /**
   * The ```fields``` object will only be present if the ```showFields```
   * property was included on the query parameters.
   */
  fields?: Partial<Record<FieldName, string>>;
  /**
   * The ```tags``` array will only be present if the ```showTags```
   * property was included on the query parameters.
   */
  tags?: Array<ContentTag>;
  /**
   * The ```elements``` array will only be present if the ```showElements```
   * property was included on the query parameters.
   */
  elements?: Array<ContentElement>;
  /**
   * The ```references``` array will only be present if the ```showReferences```
   * property was included on the query parameters.
   */
  references?: Array<{
    id: string;
    type: string;
  }>;
  /**
   * Blocks of content retrieved in accordance with the ```showBlocks```
   * property provided on the query parameters. The ```blocks``` object
   * will only be present if the ```showBlocks``` property was defined.
   */
  blocks?: {
    main?: ContentBlock;
    body?: ContentBlock;
    totalBodyBlocks: number;
    requestedBodyBlocks?: {
      [key: string]: Array<ContentBlock>;
    };
  };
  /**
   * The rights associated with the content.
   * The ```rights``` object will only be present if the ```showRights```
   * property was included on the query parameters.
   */
  rights?: { [key: string]: string };
  /**
   * The section the content belongs to.
   * The ```section``` object will only be present if the ```showSection```
   * property was included on the query parameters and set to true.
   */
  section?: Section;
}

export interface ContentElement {
  /**
   * The id of the element.
   */
  id: string;
  /**
   * How the element relates to the content.
   * @example
   * main
   * thumbnail
   * body
   */
  relation: string;
  /**
   * The type of element.
   * @example
   * image
   * embed
   */
  type: string;
  /**
   * The element assets, typically images or links.
   */
  assets: Array<{
    /**
     * The type of asset.
     */
    type: string;
    /**
     * The URL of the file.
     */
    file: string;
    /**
     * The mime type of the file. For some reason, does not appear on all assets.
     */
    mimeType?: string;
    /**
     * File metadata. Totally different depending on the
     * asset type, so the data type is set to unknown.
     */
    typeData: {
      [key: string]: unknown;
    };
  }>;
}
export interface ContentBlock {
  id: string;
  bodyHtml: string;
  bodyTextSummary: string;
  attributes: {
    [key: string]: unknown;
  };
  published: boolean;
  createdDate: Date;
  firstPublishedDate: Date;
  publishedDate: Date;
  lastModifiedDate: Date;
  // No content blocks found with any contributors, so unknown.
  contributors: Array<unknown>;
  // These elements are not the same shape as ContentElement, and
  // can have different properties depending on the element type.
  elements: Array<unknown>;
}

export interface Sponsorship {
  sponsorshipType: string;
  sponsorName: string;
  sponsorLogo: string;
  sponsorLink: string;
  sponsorLogoDimensions: { width: number; height: number };
  paidContentType: string;
}

export interface Tag extends ApiItem {
  type: string;
  sectionId?: string;
  sectionName?: string;
  activeSponsorships?: Array<Sponsorship>;
  paidContentType?: string;
  keywordType?: string;
}

export interface ContentTag extends Tag {
  references: Array<{ id: string; type: string }>;
}

export interface Edition extends ApiItem {
  path: string;
  edition: string;
}

// Edition has path and edition strings, but Section > Editions has neither, but has code.
// Instead of extending or Pick<> or anything like that, just make a separate type for it.
export interface SectionEdition extends ApiItem {
  code: string;
}

export interface Section extends ApiItem {
  editions: Array<SectionEdition>;
}

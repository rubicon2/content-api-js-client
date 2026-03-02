import type { TagName, FieldName, SortOrder } from './params.js';

/**
 * Deal with the shape of the initial JSON response internally.
 */
export interface ApiResponse {
  response: ApiResponseSuccessBody | ApiResponseErrorBody;
}

export interface ApiResponseErrorBody {
  status: 'error';
  message: string;
}

/**
 * This can be used for typing meta objects and response success body.
 */
/**
 * Metadata returned by all API endpoints.
 * Can be used for typing the API response and meta objects returned by the client.
 */
export interface ApiResponseMeta {
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

/**
 * Alias ApiResponseMeta for internal readability.
 */
type ApiResponseSuccessBody = ApiResponseMeta;

/**
 * Shape of response from ```item``` API endpoint.
 */
export interface ApiResponseSingle<T> extends ApiResponseSuccessBody {
  /**
   * The single item returned by the API.
   */
  content: T;
}

/**
 * Shape of response from all API endpoints except ```item```.
 */
export interface ApiResponseMultiple<T> extends ApiResponseSuccessBody {
  /**
   * An array of items returned by the API.
   */
  results: Array<T>;
}

/**
 * Metadata returned by the ```search```, ```next``` and ```tags``` API endpoints.
 * Can be used for typing the API response and meta objects returned by the client.
 */
export interface ApiPagedResponseMeta extends ApiResponseMeta {
  /**
   * The description in the documentation is literally "?".
   * I have tried using it and it seems to do nothing.
   */
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

/**
 * Shape of response from ```search```, ```next``` and ```tags``` API endpoints.
 */
export interface ApiPagedResponse<T>
  extends ApiResponseMultiple<T>, ApiPagedResponseMeta {}

/**
 * Basic properties common to all items returned by the API.
 */
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

/**
 * Properties present on items returned by ```item```, ```search``` and ```next``` API endpoints.
 */
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

/**
 * An element on a content item.
 */
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
  assets: Array<ElementAsset>;
}

/**
 * An asset on a content element.
 */
export interface ElementAsset {
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
}

/**
 * A block on a content item.
 */
export interface ContentBlock {
  /**
   * The id of the content block. Does not pertain to
   * content ids on the API, i.e. you cannot retrieve this
   * block from the API with its id like you would a content
   * item.
   */
  id: string;
  /**
   * The block body including html tags.
   */
  bodyHtml: string;
  /**
   * The text content of the block body, stripped of html tags.
   */
  bodyTextSummary: string;
  /**
   * Title of the block. Does not always appear.
   */
  title?: string;
  attributes: {
    keyEvent?: boolean;
    title?: string;
    pinned?: boolean;
    // In case there are other attributes I have not encountered.
    [key: string]: unknown;
  };
  published: boolean;
  createdDate: Date;
  firstPublishedDate: Date;
  publishedDate: Date;
  lastModifiedDate: Date;
  // No content blocks found with any contributors, so unknown type.
  contributors: Array<unknown>;
  // These elements are not the same shape as ContentElement, and
  // can have different properties depending on the element type.
  elements: Array<{
    type: string;
    assets: Array<unknown>;
    // Can include property of textTypeData, contentAtomTypeData,
    // richLinkTypeData, so use unknown type.
    [key: string]: unknown;
  }>;
}

/**
 * A sponsorship as found on tag items.
 */
export interface Sponsorship {
  sponsorshipType: string;
  sponsorName: string;
  sponsorLogo: string;
  sponsorLink: string;
  sponsorLogoDimensions: { width: number; height: number };
  paidContentType: string;
}

/**
 * Properties present on items returned by the ```tag``` API endpoint.
 */
export interface Tag extends ApiItem {
  /**
   * The type of the tag.
   */
  type: TagName;
  /**
   * The id of the section. Appears on blog, keyword, newspaper-book,
   * newspaper-book-section, series and some publication tags.
   */
  sectionId?: string;
  /**
   * The name of the section. Appears on blog, keyword, newspaper-book,
   * newspaper-book-section, series and some publication tags.
   */
  sectionName?: string;
  /**
   * Appears on paid-content tags.
   */
  activeSponsorships?: Array<Sponsorship>;
  /**
   * Appears on paid-content tags.
   */
  paidContentType?: string;
  /**
   * Appears on keyword tags.
   */
  keywordType?: string;
  /**
   * Appears on contributor tags.
   */
  bio?: string;
  /**
   * Appears on campaign tags.
   */
  campaignInformationType?: string;
}

/**
 * A tag on a content item, which has an extra property.
 */
export interface ContentTag extends Tag {
  references: Array<{ id: string; type: string }>;
}

/**
 * Properties present on items returned by the ```edition``` API endpoint.
 */
export interface Edition extends ApiItem {
  /**
   * The path of the edition.
   */
  path: string;
  /**
   * The edition name.
   */
  edition: string;
}

/**
 * Edition interface has path and edition strings; Section > Editions has neither, but has a code.
 * Instead of extending or Pick<> or anything like that, just make a separate type for it.
 */
export interface SectionEdition extends ApiItem {
  /**
   * The code of the edition.
   */
  code: string;
}

/**
 * Properties present on items returned by the ```section``` API endpoint.
 */
export interface Section extends ApiItem {
  /**
   * The list of existing editions for this section.
   */
  editions: Array<SectionEdition>;
}

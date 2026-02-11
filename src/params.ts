// Types to encapsulate the values accepted by the api for each query parameter.

/**
 * The values accepted by the API for the ```sortOrder``` parameter.
 */
export type SortOrder = 'newest' | 'oldest' | 'relevance';
/**
 * The values accepted by the API for the ```orderDate``` parameter.
 */
export type OrderDate = 'published' | 'newspaper-edition' | 'last-modified';
/**
 * The values accepted by the API for the ```useDate``` parameter.
 */
export type UseDate = OrderDate | 'first-publication';
/**
 * The values accepted by the API for the ```showFields``` parameter.
 * These are sourced from the documentation, although when running a search
 * with ```show-fields=all```, I can see there are many other possible fields.
 * Since there is no exhaustive list, I will leave this as specified in the
 * documentation.
 */
export type ShowField =
  | 'trailText'
  | 'headline'
  | 'showInRelatedContent'
  | 'body'
  | 'lastModified'
  | 'hasStoryPackage'
  | 'score'
  | 'standfirst'
  | 'shortUrl'
  | 'thumbnail'
  | 'wordcount'
  | 'commentable'
  | 'isPremoderated'
  | 'allowUgc'
  | 'byline'
  | 'publication'
  | 'internalPageCode'
  | 'productionOffice'
  | 'shouldHideAdverts'
  | 'liveBloggingNow'
  | 'commentCloseDate'
  | 'starRating'
  | 'all';

/**
 * The values accepted by the API for the ```showTags``` parameter.
 */
export type ShowTag =
  | 'blog'
  | 'contributor'
  | 'keyword'
  | 'newspaper-book'
  | 'newspaper-book-section'
  | 'publication'
  | 'series'
  | 'tone'
  | 'type'
  | 'all';
/**
 * The values accepted by the API for the ```showElements``` parameter.
 */
export type ShowElement = 'audio' | 'image' | 'video' | 'all';
/**
 * The values accepted by the API for the ```showReferences``` parameter.
 */
export type ShowReference =
  | 'author'
  | 'bisac-prefix'
  | 'esa-cricket-match'
  | 'esa-football-match'
  | 'esa-football-team'
  | 'esa-football-tournament'
  | 'isbn'
  | 'imdb'
  | 'musicbrainz'
  | 'musicbrainzgenre'
  | 'opta-cricket-match'
  | 'opta-football-match'
  | 'opta-football-team'
  | 'opta-football-tournament'
  | 'pa-football-competition'
  | 'pa-football-match'
  | 'pa-football-team'
  | 'r1-film'
  | 'reuters-index-ric'
  | 'reuters-stock-ric'
  | 'witness-assignment';
/**
 * The values accepted by the API for the ```showRights``` parameter.
 */
export type ShowRight = 'syndicatable' | 'subscription-databases' | 'all';

// Interfaces to encapsulate the accepted fields by each API endpoint.

/**
 * Query parameters common to the ```item```, ```search``` and ```next``` API endpoints.
 */
export interface ContentParams {
  /**
   * Return only content in those sections. Accepts boolean operators.
   * @example
   * football
   */
  section?: string;
  /**
   * Return only content with those references. Accepts boolean operators.
   * @example
   * isbn/9780718178949
   */
  reference?: string;
  /**
   * Return only content with references of those types. Accepts boolean operators.
   * @example
   * isbn
   */
  referenceType?: string;
  /**
   * Return only content with those tags. Accepts boolean operators.
   */
  tag?: string;
  /**
   * Return only content with those rights.
   * @example
   * syndicatable, subscription-databases
   */
  rights?: string;
  /** Return only content with those IDs. */
  ids?: string;
  /**
   * Return only content from those production offices. Accepts boolean operators.
   * @example
   * aus
   */
  productionOffice?: string;
  /** Return only content in those languages. Takes ISO language codes, and accepts boolean operators.
   * @example
   * en
   * fr
   */
  lang?: string;
  /** Return only content with a given star rating. Accepts numbers from 1 to 5. */
  starRating?: number;
  /**
   * Return only content published on or after that date.
   * @example
   * 2014-02-16
   */
  fromDate?: Date;
  /**
   * Return only content published on or before that date.
   * @example
   * 2014-02-17
   * */
  toDate?: Date;
  /** Changes which type of date is used to filter the results using ```from-date``` and ```to-date```. */
  useDate?: UseDate;
  /** Return only the result set from a particular page. */
  page?: number;
  /** Modify the number of items displayed per page. Accepts numbers from 1 - 50. */
  pageSize?: number;
  /** Returns results in the specified order. Defaults to ```relevance``` when a ```q```is specified. Defaults to ```newest``` in all other cases. */
  orderBy?: SortOrder;
  /** Changes which type of date is used to order the results. Defaults to ```published```. */
  orderDate?: OrderDate;
  /** Add fields associated with the content. An array containing the fields will be added to the ```fields``` property on the returned object. */
  showFields?: string | Array<ShowField>;
  /** Add associated metadata tags. An array containing the tags will be added to the ```tags``` property on the returned object. */
  showTags?: string | Array<ShowTag>;
  /** Add associated metadata section. The section will be added to the ```section``` property on the returned object.  */
  showSection?: boolean;
  /**
   * Add associated blocks (single block for content, one or more for liveblogs).
   * @example
   * main
   * body
   * all
   * body:latest
   * body:latest (limit defaults to 20)
   * body:latest:10
   * body:oldest
   * body:oldest:10
   * body:<block ID> (only the block with that ID)
   * body:around:<block ID> (the specified block and 20 blocks either side of it)
   * body:around:<block ID>:10 (the specified block and 10 blocks either side of it)
   * body:key-events
   * body:published-since:1556529318000 (only blocks since given timestamp)
   */
  showBlocks?: string; // Too complicated to try and make into a type?
  /** Add associated media elements such as images and audio. */
  showElements?: string | Array<ShowElement>;
  /** Add associated reference data such as ISBNs. */
  showReferences?: string | Array<ShowReference>;
  /** Add associated rights. */
  showRights?: string | Array<ShowRight>;
}

/**
 * The accepted query parameters for the ```item``` API endpoint.
 */
export interface QueryItemParams extends ContentParams {
  /**
   * When true, display a list of content that has been identified as being
   * about the same story as the requested content item. When a content
   * item is in a package the hasStoryPackage field has a value of true.
   */
  showStoryPackage?: boolean;
  /**
   * When true, display a list of content that is chosen by editors on tags,
   * sections and the home page. This content list represents the main list
   * of content found on the equivalent path on the site.
   */
  showEditorsPicks?: boolean;
  /**
   * When true, display most viewed content. For overall most viewed, set id
   * to '/', and for section most viewed set id to the section id.
   */
  showMostViewed?: boolean;
}

/**
 * Since the ```q``` parameter is common to many endpoints, and I only
 * want to have to document it once, it is in its own interface.
 */
export interface QueryParam {
  /**
   * Request content containing this free text. Supports AND, OR and
   * NOT operators, and exact phrase queries using double quotes.
   * @example
   * sausages
   * "pork sausages"
   * sausages AND (mash OR chips)
   * sausages AND NOT (saveloy OR battered)
   */
  q?: string;
}

/**
 * The accepted query parameters for the ```search``` and ```next``` API endpoints.
 */
export interface QueryContentParams extends ContentParams, QueryParam {
  queryFields?: string | Array<string>;
}

/**
 * The accepted query parameters for the ```tag``` API endpoint.
 */
export interface QueryTagParams extends QueryParam {
  webTitle?: string;
  type?: string;
  section?: string;
  reference?: string;
  referenceType?: string;
  page?: number;
  pageSize?: number;
  showReferences?: Array<ShowReference>;
}

/**
 * The accepted query parameters for the ```section``` API endpoint.
 */
export type QuerySectionParams = QueryParam;

/**
 * The accepted query parameters for the ```edition``` API endpoint.
 */
export type QueryEditionParams = QueryParam;

/**
 * Converts query string from camel case (myString) to kebab case (my-string).
 */
function camelCaseToKebabCase(str: string): string {
  return str.replaceAll(/[A-Z]/g, (s) => '-' + s.toLowerCase());
}

/**
 * Turn object properties and their values into a url query string that will be accepted by the API.
 */
export function paramsToStr(obj: object = {}): string {
  const str = Object.entries(obj)
    .map(([key, value]) => {
      const kebabKey = camelCaseToKebabCase(key);
      let sanitizedValue = value;
      if (Array.isArray(value)) sanitizedValue = value.join(',');

      if (
        kebabKey === 'format' &&
        (sanitizedValue as string).toLowerCase() !== 'json'
      ) {
        throw new Error(
          `Fetch request failed: client only supports json format response`,
        );
      }

      if (kebabKey.toLowerCase() === 'callback') {
        throw new Error(
          `Fetch request failed: client does not support callback parameter`,
        );
      }

      return `${kebabKey}=${sanitizedValue}`;
    })
    .join('&');
  return str;
}

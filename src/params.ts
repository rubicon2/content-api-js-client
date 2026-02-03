// Types to encapsulate the values accepted by the api for each query parameter.
export type SortOrder = 'newest' | 'oldest' | 'relevance';
export type OrderDate = 'published' | 'newspaper-edition' | 'last-modified';
export type UseDate = OrderDate | 'first-publication';
export type ShowField =
  | 'trailText'
  | 'headline'
  | 'showInRelatedContent'
  | 'body'
  | 'lastModified'
  | 'hasStoryPackage'
  | 'score'
  | 'standFirst'
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
export type ShowElement = 'audio' | 'image' | 'video' | 'all';
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
export type ShowRight = 'syndicatable' | 'subscription-databases' | 'all';

// Interfaces to encapsulate the accepted fields by each api endpoint.

// Applicable to item and search endpoints.
export interface ContentParams {
  section?: string;
  reference?: string;
  referenceType?: string;
  tag?: string;
  rights?: string;
  ids?: string;
  productionOffice?: string;
  lang?: string;
  starRating?: number;
  fromDate?: Date;
  toDate?: Date;
  useDate?: UseDate;
  page?: number;
  pageSize?: number;
  orderBy?: SortOrder;
  orderDate?: OrderDate;
  showFields?: string | Array<ShowField>;
  showTags?: string | Array<ShowTag>;
  showSection?: boolean;
  showBlocks?: string; // Too complicated to try and make into a type?
  showElements?: string | Array<ShowElement>;
  showReferences?: string | Array<ShowReference>;
  showRights?: string | Array<ShowRight>;
}

export interface QueryContentParams extends ContentParams {
  q?: string;
  queryFields?: string | Array<string>;
}

export interface QueryTagParams {
  q?: string;
  webTitle?: string;
  type?: string;
  section?: string;
  reference?: string;
  referenceType?: string;
  page?: number;
  pageSize?: number;
  showReferences?: Array<ShowReference>;
}

export interface QuerySectionParams {
  q?: string;
}

export interface QueryEditionParams {
  q?: string;
}

function camelCaseToKebabCase(str: string): string {
  return str.replaceAll(/[A-Z]/g, (s) => '-' + s.toLowerCase());
}

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

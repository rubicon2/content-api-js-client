// Types to encapsulate the values accepted by the api for each query parameter.
type Format = 'json' | 'xml';
type SortOrder = 'newest' | 'oldest' | 'relevance';
type OrderDate = 'published' | 'newspaper-edition' | 'last-modified';
type UseDate = OrderDate | 'first-publication';
type ShowField =
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
type ShowTag =
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
type ShowElement = 'audio' | 'image' | 'video' | 'all';
type ShowReference =
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
type ShowRight = 'syndicatable' | 'subscription-databases' | 'all';

// Interfaces to encapsulate the accepted fields by each api endpoint.
interface ApiParams {
  format?: Format;
  callback?: string;
}

// Applicable to item and search endpoints.
interface ContentParams extends ApiParams {
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
  showFields?: Array<ShowField>;
  showTags?: Array<ShowTag>;
  showSection?: boolean;
  showBlocks?: string; // Too complicated to try and make into a type?
  showElements?: Array<ShowElement>;
  showReferences?: Array<ShowReference>;
  showRights?: Array<ShowRight>;
}

interface QueryContentParams extends ContentParams {
  q?: string;
  queryFields?: Array<string>;
}

interface QueryTagParams extends ApiParams {
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

interface QuerySectionParams extends ApiParams {
  q?: string;
}

interface QueryEditionParams extends ApiParams {
  q?: string;
}

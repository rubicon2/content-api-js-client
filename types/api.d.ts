// Deal with the shape of the initial JSON response.
interface ApiResponse {
  response: ApiResponseSuccessBody | ApiResponseErrorBody;
}

interface ApiResponseErrorBody {
  status: 'error';
  message: string;
}

interface ApiResponseSuccessBody {
  status: 'ok';
  userTier: 'developer' | 'commercial';
  total: number;
}

interface ApiResponseSingle extends ApiResponseSuccessBody {
  content: Content;
}

interface ApiResponseMultiple extends ApiResponseSuccessBody {
  results: Array;
}

interface ApiResponsePage {
  startIndex: number;
  pageSize: number;
  currentPage: number;
  pages: number;
}

interface ApiItem {
  id: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
}

interface Content extends ApiItem {
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: Date;
  isHosted: boolean;
  pillarId: string;
  pillarName: string;
  fields?: object;
}

interface Tag extends ApiItem {
  type: string;
  sectionId: string;
  sectionName: string;
}

interface Edition extends ApiItem {
  path: string;
  edition: string;
}

// Edition has path and edition strings, but on Section > Editions has neither, but has code.
// Instead of extending or Pick<> or anything like that, just make a separate type for it.
interface SectionEdition extends ApiItem {
  code: string;
}

interface Section extends ApiItem {
  editions: Array<SectionEdition>;
}

interface ApiSearchResponse extends ApiResponseMultiple, ApiResponsePage {
  orderBy: SortOrder;
  results: Array<Content>;
}

interface ApiTagsResponse extends ApiResponseMultiple, ApiResponsePage {
  results: Array<Tag>;
}

interface ApiSectionsResponse extends ApiResponseMultiple {
  results: Array<Section>;
}

interface ApiEditionsResponse extends ApiResponseMultiple {
  results: Array<Edition>;
}

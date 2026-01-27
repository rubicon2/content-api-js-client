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
  content: ApiItem;
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
}

interface Tag extends ApiItem {
  type: string;
  sectionId: string;
  sectionName: string;
}

interface Edition extends ApiItem {
  path: string;
  edition: string;
  code?: string;
}

interface Section extends ApiItem {
  editions: Array<Required<Edition>>;
}

interface ApiContentResponse extends ApiResponseMultiple {
  orderBy: SortOrder;
  results: Array<Content>;
}

interface ApiTagsResponse extends ApiResponseMultiple {
  results: Array<Tag>;
}

interface ApiSectionsResponse extends ApiResponseMultiple {
  results: Array<Section>;
}

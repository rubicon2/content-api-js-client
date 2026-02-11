import type { SortOrder } from './params.js';

// Deal with the shape of the initial JSON response.
export interface ApiResponse {
  response: ApiResponseSuccessBody | ApiResponseErrorBody;
}

export interface ApiResponseErrorBody {
  status: 'error';
  message: string;
}

export interface ApiResponseSuccessBody {
  status: 'ok';
  userTier: 'developer' | 'commercial';
  total: number;
}

export interface ApiResponseSingle<T> extends ApiResponseSuccessBody {
  content: T;
}

export interface ApiResponseMultiple<T> extends ApiResponseSuccessBody {
  results: Array<T>;
}

export interface ApiPagedResponse<T> extends ApiResponseMultiple<T> {
  startIndex: number;
  pageSize: number;
  currentPage: number;
  pages: number;
  orderBy: SortOrder;
}

export interface ApiItem {
  id: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
}

export interface Content extends ApiItem {
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: Date;
  isHosted: boolean;
  pillarId: string;
  pillarName: string;
  fields?: object;
  tags?: Array<Tag>;
  blocks?: object;
  section?: object;
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

interface ApiResponse {
  response: ApiResponseSuccessBody | ApiResponseErrorBody;
}

interface ApiResponseSuccessBody {
  status: 'ok';
  userTier: 'developer' | 'commercial';
  total: number;
}

interface ApiItemResponse extends ApiResponseSuccessBody {
  content: object;
}

interface ApiResponseErrorBody {
  status: 'error';
  message: string;
}

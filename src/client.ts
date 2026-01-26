class Client {
  #apiKey: string;
  #baseUrl: string = 'https://content.guardianapis.com';

  constructor(apiKey: string) {
    this.#apiKey = apiKey;
  }

  async item(id: string): Promise<object> {
    const response: Response = await fetch(
      `${this.#baseUrl}/${id}?api-key=${this.#apiKey}`,
    );

    if (response.ok) {
      const apiResponse: ApiResponse = (await response?.json()) as ApiResponse;
      const data = apiResponse.response as ApiItemResponse;
      return data.content;
    } else {
      throw new Error('Fetch request failed: ' + response.status);
    }
  }
}

export default Client;

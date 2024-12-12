import { BEARER_TOKEN } from "./config";

class Fetcher {
  constructor(private bearerToken: string) {}

  async getData<R>(url: string, payload?: any): Promise<R> {
    console.log("getting data from: ", url);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
        "Content-Type": "application/json; charset=utf-8",
      },
      method: payload ? "POST" : "GET",
      body: payload ? JSON.stringify(payload) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

const fetcher = new Fetcher(BEARER_TOKEN);

export { fetcher };

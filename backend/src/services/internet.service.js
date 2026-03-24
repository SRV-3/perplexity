import "dotenv/config";
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export const searchInternet = async (query) => {
  return await tavily.search(query, {
    maxResults: 5,
    searchDepth: "advanced",
  });
};

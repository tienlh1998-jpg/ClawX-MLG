import { tool } from "@langchain/core/tools";
import { z } from "zod";
import axios from "axios";
import * as cheerio from "cheerio";

export const webScraper = tool(
  async ({ url }) => {
    try {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      const $ = cheerio.load(data);
      
      // Remove script and style elements
      $('script, style').remove();
      
      const text = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 5000);
      return `Content from ${url}:\n\n${text}`;
    } catch (error: any) {
      return `Error scraping ${url}: ${error.message}`;
    }
  },
  {
    name: "web_scraper",
    description: "Scrapes text content from a given URL.",
    schema: z.object({
      url: z.string().url().describe("The URL to scrape content from"),
    }),
  }
);

export const calculator = tool(
  async ({ expression }) => {
    try {
      // Basic evaluation - in a real app, use a math library
      const result = eval(expression.replace(/[^-()\d/*+.]/g, ''));
      return `Result of ${expression} is ${result}`;
    } catch (error: any) {
      return `Error calculating ${expression}: ${error.message}`;
    }
  },
  {
    name: "calculator",
    description: "Performs basic mathematical calculations.",
    schema: z.object({
      expression: z.string().describe("The mathematical expression to evaluate (e.g., '2 + 2 * 4')"),
    }),
  }
);

export const tools = [webScraper, calculator];

import { NextRequest } from "next/server";
import * as cheerio from "cheerio";

function getSourceSite(url: string): string {
  const hostname = new URL(url).hostname.toLowerCase();
  if (hostname.includes("amazon")) return "amazon";
  if (hostname.includes("flipkart")) return "flipkart";
  if (hostname.includes("myntra")) return "myntra";
  if (hostname.includes("nykaa")) return "nykaa";
  if (hostname.includes("meesho")) return "meesho";
  if (hostname.includes("ajio")) return "ajio";
  if (hostname.includes("croma")) return "croma";
  if (hostname.includes("apple")) return "apple";
  return "other";
}

function extractPrice(text: string): string | null {
  if (!text) return null;
  // Match ₹ or $ followed by digits with optional commas/decimals
  const match = text.match(/[$₹]\s*[\d,]+(?:\.\d{1,2})?/);
  return match ? match[0].trim() : null;
}

async function scrapeProduct(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // Extract title from multiple sources
  let title =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text().trim() ||
    $("h1").first().text().trim() ||
    "";

  // Extract description
  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    "";

  // Extract image
  let imageUrl =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[property="og:image:secure_url"]').attr("content") ||
    "";

  // Extract price from JSON-LD structured data
  let price = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html() || "");
      if (json["@type"] === "Product" && json.offers) {
        const offers = Array.isArray(json.offers)
          ? json.offers[0]
          : json.offers;
        if (offers.price) {
          price = `${offers.priceCurrency || "₹"} ${offers.price}`;
        }
      }
    } catch {
      // ignore parse errors
    }
  });

  // Fallback: try common price selectors
  if (!price) {
    const priceSelectors = [
      ".a-price .a-offscreen",
      "[data-testid='price']",
      ".priceToPay .a-offscreen",
      ".price-section .price",
      'span[class*="price"]',
    ];
    for (const selector of priceSelectors) {
      const el = $(selector).first();
      if (el.length) {
        const text = el.text().trim();
        const extracted = extractPrice(text);
        if (extracted) {
          price = extracted;
          break;
        }
      }
    }
  }

  // Clean up title (remove site name suffixes)
  title = title
    .replace(/\s*[-|]\s*(Amazon|Flipkart|Myntra|Nykaa|Meesho|Ajio|Croma|Apple).*$/i, "")
    .trim();

  // Make imageUrl absolute
  if (imageUrl && !imageUrl.startsWith("http")) {
    imageUrl = new URL(imageUrl, url).toString();
  }

  return {
    title: title || "Untitled Product",
    description: description.slice(0, 500),
    price: price || null,
    imageUrl: imageUrl || null,
    sourceSite: getSourceSite(url),
  };
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return Response.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const data = await scrapeProduct(url);
    return Response.json(data);
  } catch (error) {
    console.error("Scrape error:", error);
    return Response.json(
      { error: "Failed to fetch product details. Please try again." },
      { status: 500 }
    );
  }
}

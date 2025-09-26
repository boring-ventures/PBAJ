/**
 * Auto-translation service
 * Supports both Google Translate API and LibreTranslate
 */

import type { Locale } from "../i18n/config";

export interface TranslationOptions {
  sourceLang?: Locale;
  targetLocale: Locale;
  preserveFormatting?: boolean;
}

export interface TranslationService {
  translateText(text: string, options: TranslationOptions): Promise<string>;
  isTextTranslatable(text: string): boolean;
}

class TranslationAPI implements TranslationService {
  private apiKey?: string;
  private baseUrl?: string;

  constructor(
    private provider: "google" | "libretranslate" = "libretranslate",
    options?: {
      googleApiKey?: string;
      libreTranslateUrl?: string;
    }
  ) {
    this.apiKey = options?.googleApiKey;
    this.baseUrl = options?.libreTranslateUrl;
  }

  async translateText(
    text: string,
    options: TranslationOptions
  ): Promise<string> {
    if (!this.isTextTranslatable(text)) {
      return text;
    }

    const { sourceLang = "es", targetLocale } = options;

    if (sourceLang === targetLocale) {
      return text;
    }

    // For very long text, split into chunks and translate separately
    if (text.length > 2000) {
      return await this.translateLongText(text, sourceLang, targetLocale);
    }

    try {
      if (this.provider === "google" && this.apiKey) {
        return await this.translateWithGoogle(text, sourceLang, targetLocale);
      } else if (this.provider === "libretranslate" && this.baseUrl) {
        return await this.translateWithLibre(text, sourceLang, targetLocale);
      } else {
        console.warn("No translation provider configured properly");
        return text;
      }
    } catch (error) {
      console.error("Translation error:", error);
      // Return original text if translation fails
      return text;
    }
  }

  private async translateLongText(
    text: string,
    sourceLang: string,
    targetLocale: string
  ): Promise<string> {
    // Split text into paragraphs or sentences for better translation
    const chunks = this.splitTextIntoChunks(text);
    const translatedChunks: string[] = [];

    for (const chunk of chunks) {
      try {
        const translatedChunk = await this.translateText(chunk, {
          sourceLang: sourceLang as Locale,
          targetLocale: targetLocale as Locale,
        });
        translatedChunks.push(translatedChunk);
      } catch (error) {
        console.error("Error translating chunk:", error);
        translatedChunks.push(chunk); // Keep original if translation fails
      }
    }

    return translatedChunks.join("\n\n");
  }

  private splitTextIntoChunks(text: string): string[] {
    // Handle HTML content by splitting by paragraph tags
    if (text.includes("<p>") && text.includes("</p>")) {
      const htmlChunks = this.splitHtmlContent(text);
      if (htmlChunks.length > 0) {
        return htmlChunks;
      }
    }

    // Split by double newlines (paragraphs) first
    const paragraphs = text.split("\n\n");

    // If paragraphs are still too long, split by sentences
    const chunks: string[] = [];

    for (const paragraph of paragraphs) {
      if (paragraph.length <= 1000) {
        chunks.push(paragraph);
      } else {
        // Split by sentences
        const sentences = paragraph.split(/[.!?]+/).filter((s) => s.trim());
        let currentChunk = "";

        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length > 1000) {
            if (currentChunk.trim()) {
              chunks.push(currentChunk.trim());
            }
            currentChunk = sentence;
          } else {
            currentChunk += sentence + ".";
          }
        }

        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
      }
    }

    return chunks.filter((chunk) => chunk.trim());
  }

  private splitHtmlContent(html: string): string[] {
    // Split HTML content by paragraph tags
    const paragraphs = html.split(/(<\/p>\s*<p[^>]*>)/);
    const chunks: string[] = [];
    let currentChunk = "";

    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];

      // If this is a paragraph tag, add it to current chunk
      if (paragraph.match(/^<\/p>\s*<p[^>]*>$/)) {
        currentChunk += paragraph;
      } else if (paragraph.trim()) {
        // If current chunk + this paragraph would be too long, save current chunk
        if (
          currentChunk.length + paragraph.length > 1000 &&
          currentChunk.trim()
        ) {
          chunks.push(currentChunk.trim());
          currentChunk = paragraph;
        } else {
          currentChunk += paragraph;
        }
      }
    }

    // Add the last chunk if it has content
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks.filter((chunk) => chunk.trim());
  }

  private async translateWithGoogle(
    text: string,
    sourceLang: string,
    targetLocale: string
  ): Promise<string> {
    try {
      // Use Google Translate API directly
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: targetLocale,
            format: "html",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Google Translate error:", error);
      return text;
    }
  }

  private async translateWithLibre(
    text: string,
    sourceLang: string,
    targetLocale: string
  ): Promise<string> {
    console.log(
      `Attempting to translate: "${text.substring(0, 50)}..." from ${sourceLang} to ${targetLocale}`
    );

    try {
      // For long content, use chunked translation to avoid truncation
      if (text.length > 1000) {
        return await this.translateLongText(text, sourceLang, targetLocale);
      }

      // Try multiple translation services in order
      const services = [
        () => this.tryDeepLAPI(text, sourceLang, targetLocale),
        () => this.tryGoogleTranslateAPI(text, sourceLang, targetLocale),
        () => this.tryMyMemoryAPI(text, sourceLang, targetLocale),
        () => this.tryFreeTranslateAPI(text, sourceLang, targetLocale),
      ];

      for (const service of services) {
        try {
          const result = await service();
          if (result && result !== text && result.length > 0) {
            return result;
          }
        } catch (error) {
          console.log("Translation service failed, trying next...");
          continue;
        }
      }

      throw new Error("All translation services failed");
    } catch (error) {
      console.error("External translation failed:", error);
      console.warn("Using mock translation as fallback");
      return this.createMockTranslation(text, targetLocale);
    }
  }

  private async tryDeepLAPI(
    text: string,
    sourceLang: string,
    targetLocale: string
  ): Promise<string> {
    try {
      // DeepL API (more reliable but requires API key)
      const apiKey = process.env.DEEPL_API_KEY;
      if (!apiKey) {
        throw new Error("DeepL API key not configured");
      }

      const response = await fetch("https://api-free.deepl.com/v2/translate", {
        method: "POST",
        headers: {
          Authorization: `DeepL-Auth-Key ${apiKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          text: text,
          source_lang: sourceLang.toUpperCase(),
          target_lang: targetLocale.toUpperCase(),
          preserve_formatting: "1",
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`DeepL API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("DeepL response:", data);

      if (
        data.translations &&
        data.translations[0] &&
        data.translations[0].text
      ) {
        const translatedText = data.translations[0].text;
        console.log(
          `DeepL translation successful: "${text.substring(0, 50)}..." -> "${translatedText.substring(0, 50)}..."`
        );
        return translatedText;
      }

      throw new Error("DeepL returned invalid response");
    } catch (error) {
      console.error("DeepL API failed:", error);
      throw error;
    }
  }

  private async tryMyMemoryAPI(
    text: string,
    sourceLang: string,
    targetLocale: string
  ): Promise<string> {
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLocale}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(8000), // 8 second timeout
        }
      );

      if (!response.ok) {
        throw new Error(`MyMemory API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("MyMemory response:", data);

      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        const translatedText = data.responseData.translatedText;
        // Basic quality check - if translation is too similar to original or clearly bad
        if (
          translatedText &&
          translatedText !== text &&
          translatedText.length > 0
        ) {
          console.log(
            `MyMemory translation successful: "${text}" -> "${translatedText}"`
          );
          return translatedText;
        }
      }

      throw new Error("MyMemory returned invalid or poor quality response");
    } catch (error) {
      console.error("MyMemory API failed:", error);
      throw error;
    }
  }

  private async tryGoogleTranslateAPI(
    text: string,
    sourceLang: string,
    targetLocale: string
  ): Promise<string> {
    try {
      // Use Google Translate Web API (unofficial but often works)
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLocale}&dt=t&q=${encodeURIComponent(text)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        signal: AbortSignal.timeout(10000), // Increased timeout
      });

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Google Translate response:", data);

      if (data && data[0]) {
        // Handle multiple translation segments
        let translatedText = "";
        for (const segment of data[0]) {
          if (segment && segment[0]) {
            translatedText += segment[0];
          }
        }

        if (
          translatedText &&
          translatedText !== text &&
          translatedText.length > 0
        ) {
          console.log(
            `Google Translate successful: "${text.substring(0, 50)}..." -> "${translatedText.substring(0, 50)}..."`
          );
          return translatedText;
        }
      }

      throw new Error("Google Translate returned invalid response");
    } catch (error) {
      console.error("Google Translate API failed:", error);
      throw error;
    }
  }

  private async tryFreeTranslateAPI(
    text: string,
    sourceLang: string,
    targetLocale: string
  ): Promise<string> {
    // Alternative free translation service
    const response = await fetch(
      "https://translate.argosopentech.com/translate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLocale,
          format: "text",
        }),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      }
    );

    if (!response.ok) {
      throw new Error(`Argos API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.translatedText) {
      return data.translatedText;
    }

    throw new Error("Argos returned invalid response");
  }

  private createMockTranslation(text: string, targetLocale: string): string {
    if (targetLocale === "en") {
      // This is a simple fallback - in production, you should use a proper translation service
      console.log(
        "FALLBACK: Using simple mock translation. Consider configuring a proper translation API."
      );

      // If the text is already in English or mixed, return as-is
      if (/^[a-zA-Z\s.,;:!?'"()\-\[\]0-9<>/]+$/.test(text)) {
        return text;
      }

      // For HTML content, provide a better mock translation
      if (text.includes("<p>") && text.includes("</p>")) {
        return text.replace(/<p[^>]*>([^<]+)<\/p>/g, (match, content) => {
          const cleanContent = content.trim();
          if (cleanContent) {
            return `<p>[EN] ${cleanContent}</p>`;
          }
          return match;
        });
      }

      // For non-English text, return it with a marker indicating translation is needed
      if (text.includes("<") && text.includes(">")) {
        // Preserve HTML structure
        return text.replace(/([^<>]+)/g, (match) => {
          if (match.trim() && !match.includes("<")) {
            return ` [EN] ${match.trim()} `;
          }
          return match;
        });
      }

      // For long text, split into paragraphs and translate each
      if (text.length > 500) {
        const paragraphs = text.split("\n\n");
        return paragraphs
          .map((paragraph) =>
            paragraph.trim() ? `[EN] ${paragraph.trim()}` : paragraph
          )
          .join("\n\n");
      }

      return `[EN] ${text}`;
    }

    return text;
  }

  isTextTranslatable(text: string): boolean {
    if (!text || typeof text !== "string") return false;

    // Skip translation for URLs, emails, tags, etc.
    const skipPatterns = [
      /^https?:\/\//, // URLs
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Emails
      /^<[^>]+>$/, // HTML tags
      /^\d+$/, // Pure numbers
    ];

    return !skipPatterns.some((pattern) => pattern.test(text.trim()));
  }
}

// Create translation service instances
export const createTranslationService = (
  provider: "google" | "libretranslate" = "libretranslate"
) => {
  const options = {
    // Google API Key - add to .env file
    googleApiKey: process.env.GOOGLE_TRANSLATE_API_KEY,
    // LibreTranslate instance - you can use public service or host your own
    libreTranslateUrl:
      process.env.LIBRETRANSLATE_URL || "https://libretranslate.org",
  };

  return new TranslationAPI(provider, options);
};

// Utility functions for easy translation
export const translateContent = async (
  content: string,
  targetLocale: Locale,
  provider: "google" | "libretranslate" = "libretranslate"
): Promise<string> => {
  const service = createTranslationService(provider);
  return await service.translateText(content, { targetLocale });
};

export const translateObjectFields = async <T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[],
  targetLocale: Locale,
  provider: "google" | "libretranslate" = "libretranslate"
): Promise<T> => {
  const service = createTranslationService(provider);
  const result = { ...obj };

  for (const field of fields) {
    if (obj[field] && typeof obj[field] === "string") {
      try {
        result[field] = (await service.translateText(obj[field] as string, {
          targetLocale,
        })) as T[typeof field];
      } catch (error) {
        console.error(`Translation failed for field ${String(field)}:`, error);
        result[field] = obj[field]; // Fallback to original
      }
    }
  }

  return result;
};

// Main translateText function for use by the content-translation helpers
export const translateText = async (
  text: string,
  options: { targetLocale: Locale; sourceLocale?: Locale }
): Promise<string> => {
  const service = createTranslationService();
  return service.translateText(text, { ...options });
};

// Hook for React components
export const useTranslation = () => {
  const translate = async (
    text: string,
    targetLocale: Locale
  ): Promise<string> => {
    return translateContent(text, targetLocale);
  };

  const translateObject = async <T extends Record<string, any>>(
    obj: T,
    fields: (keyof T)[],
    targetLocale: Locale
  ): Promise<T> => {
    return translateObjectFields(obj, fields, targetLocale);
  };

  return { translate, translateObject };
};

// ─── Translator ──────────────────────────────────────────────────────────────
// Sources:
//   • Free Dictionary API  https://api.dictionaryapi.dev/api/v2/entries/en/{word}
//     — part of speech, English definition, example sentence (no key needed)
//   • MyMemory API  https://api.mymemory.translated.net/get?q={text}&langpair=en|ru
//     — Russian translation (free, no key, 5 000 chars/day per IP)
//
// Caching: results are stored in localStorage under CACHE_KEY so that the same
// word is never fetched twice.
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_KEY = 'wordflow_translation_cache';
const DICT_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const MYMEMORY_BASE = 'https://api.mymemory.translated.net/get';

// ── Types ────────────────────────────────────────────────────────────────────

export interface TranslationResult {
  translation: string;   // Russian translation (main)
  meaning: string;       // English definition
  partOfSpeech: string;  // noun / verb / adjective …
  example: string;       // example sentence (English)
}

interface CacheEntry {
  result: TranslationResult;
  cachedAt: number;
}

type Cache = Record<string, CacheEntry>;

// ── Cache helpers ─────────────────────────────────────────────────────────────

function loadCache(): Cache {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Cache) : {};
  } catch {
    return {};
  }
}

function saveCache(cache: Cache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // quota exceeded — ignore
  }
}

// ── Free Dictionary API ───────────────────────────────────────────────────────

interface DictDefinition {
  definition: string;
  example?: string;
}

interface DictMeaning {
  partOfSpeech: string;
  definitions: DictDefinition[];
}

interface DictEntry {
  word: string;
  meanings: DictMeaning[];
}

async function fetchDictionary(word: string): Promise<{ meaning: string; partOfSpeech: string; example: string } | null> {
  try {
    const res = await fetch(`${DICT_BASE}${encodeURIComponent(word.toLowerCase())}`);
    if (!res.ok) return null;

    const data: DictEntry[] = await res.json();
    const entry = data[0];
    if (!entry?.meanings?.length) return null;

    // Pick the first meaning that has a non-empty definition
    for (const m of entry.meanings) {
      const def = m.definitions.find((d) => d.definition?.trim());
      if (def) {
        return {
          partOfSpeech: m.partOfSpeech || '',
          meaning: def.definition.trim(),
          example: def.example?.trim() || '',
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}

// ── MyMemory translation API ──────────────────────────────────────────────────

async function fetchTranslation(text: string): Promise<string> {
  try {
    const url = `${MYMEMORY_BASE}?q=${encodeURIComponent(text)}&langpair=en|ru`;
    const res = await fetch(url);
    if (!res.ok) return '';

    const data = await res.json() as {
      responseData?: { translatedText?: string };
      matches?: Array<{ translation?: string; quality?: string | number }>;
    };

    const main = data.responseData?.translatedText?.trim();
    if (main && main.toUpperCase() !== text.toUpperCase()) return main;
    return '';
  } catch {
    return '';
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function translateWord(text: string): Promise<TranslationResult> {
  const key = text.trim().toLowerCase();

  // 1. Cache hit
  const cache = loadCache();
  if (cache[key]) return cache[key].result;

  // 2. Fetch in parallel
  const [dictData, ruTranslation] = await Promise.all([
    fetchDictionary(key),
    fetchTranslation(text.trim()),
  ]);

  const result: TranslationResult = {
    translation: ruTranslation || `[${text}]`,
    meaning: dictData?.meaning || '',
    partOfSpeech: dictData?.partOfSpeech || '',
    example: dictData?.example || '',
  };

  // 3. Save to cache
  cache[key] = { result, cachedAt: Date.now() };
  saveCache(cache);

  return result;
}

// ── Cache management (exported for settings UI if needed) ─────────────────────

export function clearTranslationCache(): void {
  localStorage.removeItem(CACHE_KEY);
}

export function getTranslationCacheSize(): number {
  return Object.keys(loadCache()).length;
}

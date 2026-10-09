import { Article, EPaperEdition } from '../types';
import {
  INITIAL_ARTICLES,
  SAMPLE_EPAPER_PDF_BASE64,
  SAMPLE_BUSINESS_PDF_BASE64,
  SAMPLE_POLICY_BRIEF_PDF_BASE64
} from '../data/newsData';

const DB_NAME = 'TheHindCanadianTimesDB';
const DB_VERSION = 2;
const ARTICLES_STORE = 'articles_store';
const VAULT_STORE = 'articles_vault';
const EPAPER_STORE = 'epaper_store';
const KEY_NAME = 'all_articles';
const EPAPER_KEY = 'all_epaper_editions';

export const PRIMARY_STORAGE_KEY = 'hct_magazine_articles_v2';
export const LEGACY_STORAGE_KEYS = [
  'hct_magazine_articles_v2',
  'hct_magazine_articles_v1',
  'hct_magazine_articles',
  'hct_articles',
  'thehindcanadiantimes_articles',
  'blogger_imported_articles',
  'articles',
  'imported_articles',
];

// Open IndexedDB database with multi-store schema
function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(ARTICLES_STORE)) {
          db.createObjectStore(ARTICLES_STORE);
        }
        if (!db.objectStoreNames.contains(VAULT_STORE)) {
          db.createObjectStore(VAULT_STORE);
        }
        if (!db.objectStoreNames.contains(EPAPER_STORE)) {
          db.createObjectStore(EPAPER_STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

// Save articles to IndexedDB (bypasses localStorage 5MB limit!)
export async function saveArticlesToIndexedDB(articles: Article[]): Promise<boolean> {
  try {
    const db = await openDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction([ARTICLES_STORE, VAULT_STORE], 'readwrite');
        const store = tx.objectStore(ARTICLES_STORE);
        store.put(articles, KEY_NAME);

        // Also save to immutable vault if articles contain imported data
        if (articles.length > INITIAL_ARTICLES.length || articles.some((a) => a.id.startsWith('art-blogger-') || a.id.startsWith('art-zip-') || a.id.startsWith('art-file-'))) {
          const vault = tx.objectStore(VAULT_STORE);
          vault.put(articles, 'latest_vault_backup');
          vault.put(articles, `vault_${new Date().toISOString().slice(0, 10)}`);
        }

        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  } catch {
    return false;
  }
}

// Load articles from IndexedDB
export async function loadArticlesFromIndexedDB(): Promise<Article[] | null> {
  try {
    const db = await openDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(ARTICLES_STORE, 'readonly');
        const store = tx.objectStore(ARTICLES_STORE);
        const req = store.get(KEY_NAME);
        req.onsuccess = () => {
          if (Array.isArray(req.result) && req.result.length > 0) {
            const sanitized = req.result.map((art: Article) => {
              if (art.pdfUrl && (art.pdfUrl.includes('dummy.pdf') || art.pdfUrl.includes('w3.org'))) {
                return { ...art, pdfUrl: SAMPLE_POLICY_BRIEF_PDF_BASE64 };
              }
              return art;
            });
            resolve(sanitized);
          } else {
            // Check vault fallback
            try {
              const vaultTx = db.transaction(VAULT_STORE, 'readonly');
              const vaultStore = vaultTx.objectStore(VAULT_STORE);
              const vaultReq = vaultStore.get('latest_vault_backup');
              vaultReq.onsuccess = () => {
                if (Array.isArray(vaultReq.result) && vaultReq.result.length > 0) {
                  resolve(vaultReq.result);
                } else {
                  resolve(null);
                }
              };
              vaultReq.onerror = () => resolve(null);
            } catch {
              resolve(null);
            }
          }
        };
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  } catch {
    return null;
  }
}

// Recover articles from vault if available
export async function recoverFromIndexedDBVault(): Promise<Article[] | null> {
  try {
    const db = await openDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(VAULT_STORE, 'readonly');
        const store = tx.objectStore(VAULT_STORE);
        const req = store.get('latest_vault_backup');
        req.onsuccess = () => {
          if (Array.isArray(req.result) && req.result.length > 0) {
            resolve(req.result);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  } catch {
    return null;
  }
}

// Scan all localStorage keys for any saved articles
export function scanLocalStorageForArticles(): Article[] | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;

  let bestMatch: Article[] | null = null;

  // 1. Try known keys
  for (const key of LEGACY_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.title) {
          if (!bestMatch || parsed.length > bestMatch.length) {
            bestMatch = parsed;
          }
        }
      }
    } catch {
      // Continue
    }
  }

  // 2. Scan all localStorage keys
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('article') || key.includes('post') || key.includes('news') || key.includes('hct') || key.includes('blog'))) {
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.title) {
              if (!bestMatch || parsed.length > bestMatch.length) {
                bestMatch = parsed;
              }
            }
          }
        } catch {
          // ignore
        }
      }
    }
  } catch {
    // ignore
  }

  return bestMatch;
}

// Save articles safely to both IndexedDB and localStorage (with overwrite guard!)
export async function persistArticles(articles: Article[]): Promise<void> {
  // Overwrite guard: Do not overwrite a rich database with the 7 initial articles
  const isDefaultSet = articles.length === INITIAL_ARTICLES.length &&
    articles.every((a, idx) => a.id === INITIAL_ARTICLES[idx]?.id);

  if (isDefaultSet) {
    // Check if IndexedDB already has existing data
    const existing = await loadArticlesFromIndexedDB();
    if (existing && existing.length > INITIAL_ARTICLES.length) {
      // Preserve existing user data! Do not overwrite with default placeholder!
      return;
    }
  }

  // Save to IndexedDB (multi-gigabyte storage, no quota error)
  await saveArticlesToIndexedDB(articles);

  // Try saving to localStorage as well
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(PRIMARY_STORAGE_KEY, JSON.stringify(articles));
    } catch (e) {
      // LocalStorage QuotaExceededError (5MB limit hit)
      console.warn('LocalStorage quota reached, relied on IndexedDB for full database.', e);
      try {
        // Strip heavy content for localStorage fallback if needed
        const lightArticles = articles.map((a) => ({
          ...a,
          content: a.content.slice(0, 1000), // Keep preview
        }));
        localStorage.setItem(PRIMARY_STORAGE_KEY, JSON.stringify(lightArticles));
      } catch {
        // IndexedDB already has the full database safe
      }
    }
  }
}

// Download articles backup as a JSON file
export function exportArticlesBackup(articles: Article[]): void {
  try {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(articles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `the-hind-canadian-times-articles-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (err) {
    console.error('Failed to export articles backup:', err);
  }
}

// Restore articles from a JSON file
export function importArticlesFromBackup(file: File): Promise<Article[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          resolve(parsed as Article[]);
        } else {
          reject(new Error('Invalid backup file format: must be an array of articles.'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}

// ==========================================
// E-Paper PDF Storage in IndexedDB
// ==========================================

export async function saveEPaperEditionsToIndexedDB(editions: EPaperEdition[]): Promise<boolean> {
  try {
    const db = await openDB();
    if (!db) return false;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(EPAPER_STORE, 'readwrite');
        const store = tx.objectStore(EPAPER_STORE);
        store.put(editions, EPAPER_KEY);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  } catch {
    return false;
  }
}

export async function loadEPaperEditionsFromIndexedDB(): Promise<EPaperEdition[] | null> {
  try {
    const db = await openDB();
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(EPAPER_STORE, 'readonly');
        const store = tx.objectStore(EPAPER_STORE);
        const req = store.get(EPAPER_KEY);
        req.onsuccess = () => {
          if (Array.isArray(req.result) && req.result.length > 0) {
            const sanitized = req.result.map((ed: EPaperEdition) => {
              const clean = { ...ed };
              if (clean.pdfUrl?.includes('dummy.pdf') || clean.pdfUrl?.includes('w3.org')) {
                clean.pdfUrl = clean.id?.includes('13') ? SAMPLE_BUSINESS_PDF_BASE64 : SAMPLE_EPAPER_PDF_BASE64;
                clean.pdfDataUrl = clean.pdfUrl;
              } else if (!clean.pdfDataUrl && clean.pdfUrl?.startsWith('data:')) {
                clean.pdfDataUrl = clean.pdfUrl;
              } else if (!clean.pdfDataUrl && !clean.pdfUrl) {
                clean.pdfDataUrl = SAMPLE_EPAPER_PDF_BASE64;
                clean.pdfUrl = SAMPLE_EPAPER_PDF_BASE64;
              }
              return clean;
            });
            resolve(sanitized);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  } catch {
    return null;
  }
}

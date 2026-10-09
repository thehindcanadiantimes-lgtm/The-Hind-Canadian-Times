import { Article, NewsCategory } from '../types';

/**
 * Universal, Ultra-Resilient Google Takeout & Blogger Feed Parser
 * Handles:
 * - Google Takeout 'feed.atom' and 'feed'
 * - Blogger Dashboard 'blog-MM-DD-YYYY.xml'
 * - RSS 2.0 and Atom 1.0 feeds
 * - Individual HTML post files from Takeout
 * 
 * Features:
 * - Dual-engine: Safe XML DOM Parser + Fault-Tolerant Regex Streaming Engine
 * - Resolves unescaped ampersands, &nbsp;, and malformed XML tags
 * - Never throws DOMException on colon selectors
 * - Accurate chronological sorting (Today / 2026 at the top)
 * - Automatic image extraction from post body or fallback
 */

const DEFAULT_IMAGE = '/src/assets/images/newspaper_masthead_hero_1791385485215.jpg';

const CATEGORY_IMAGES: Record<string, string> = {
  Canada: '/src/assets/images/newspaper_masthead_hero_1791385485215.jpg',
  Business: '/src/assets/images/indo_canadian_business_tech_1791385507119.jpg',
  'Diaspora & Community': '/src/assets/images/cultural_festival_diaspora_1791385525786.jpg',
  'Arts & Culture': '/src/assets/images/cultural_festival_diaspora_1791385525786.jpg',
  India: '/src/assets/images/newspaper_masthead_hero_1791385485215.jpg',
  Immigration: '/src/assets/images/newspaper_masthead_hero_1791385485215.jpg',
  Sports: '/src/assets/images/newspaper_masthead_hero_1791385485215.jpg',
  'Opinion & Editorial': '/src/assets/images/newspaper_masthead_hero_1791385485215.jpg',
};

// Safe HTML entity decoders
export function decodeXmlAndHtmlEntities(text: string): string {
  if (!text) return '';
  return text
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&rsquo;/gi, "'")
    .replace(/&lsquo;/gi, "'")
    .replace(/&rdquo;/gi, '"')
    .replace(/&ldquo;/gi, '"')
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    .replace(/&hellip;/gi, '...')
    .replace(/&bull;/gi, '•')
    .replace(/&copy;/gi, '©')
    .replace(/&reg;/gi, '®')
    .replace(/&trade;/gi, '™')
    .replace(/&amp;/g, '&');
}

// Convert HTML content into clean readable text for summaries
export function stripHtmlToCleanText(htmlStr: string): string {
  if (!htmlStr) return '';
  // Remove script and style tags completely
  let clean = htmlStr.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  // Structural linebreaks
  clean = clean.replace(/<br\s*[\/]?>/gi, '\n');
  clean = clean.replace(/<\/p>/gi, '\n\n');
  clean = clean.replace(/<\/div>/gi, '\n');
  clean = clean.replace(/<\/h[1-6]>/gi, '\n\n');
  clean = clean.replace(/<\/li>/gi, '\n');
  // Strip all other HTML tags
  clean = clean.replace(/<[^>]+>/g, ' ');
  // Decode entities
  clean = decodeXmlAndHtmlEntities(clean);
  // Collapse whitespace
  return clean.replace(/[ \t]+/g, ' ').replace(/\n\s*\n\s*\n/g, '\n\n').trim();
}

// Map Blogger tags to newspaper category
export function mapBloggerCategoriesToNews(categories: string[]): NewsCategory {
  const combined = categories.join(' ').toLowerCase();

  if (combined.includes('canada') || combined.includes('ontario') || combined.includes('toronto') || combined.includes('brampton') || combined.includes('mississauga') || combined.includes('bc') || combined.includes('ottawa')) {
    return 'Canada';
  }
  if (combined.includes('india') || combined.includes('delhi') || combined.includes('punjab') || combined.includes('hindi') || combined.includes('mumbai')) {
    return 'India';
  }
  if (combined.includes('visa') || combined.includes('immigrat') || combined.includes('express entry') || combined.includes('pr') || combined.includes('work permit') || combined.includes('student')) {
    return 'Immigration';
  }
  if (combined.includes('business') || combined.includes('trade') || combined.includes('finance') || combined.includes('economy') || combined.includes('market') || combined.includes('money')) {
    return 'Business';
  }
  if (combined.includes('art') || combined.includes('culture') || combined.includes('poet') || combined.includes('sahitya') || combined.includes('festival') || combined.includes('kavi') || combined.includes('mushaira')) {
    return 'Arts & Culture';
  }
  if (combined.includes('sport') || combined.includes('cricket') || combined.includes('hockey')) {
    return 'Sports';
  }
  if (combined.includes('opinion') || combined.includes('editorial') || combined.includes('column') || combined.includes('view') || combined.includes('analysis')) {
    return 'Opinion & Editorial';
  }
  return 'Diaspora & Community';
}

// Extract primary image URL from post HTML or XML
export function extractFirstImageUrl(content: string): string | undefined {
  if (!content) return undefined;
  // Handle escaped &lt;img and raw <img
  const decodedContent = content.slice(0, 10000).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const imgMatch = decodedContent.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1]) {
    const src = imgMatch[1].trim();
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
      return src.startsWith('//') ? `https:${src}` : src;
    }
  }
  return undefined;
}

// Safe XML sanitization before DOMParser
function sanitizeXmlForDom(raw: string): string {
  // Strip BOM and null bytes
  let xml = raw.replace(/^\uFEFF/, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  // Replace HTML-only entities that cause XML fatal parser errors
  xml = xml
    .replace(/&nbsp;/gi, '&#160;')
    .replace(/&rsquo;/gi, '&#8217;')
    .replace(/&lsquo;/gi, '&#8216;')
    .replace(/&rdquo;/gi, '&#8221;')
    .replace(/&ldquo;/gi, '&#8220;')
    .replace(/&mdash;/gi, '&#8212;')
    .replace(/&ndash;/gi, '&#8211;')
    .replace(/&hellip;/gi, '&#8230;')
    .replace(/&bull;/gi, '&#8226;')
    .replace(/&copy;/gi, '&#169;')
    .replace(/&reg;/gi, '&#174;')
    .replace(/&trade;/gi, '&#8482;');
  // Fix lone unescaped ampersands in URLs or text
  xml = xml.replace(/&(?!(?:[a-zA-Z0-9]+|#[0-9]+|#x[0-9a-fA-F]+);)/g, '&amp;');
  return xml;
}

/**
 * Engine 1: XML DOM Parser
 */
function parseWithDom(xmlString: string): Article[] {
  try {
    const cleanXml = sanitizeXmlForDom(xmlString);
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(cleanXml, 'text/xml');

    // Check for parse errors
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      return [];
    }

    // Collect entries
    let entries = Array.from(xmlDoc.getElementsByTagName('entry'));
    if (entries.length === 0) entries = Array.from(xmlDoc.getElementsByTagNameNS('*', 'entry'));
    if (entries.length === 0) entries = Array.from(xmlDoc.getElementsByTagName('item'));
    if (entries.length === 0) entries = Array.from(xmlDoc.getElementsByTagNameNS('*', 'item'));

    if (entries.length === 0) return [];

    const articles: Article[] = [];
    const seenIds = new Set<string>();

    for (let i = 0; i < entries.length; i++) {
      try {
        const entry = entries[i];

        // Check categories for comment / template / settings filtering
        const catNodes = Array.from(entry.getElementsByTagName('category'));
        const catTerms: string[] = [];
        let isExcluded = false;

        for (const cat of catNodes) {
          const term = (cat.getAttribute('term') || '').toLowerCase();
          const scheme = (cat.getAttribute('scheme') || '').toLowerCase();

          if (term.includes('kind#comment') || scheme.includes('kind#comment') ||
              term.includes('kind#template') || scheme.includes('kind#template') ||
              term.includes('kind#settings') || scheme.includes('kind#settings')) {
            isExcluded = true;
            break;
          }
          if (term) catTerms.push(term);
        }

        if (isExcluded) continue;

        // Tag text helper without dangerous colons in querySelector
        const getTagContent = (tags: string[]): string => {
          for (const t of tags) {
            const els = entry.getElementsByTagName(t);
            if (els.length > 0 && els[0].textContent) return els[0].textContent.trim();
            const nsEls = entry.getElementsByTagNameNS('*', t);
            if (nsEls.length > 0 && nsEls[0].textContent) return nsEls[0].textContent.trim();
          }
          return '';
        };

        const titleRaw = getTagContent(['title', 'headline']);
        const contentRaw = getTagContent(['content', 'summary', 'description']);
        const publishedRaw = getTagContent(['published', 'pubDate', 'date']);
        const updatedRaw = getTagContent(['updated']);
        const authorRaw = getTagContent(['name', 'author', 'creator']);
        const idRaw = getTagContent(['id', 'guid']);

        // Extract link href
        let linkHref = '';
        const linkNodes = Array.from(entry.getElementsByTagName('link'));
        for (const l of linkNodes) {
          const rel = l.getAttribute('rel');
          const href = l.getAttribute('href');
          if (href && (!rel || rel === 'alternate')) {
            linkHref = href.trim();
            break;
          }
        }
        if (!linkHref && linkNodes.length > 0) {
          linkHref = linkNodes[0].getAttribute('href') || linkNodes[0].textContent || '';
        }

        const cleanText = stripHtmlToCleanText(contentRaw);
        let title = decodeXmlAndHtmlEntities(titleRaw).trim();
        if (!title || title.toLowerCase().startsWith('comment on')) {
          if (cleanText.length > 10) {
            title = cleanText.split('\n')[0].slice(0, 90).trim();
          } else {
            title = `Editorial Archive #${entries.length - i}`;
          }
        }

        const uniqueKey = idRaw || linkHref || title;
        if (!uniqueKey || seenIds.has(uniqueKey)) continue;
        seenIds.add(uniqueKey);

        // Date calculation
        let timestamp = 0;
        let publishedDate = '';
        const dateStr = publishedRaw || updatedRaw;
        if (dateStr) {
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) {
            timestamp = d.getTime();
            publishedDate = d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
          }
        }
        if (timestamp === 0 && linkHref) {
          const match = linkHref.match(/\/(\d{4})\/(\d{2})\//);
          if (match) {
            const d = new Date(`${match[1]}-${match[2]}-01`);
            if (!isNaN(d.getTime())) {
              timestamp = d.getTime();
              publishedDate = `${match[1]}-${match[2]}`;
            }
          }
        }
        if (timestamp === 0) {
          timestamp = Date.now() - (i * 1000);
          publishedDate = 'Recent';
        }

        const category = mapBloggerCategoriesToNews(catTerms);
        const imageUrl = extractFirstImageUrl(contentRaw) || CATEGORY_IMAGES[category] || DEFAULT_IMAGE;
        const author = decodeXmlAndHtmlEntities(authorRaw) || 'The Hind Canadian Times Bureau';

        // Extract clean post ID
        const idMatch = idRaw.match(/post-(\d+)/);
        const cleanId = idMatch ? idMatch[1] : uniqueKey.replace(/[^a-zA-Z0-9_-]/g, '').slice(-28);
        const stableId = `art-blogger-${cleanId || i}`;

        const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
        const readTime = `${Math.max(2, Math.round(wordCount / 160))} min read`;

        articles.push({
          id: stableId,
          title,
          subtitle: cleanText.slice(0, 150) + (cleanText.length > 150 ? '...' : ''),
          category,
          author,
          authorRole: 'Contributing Writer',
          location: 'Canada · India',
          publishedAt: `${publishedDate} (Archived Dispatch)`,
          readTime,
          summary: cleanText.slice(0, 160) + (cleanText.length > 160 ? '...' : ''),
          content: cleanText || title,
          imageUrl,
          imageCaption: linkHref ? `Archived from: ${linkHref}` : 'The Hind Canadian Times Special Archive',
          views: Math.floor(130 + Math.random() * 400),
          likes: Math.floor(14 + Math.random() * 35),
          commentsCount: 2,
          source: 'Archived Dispatch',
          timestamp,
        });
      } catch {
        // Individual entry failure does not halt other entries
      }
    }

    return articles;
  } catch {
    return [];
  }
}

/**
 * Engine 2: High-Performance, Fault-Tolerant Regex Stream Parser
 * Bypasses XML parsers entirely — works even if XML has invalid syntax, unescaped ampersands, or truncated tags.
 */
function parseWithRegex(rawContent: string): Article[] {
  const articles: Article[] = [];
  const seenIds = new Set<string>();

  // Find all <entry> ... </entry> or <item> ... </item> blocks
  const entryRegex = /<(?:[a-zA-Z0-9_-]+:)?(?:entry|item)\b[^>]*>([\s\S]*?)<\/(?:[a-zA-Z0-9_-]+:)?(?:entry|item)>/gi;
  let entryMatch: RegExpExecArray | null;
  let index = 0;

  while ((entryMatch = entryRegex.exec(rawContent)) !== null) {
    index++;
    try {
      const block = entryMatch[1];

      // Exclude comments, templates, and settings
      if (/kind#comment/i.test(block) || /kind#template/i.test(block) || /kind#settings/i.test(block)) {
        continue;
      }

      // Title extractor: handles CDATA and standard tags
      const titleMatch = block.match(/<(?:[a-zA-Z0-9_-]+:)?title\b[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/(?:[a-zA-Z0-9_-]+:)?title>/i);
      const rawTitle = (titleMatch ? (titleMatch[1] ?? titleMatch[2] ?? '') : '').trim();

      // Content extractor
      const contentMatch =
        block.match(/<(?:[a-zA-Z0-9_-]+:)?content\b[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/(?:[a-zA-Z0-9_-]+:)?content>/i) ||
        block.match(/<(?:[a-zA-Z0-9_-]+:)?summary\b[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/(?:[a-zA-Z0-9_-]+:)?summary>/i) ||
        block.match(/<description\b[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/description>/i);
      const rawContent = (contentMatch ? (contentMatch[1] ?? contentMatch[2] ?? '') : '').trim();

      // Date extractor
      const dateMatch =
        block.match(/<(?:[a-zA-Z0-9_-]+:)?published\b[^>]*>([\s\S]*?)<\/(?:[a-zA-Z0-9_-]+:)?published>/i) ||
        block.match(/<(?:[a-zA-Z0-9_-]+:)?updated\b[^>]*>([\s\S]*?)<\/(?:[a-zA-Z0-9_-]+:)?updated>/i) ||
        block.match(/<pubDate\b[^>]*>([\s\S]*?)<\/pubDate>/i);
      const rawDate = (dateMatch ? dateMatch[1] : '').trim();

      // ID extractor
      const idMatch =
        block.match(/<(?:[a-zA-Z0-9_-]+:)?id\b[^>]*>([\s\S]*?)<\/(?:[a-zA-Z0-9_-]+:)?id>/i) ||
        block.match(/<guid\b[^>]*>([\s\S]*?)<\/guid>/i);
      const rawId = (idMatch ? idMatch[1] : '').trim();

      // Link extractor (alternate or default)
      let rawLink = '';
      const linkAlternateMatch = block.match(/<link\b[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["'][^>]*\/?>/i);
      if (linkAlternateMatch) {
        rawLink = linkAlternateMatch[1];
      } else {
        const linkAnyMatch = block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*\/?>/i) || block.match(/<link\b[^>]*>([^<]+)<\/link>/i);
        if (linkAnyMatch) rawLink = linkAnyMatch[1];
      }

      // Author extractor
      const authorMatch = block.match(/<author>[\s\S]*?<name\b[^>]*>([\s\S]*?)<\/name>/i) || block.match(/<(?:dc:)?creator\b[^>]*>([\s\S]*?)<\/(?:dc:)?creator>/i);
      const rawAuthor = (authorMatch ? authorMatch[1] : '').trim();

      // Categories extractor
      const catTerms: string[] = [];
      const catRegex = /<category\b[^>]*term=["']([^"']+)["'][^>]*\/?>/gi;
      let cMatch: RegExpExecArray | null;
      while ((cMatch = catRegex.exec(block)) !== null) {
        catTerms.push(cMatch[1].toLowerCase());
      }

      const cleanText = stripHtmlToCleanText(rawContent);
      let title = decodeXmlAndHtmlEntities(rawTitle).trim();
      if (!title || title.toLowerCase().startsWith('comment on')) {
        if (cleanText.length > 10) {
          title = cleanText.split('\n')[0].slice(0, 90).trim();
        } else {
          title = `Editorial Archive #${index}`;
        }
      }

      const uniqueKey = rawId || rawLink || title;
      if (!uniqueKey || seenIds.has(uniqueKey)) continue;
      seenIds.add(uniqueKey);

      // Date parsing
      let timestamp = 0;
      let publishedDate = '';
      if (rawDate) {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          timestamp = d.getTime();
          publishedDate = d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
        }
      }
      if (timestamp === 0 && rawLink) {
        const match = rawLink.match(/\/(\d{4})\/(\d{2})\//);
        if (match) {
          const d = new Date(`${match[1]}-${match[2]}-01`);
          if (!isNaN(d.getTime())) {
            timestamp = d.getTime();
            publishedDate = `${match[1]}-${match[2]}`;
          }
        }
      }
      if (timestamp === 0) {
        timestamp = Date.now() - (index * 1000);
        publishedDate = 'Recent';
      }

      const category = mapBloggerCategoriesToNews(catTerms);
      const imageUrl = extractFirstImageUrl(rawContent) || CATEGORY_IMAGES[category] || DEFAULT_IMAGE;
      const author = decodeXmlAndHtmlEntities(rawAuthor) || 'The Hind Canadian Times Bureau';

      // Clean post ID
      const postNumMatch = rawId.match(/post-(\d+)/);
      const cleanId = postNumMatch ? postNumMatch[1] : uniqueKey.replace(/[^a-zA-Z0-9_-]/g, '').slice(-28);
      const stableId = `art-blogger-${cleanId || index}`;

      const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
      const readTime = `${Math.max(2, Math.round(wordCount / 160))} min read`;

      articles.push({
        id: stableId,
        title,
        subtitle: cleanText.slice(0, 150) + (cleanText.length > 150 ? '...' : ''),
        category,
        author,
        authorRole: 'Contributing Writer',
        location: 'Canada · India',
        publishedAt: `${publishedDate} (Archived Dispatch)`,
        readTime,
        summary: cleanText.slice(0, 160) + (cleanText.length > 160 ? '...' : ''),
        content: cleanText || title,
        imageUrl,
        imageCaption: rawLink ? `Archived from: ${rawLink}` : 'The Hind Canadian Times Special Archive',
        views: Math.floor(130 + Math.random() * 400),
        likes: Math.floor(14 + Math.random() * 35),
        commentsCount: 2,
        source: 'Archived Dispatch',
        timestamp,
      });
    } catch {
      // Continue next
    }
  }

  return articles;
}

/**
 * Universal Entry Point:
 * Runs Dual-Engine parsing with automatic fallback and chronological sorting.
 */
export async function parseBloggerFeedOrXml(
  fileContent: string,
  onProgress?: (status: string) => void
): Promise<Article[]> {
  onProgress?.('Analyzing archive format and structure...');

  // Try Engine 1 (DOM)
  let results = parseWithDom(fileContent);

  // If DOM found fewer articles or failed, try Engine 2 (Regex)
  if (results.length === 0) {
    onProgress?.('Engaging fault-tolerant stream parser...');
    const regexResults = parseWithRegex(fileContent);
    if (regexResults.length > results.length) {
      results = regexResults;
    }
  } else {
    // If DOM got some, verify with Regex to see if any articles were skipped due to XML syntax anomalies
    const regexResults = parseWithRegex(fileContent);
    if (regexResults.length > results.length) {
      results = regexResults;
    }
  }

  onProgress?.(`Sorting ${results.length} articles chronologically (newest first)...`);

  // Sort strictly newest first by timestamp (Today / 2026 at the top, 2025 below)
  results.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  return results;
}

/**
 * HTML File parser for Takeout individual HTML post files
 */
export function parseTakeoutHtmlFile(htmlContent: string, fileName: string, index: number): Article | null {
  try {
    const clean = stripHtmlToCleanText(htmlContent);
    if (clean.length < 15) return null;

    // Extract title from <h1>, <title>, or filename
    const h1Match = htmlContent.match(/<h1\b[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/h1>/i) ||
                    htmlContent.match(/<title\b[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/title>/i);
    let title = (h1Match ? (h1Match[1] ?? h1Match[2] ?? '') : '').trim();
    if (!title) {
      title = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    }
    title = decodeXmlAndHtmlEntities(title);

    const imageUrl = extractFirstImageUrl(htmlContent) || DEFAULT_IMAGE;
    const category = mapBloggerCategoriesToNews([title, clean.slice(0, 200)]);

    return {
      id: `art-html-${Date.now()}-${index}`,
      title,
      subtitle: clean.slice(0, 150) + (clean.length > 150 ? '...' : ''),
      category,
      author: 'The Hind Canadian Times Bureau',
      authorRole: 'Editorial Staff',
      location: 'Canada · India',
      publishedAt: 'Archived Dispatch',
      readTime: '3 min read',
      summary: clean.slice(0, 160) + (clean.length > 160 ? '...' : ''),
      content: clean,
      imageUrl,
      imageCaption: `Archived file: ${fileName}`,
      views: 110,
      likes: 12,
      commentsCount: 1,
      source: 'Archived Dispatch',
      timestamp: Date.now() - (index * 86400000),
    };
  } catch {
    return null;
  }
}

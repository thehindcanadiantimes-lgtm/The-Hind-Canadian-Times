// Standalone PDF Generator & Base64 Assets for Offline / Local Rendering
// Eliminates any remote CORS fetch failures and provides instant in-browser Canvas rendering

// Safe string to base64 conversion supporting any unicode characters without InvalidCharacterError
export function safeStringToBase64(str: string): string {
  if (typeof TextEncoder !== 'undefined') {
    const utf8Bytes = new TextEncoder().encode(str);
    let binary = '';
    const len = utf8Bytes.length;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      return window.btoa(binary);
    }
    if (typeof btoa === 'function') {
      return btoa(binary);
    }
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'utf-8').toString('base64');
  }
  return '';
}

export function generatePdfDataUrl(title: string, subtitle: string, pagesCount = 4): string {
  const pageObjs: number[] = [];
  const contentObjs: number[] = [];
  let nextId = 4;
  for (let i = 0; i < pagesCount; i++) {
    pageObjs.push(nextId++);
    contentObjs.push(nextId++);
  }
  const fontId = 3;
  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];

  function addObj(id: number, content: string) {
    offsets[id] = pdf.length;
    pdf += `${id} 0 obj\n${content}\nendobj\n`;
  }

  addObj(1, '<< /Type /Catalog /Pages 2 0 R >>');
  addObj(2, `<< /Type /Pages /Kids [${pageObjs.map((id) => `${id} 0 R`).join(' ')}] /Count ${pagesCount} >>`);
  addObj(fontId, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');

  for (let i = 0; i < pagesCount; i++) {
    const pageId = pageObjs[i];
    const contentId = contentObjs[i];
    addObj(
      pageId,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${contentId} 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> >>`
    );
    const safeTitle = title
      .replace(/[\u2010-\u2015]/g, '-')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[^\x20-\x7E]/g, ' ')
      .replace(/[()\\]/g, '');
    const safeSub = subtitle
      .replace(/[\u2010-\u2015]/g, '-')
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[^\x20-\x7E]/g, ' ')
      .replace(/[()\\]/g, '');
    const stream = `BT
/F1 18 Tf
50 800 Td
(${safeTitle}) Tj
ET
BT
/F1 12 Tf
50 770 Td
(${safeSub} - Broadsheet Page ${i + 1} of ${pagesCount}) Tj
ET
BT
/F1 10 Tf
50 740 Td
(THE HIND CANADIAN TIMES - INDEPENDENT PRINT DISPATCH ARCHIVE) Tj
ET
BT
/F1 9 Tf
50 715 Td
(Toronto - Vancouver - Ottawa - U.K. - New Delhi - Chandigarh) Tj
ET
BT
/F1 9 Tf
50 690 Td
(A Multilingual International Magazine - Official E-Paper Broadsheet Replica - ESTD. 2024) Tj
ET
BT
/F1 9 Tf
50 665 Td
(Coverage: Bilateral Trade Accord, Immigration Reform CRS scores, Tech Corridors and Heritage.) Tj
ET`;
    addObj(contentId, `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${nextId}\n0000000000 65535 f \n`;
  for (let i = 1; i < nextId; i++) {
    pdf += `${offsets[i].toString().padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${nextId} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return 'data:application/pdf;base64,' + safeStringToBase64(pdf);
}

// Pre-generated persistent sample editions (4 full pages each)
export const SAMPLE_EPAPER_PDF_BASE64 = generatePdfDataUrl(
  'THE HIND CANADIAN TIMES',
  'Vol. XXVI Issue 14 (Spring Broadsheet Edition)',
  4
);

export const SAMPLE_BUSINESS_PDF_BASE64 = generatePdfDataUrl(
  'THE HIND CANADIAN TIMES - FINANCIAL POST',
  'Vol. XXVI Issue 13 (Autumn Business Edition)',
  4
);

export const SAMPLE_POLICY_BRIEF_PDF_BASE64 = generatePdfDataUrl(
  'PARLIAMENTARY POLICY BRIEF & TRADE ACCORD',
  'Official Canada-India Bilateral Communique',
  2
);

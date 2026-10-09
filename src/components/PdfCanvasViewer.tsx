import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Printer,
  Maximize2,
  Minimize2,
  FileText,
  Loader2,
  AlertCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
// Use local Vite bundled worker asset (self-hosted, zero external CDN fetch or CORS failure)
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker locally
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
  } catch (err) {
    console.warn('PDF.js worker initialization warning:', err);
  }
}

interface PdfCanvasViewerProps {
  pdfSource: string | ArrayBuffer | Uint8Array | File;
  fileName?: string;
  title?: string;
  onTotalPagesDetected?: (pages: number, firstPagePreview?: string) => void;
  onFallbackToBroadsheet?: () => void;
}

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({
  pdfSource,
  fileName = 'edition.pdf',
  title = 'The Hind Canadian Times E-Paper',
  onTotalPagesDetected,
  onFallbackToBroadsheet,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(1.25);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [thumbnails, setThumbnails] = useState<{ pageNum: number; dataUrl: string }[]>([]);

  // Helper to convert base64 data URL to Uint8Array
  const convertDataUrlToUint8 = (dataUrl: string): Uint8Array => {
    try {
      const base64Index = dataUrl.indexOf(';base64,');
      const base64 = base64Index !== -1 ? dataUrl.substring(base64Index + 8) : dataUrl;
      const cleanBase64 = base64.trim().replace(/\s/g, '');
      const binary = window.atob(cleanBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    } catch (e) {
      console.warn('convertDataUrlToUint8 decoding error:', e);
      return new Uint8Array(0);
    }
  };

  // Load PDF Document
  useEffect(() => {
    let isCancelled = false;

    const loadDocument = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        let loadingTask: any;

        if (pdfSource instanceof File) {
          const buffer = await pdfSource.arrayBuffer();
          loadingTask = pdfjsLib.getDocument({ data: buffer });
        } else if (pdfSource instanceof ArrayBuffer || pdfSource instanceof Uint8Array) {
          loadingTask = pdfjsLib.getDocument({ data: pdfSource });
        } else if (typeof pdfSource === 'string') {
          if (pdfSource.startsWith('data:application/pdf') || pdfSource.startsWith('data:')) {
            const bytes = convertDataUrlToUint8(pdfSource);
            if (!bytes || bytes.length === 0) {
              throw new Error('Unable to decode PDF data.');
            }
            loadingTask = pdfjsLib.getDocument({ data: bytes });
          } else {
            // URL string (HTTPS or relative)
            loadingTask = pdfjsLib.getDocument({
              url: pdfSource,
              withCredentials: false,
            });
          }
        } else {
          throw new Error('Unsupported PDF source format.');
        }

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setCurrentPage(1);

        // Generate Page 1 thumbnail for cover / parent
        try {
          const page1 = await doc.getPage(1);
          const thumbViewport = page1.getViewport({ scale: 0.35 });
          const thumbCanvas = document.createElement('canvas');
          thumbCanvas.width = thumbViewport.width;
          thumbCanvas.height = thumbViewport.height;
          const thumbCtx = thumbCanvas.getContext('2d');
          if (thumbCtx) {
            await page1.render({
              canvasContext: thumbCtx,
              viewport: thumbViewport,
            }).promise;
            const previewUrl = thumbCanvas.toDataURL('image/jpeg', 0.8);
            if (onTotalPagesDetected) {
              onTotalPagesDetected(doc.numPages, previewUrl);
            }
          }
        } catch (thumbErr) {
          console.warn('Failed to extract preview thumbnail:', thumbErr);
          if (onTotalPagesDetected) {
            onTotalPagesDetected(doc.numPages);
          }
        }

        setIsLoading(false);
      } catch (err: any) {
        console.warn('PDF.js loading notice:', err?.message || err);
        if (!isCancelled) {
          setErrorMessage(
            err?.message?.includes('Missing PDF') || err?.message?.includes('Failed to fetch')
              ? 'PDF file stream could not be loaded directly. You can view the full Broadsheet Layout below or download the file.'
              : `Unable to render PDF: ${err?.message || 'Unknown error'}`
          );
          setIsLoading(false);
        }
      }
    };

    if (pdfSource) {
      loadDocument();
    } else {
      setIsLoading(false);
      setErrorMessage('No PDF data provided.');
    }

    return () => {
      isCancelled = true;
    };
  }, [pdfSource]);

  // Render Current Page to Canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let isMounted = true;

    const renderPage = async () => {
      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {
            // ignore cancellation
          }
        }

        const page = await pdfDoc.getPage(currentPage);
        if (!isMounted || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const pixelRatio = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: zoom * pixelRatio, rotation });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / pixelRatio}px`;
        canvas.style.height = `${viewport.height / pixelRatio}px`;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;

        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn('Page rendering notice:', err);
        }
      }
    };

    renderPage();

    return () => {
      isMounted = false;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
      }
    };
  }, [pdfDoc, currentPage, zoom, rotation]);

  // Handle Download PDF
  const handleDownload = () => {
    try {
      if (pdfSource instanceof File) {
        const url = URL.createObjectURL(pdfSource);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } else if (typeof pdfSource === 'string' && pdfSource.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = pdfSource;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else if (pdfDoc) {
        pdfDoc.getData().then((data: Uint8Array) => {
          const blob = new Blob([data as any], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        });
      }
    } catch (err) {
      console.warn('Download warning:', err);
    }
  };

  // Handle Print PDF
  const handlePrint = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${title} — Page ${currentPage}</title>
              <style>
                @page { size: auto; margin: 10mm; }
                body { margin: 0; display: flex; justify-content: center; align-items: center; background: white; }
                img { max-width: 100%; height: auto; }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" onload="window.print();window.close();" />
            </body>
          </html>
        `);
        printWindow.document.close();
      } else {
        window.print();
      }
    } catch {
      window.print();
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-neutral-950 text-neutral-200 select-none ${
        isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-full min-h-[550px]'
      }`}
    >
      {/* Top Floating Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 text-xs">
        {/* Page Navigation */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1 || isLoading}
            className="p-1.5 rounded-md hover:bg-neutral-800 disabled:opacity-30 transition-colors text-white"
            title="Previous Page (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 font-mono text-[11px] bg-neutral-950 px-2.5 py-1 rounded-md border border-neutral-800">
            <span>Page</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= 1 && val <= totalPages) {
                  setCurrentPage(val);
                }
              }}
              className="w-10 text-center bg-transparent text-white font-bold focus:outline-hidden"
            />
            <span className="text-neutral-500">/ {totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages || isLoading}
            className="p-1.5 rounded-md hover:bg-neutral-800 disabled:opacity-30 transition-colors text-white"
            title="Next Page (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded-md border border-neutral-800">
          <button
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
            disabled={isLoading}
            className="p-1.5 rounded hover:bg-neutral-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setZoom(1.25)}
            className="px-2 py-1 font-mono text-[11px] tabular-nums hover:text-white"
            title="Reset Zoom"
          >
            {Math.round(zoom * 100 / 1.25)}%
          </button>

          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
            disabled={isLoading}
            className="p-1.5 rounded hover:bg-neutral-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Rotate & View Tools */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            title="Rotate 90° Clockwise"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
            title="Print Current Page"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Print</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-2.5 py-1.5 rounded-md bg-red-800 hover:bg-red-700 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Download PDF Edition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Download</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Canvas Scroll Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-neutral-900/90 relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-neutral-950/80 backdrop-blur-xs space-y-3">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            <div className="text-xs font-mono text-neutral-300">
              Rendering High-Definition E-Paper Page {currentPage}...
            </div>
          </div>
        )}

        {errorMessage ? (
          <div className="max-w-md p-6 rounded-xl border border-neutral-800 bg-neutral-950 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <div>
              <h4 className="font-bold text-sm text-neutral-100">PDF Reader Notice</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{errorMessage}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {onFallbackToBroadsheet && (
                <button
                  onClick={onFallbackToBroadsheet}
                  className="px-3.5 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Switch to Broadsheet Mode</span>
                </button>
              )}
              <button
                onClick={handleDownload}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save PDF File</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative shadow-2xl rounded-sm overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              className="block max-w-none transition-transform duration-100"
            />
          </div>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="px-4 py-2 bg-neutral-950 border-t border-neutral-900 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="truncate">{fileName} &middot; High-Fidelity Canvas Rendering (No Chrome Iframe Blocks)</span>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <span>Page {currentPage} of {totalPages}</span>
        </div>
      </div>
    </div>
  );
};

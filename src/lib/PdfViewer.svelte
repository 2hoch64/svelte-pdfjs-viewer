<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { PDFJS_VIEWER_URL } from './pdfjs-config.js';
  import { loadPdf, setPdfBinary, getPdfBinary, setCurrentPage, downloadPdf } from './pdfViewerUtils.js';
  import './pdfViewer.css';

  const dispatch = createEventDispatcher();

  /** @type {string|null} */
  export let initialPdfUrl = null;
  /** @type {string} */
  export let height = '800px';

  /** @type {HTMLIFrameElement} */
  let iframe;
  /** @type {boolean} */
  let viewerLoaded = false;
  /** @type {boolean} */
  let pdfLoaded = false;
  /** @type {number} */
  let currentPage = 1;
  /** @type {number} */
  let totalPages = 0;
  /** @type {boolean} */
  let isLoading = true;
  /** @type {string|null} */
  let errorMessage = null;
  /** @type {any} */
  let pdfApplication;

  $: isFirstPage = currentPage === 1;
  $: isLastPage = currentPage === totalPages;

  onMount(() => {
     /**
     * Handles the iframe load event.
     */
    const handleIframeLoad = () => {
      pdfApplication = iframe?.contentWindow?.PDFViewerApplication;
      if (!pdfApplication) {
        handleError('Failed to load PDF.js viewer');
        return;
      }
      viewerLoaded = true;
      isLoading = false;
      dispatch('viewerReady');
      setupPageChangeListener();
      if (initialPdfUrl) loadPdf(initialPdfUrl, viewerLoaded, pdfApplication, handleError, setPdfBinaryWrapper);
    };

    iframe.addEventListener('load', handleIframeLoad);
    return () => iframe.removeEventListener('load', handleIframeLoad);
  });

  /**
   * Sets up the page change listener.
   */
  function setupPageChangeListener() {
    if (viewerLoaded && pdfApplication?.eventBus) {
      pdfApplication.eventBus.on('pagechanging', ({ pageNumber }) => {
        if (pageNumber !== currentPage) {
          currentPage = pageNumber;
          dispatch('pageChange', { pageNumber });
        }
      });
    }
  }

  /**
   * Wrapper function for setting PDF binary data.
   * @param {ArrayBuffer} arrayBuffer - The PDF data as an ArrayBuffer.
   */
  async function setPdfBinaryWrapper(arrayBuffer) {
    try {
      totalPages = await setPdfBinary(arrayBuffer, pdfApplication);
      pdfLoaded = true;
      dispatch('pdfLoaded');
    } catch (error) {
      handleError(`Failed to set PDF binary: ${error.message}`);
    }
  }

  /**
   * Handles errors by logging and dispatching them.
   * @param {string} message - The error message.
   */
  function handleError(message) {
    console.error(message);
    errorMessage = message;
    isLoading = false;
    dispatch('error', { message });
  }

  /**
   * Navigates to the next page if available.
   */
  function nextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1, pdfApplication);
    }
  }

  /**
   * Navigates to the previous page if available.
   */
  function prevPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1, pdfApplication);
    }
  }

  /**
   * Handles the PDF download process.
   */
  function handleDownload() {
    downloadPdf(() => getPdfBinary(pdfApplication), handleError);
  }
</script>

<main class="pdf-viewer">
  <h1>PDF Viewer</h1>
  <iframe
    bind:this={iframe}
    src={PDFJS_VIEWER_URL}
    width="100%"
    {height}
    title="PDF Viewer"
  ></iframe>
  {#if isLoading}
    <p>Loading PDF Viewer...</p>
  {:else if errorMessage}
    <p class="error">{errorMessage}</p>
  {:else}
    <div class="controls">
      <button on:click={prevPage} disabled={isFirstPage}>Previous</button>
      <span class="page-info">Page {currentPage} of {totalPages}</span>
      <button on:click={nextPage} disabled={isLastPage}>Next</button>
    </div>
    <div class="download-container">
      <button on:click={handleDownload}>Download PDF</button>
    </div>
  {/if}
</main>
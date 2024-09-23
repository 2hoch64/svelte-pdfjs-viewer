/**
 * Loads a PDF from a given URL.
 * @param {string} url - The URL of the PDF to load.
 * @param {boolean} viewerLoaded - Indicates if the PDF viewer is loaded.
 * @param {Object} pdfApplication - The PDF.js application instance.
 * @param {Function} handleError - Function to handle errors.
 * @param {Function} setPdfBinary - Function to set the PDF binary data.
 * @returns {Promise<void>}
 */
export async function loadPdf(url, viewerLoaded, pdfApplication, handleError, setPdfBinary) {
  if (!viewerLoaded) {
    handleError('Viewer not loaded yet');
    return;
  }
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const arrayBuffer = await response.arrayBuffer();
    await setPdfBinary(arrayBuffer);
  } catch (error) {
    handleError(`Failed to load PDF: ${error.message}`);
  }
}

/**
 * Sets the PDF binary data in the viewer.
 * @param {ArrayBuffer} arrayBuffer - The PDF data as an ArrayBuffer.
 * @param {Object} pdfApplication - The PDF.js application instance.
 * @returns {Promise<number>} The total number of pages in the PDF.
 */
export async function setPdfBinary(arrayBuffer, pdfApplication) {
  await pdfApplication.open({ data: new Uint8Array(arrayBuffer) });
  return pdfApplication.pagesCount;
}

/**
 * Gets the current PDF as binary data.
 * @param {Object} pdfApplication - The PDF.js application instance.
 * @returns {Promise<ArrayBuffer>} The PDF data as an ArrayBuffer.
 */
export async function getPdfBinary(pdfApplication) {
  return await pdfApplication.pdfDocument.saveDocument();
}

/**
 * Sets the current page in the PDF viewer.
 * @param {number} pageNumber - The page number to set.
 * @param {Object} pdfApplication - The PDF.js application instance.
 */
export function setCurrentPage(pageNumber, pdfApplication) {
  pdfApplication.page = pageNumber;
  pdfApplication.eventBus.dispatch('pagechanging', { source: this, pageNumber: pageNumber });
}

/**
 * Downloads the current PDF.
 * @param {Function} getPdfBinary - Function to get the PDF binary data.
 * @param {Function} handleError - Function to handle errors.
 * @returns {Promise<void>}
 */
export async function downloadPdf(getPdfBinary, handleError) {
  try {
    const pdfData = await getPdfBinary();
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    handleError(`Failed to download PDF: ${error.message}`);
  }
}
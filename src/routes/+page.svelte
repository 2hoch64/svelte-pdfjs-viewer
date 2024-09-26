<script>
  import PdfViewer from '$lib/PdfViewer.svelte';

  /** @type {string} */
  let pdfUrl = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
</script>

<PdfViewer initialPdfUrl={pdfUrl} />
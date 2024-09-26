<script>
  import PdfViewerComponent from '$lib/PdfViewer.svelte';
  
  let customPdfUrl = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
</script>

<h1>Custom PDF Viewer Page</h1>

<PdfViewerComponent pdfUrl={customPdfUrl} />

<style>
  h1 {
    text-align: center;
    color: #333;
  }
</style>
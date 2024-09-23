# Advanced PDF Viewer Svelte Component

A powerful Svelte component for viewing and interacting with PDF documents using PDF.js. This component offers a full-featured PDF viewing experience, including advanced capabilities like form filling and annotations.

## Features

- View PDF documents with high fidelity
- Navigate through pages (next, previous, jump to page)
- Zoom in/out and fit-to-page options
- Text selection and copy
- Search within the document
- Fill out PDF forms
- Add, edit, and delete annotations
- Download viewed PDF
- Print functionality
- Responsive design for various screen sizes

## Installation

1. Install the package:
``npm install svelte-pdfjs-viewer``

2. Ensure you have PDF.js installed in your project:
``npm install pdfjs-dist``

3. Copy the PDF.js viewer files to your project's `static` directory. (Detailed instructions in the Setup section below)

## Setup

1. After installation, copy the PDF.js viewer files to your project:
- From `node_modules/pdfjs-dist/build`, copy:
  - `pdf.worker.js`
  - The `web` folder
- Place these in your project's `static` directory

2. In your `svelte.config.js`, ensure static file serving is enabled:
```javascript
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    files: {
      assets: 'static'
    }
  }
};

export default config;
```
## Usage
1. Import the component in your Svelte file:
```
<script>
import PdfViewer from 'advanced-pdf-viewer-svelte';
</script>
```
2. Use the component in your markup:
```
<PdfViewer initialPdfUrl="path/to/your/pdf.pdf" height="800px" />
```

## API
Props
- ``initialPdfUrl`` (string, optional): URL of the PDF to load initially.
- ``height`` (string, default: '800px'): Height of the PDF viewer.
- ``enableForms`` (boolean, default: true): Enable form filling functionality.
- ``enableAnnotations`` (boolean, default: true): Enable annotation tools.

Events
- ``viewerReady``: Fired when the PDF viewer is ready.
- ``pdfLoaded``: Fired when a PDF is loaded.
- ``pageChange``: Fired when the current page changes.
- ``formSubmit``: Fired when a form within the PDF is submitted.
- ``annotationAdded``: Fired when an annotation is added.
- ``annotationUpdated``: Fired when an annotation is updated.
- ``annotationDeleted``: Fired when an annotation is deleted.
- ``error``: Fired when an error occurs.

## Advanced Usage Examples
Form Filling
```
<script>
import PdfViewer from 'advanced-pdf-viewer-svelte';

function handleFormSubmit(event) {
  const formData = event.detail.formData;
  console.log('Form submitted:', formData);
}
</script>

<PdfViewer 
  initialPdfUrl="/path/to/form.pdf"
  enableForms={true}
  on:formSubmit={handleFormSubmit}
/>
```

## Annotations
```
<script>
import PdfViewer from 'advanced-pdf-viewer-svelte';

function handleAnnotationAdded(event) {
  const annotation = event.detail.annotation;
  console.log('Annotation added:', annotation);
}
</script>

<PdfViewer 
  initialPdfUrl="/path/to/document.pdf"
  enableAnnotations={true}
  on:annotationAdded={handleAnnotationAdded}
/>
```

## Customization
The component uses the standard PDF.js viewer, which can be customized through CSS. To override default styles, you can target the viewer's DOM elements in your global CSS or component-specific styles.

## Browser Support
This component should work in all modern browsers that support PDF.js. For optimal performance and feature support, we recommend using the latest versions of Chrome, Firefox, Safari, or Edge.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- This component is built on top of PDF.js by Mozilla.


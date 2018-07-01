# Photo Gallery PDF Creator

This is a vanilla JavaScript Plugin written in ES6 for saving out .pdf files from a selected group of images. It requires JSPDF to work properly.

# How To Use It

## To initialize:
```
// The Easy Way
	
	const newPDFCreator = new createPDF();

```

## All The options:

```
const newPDFCreator = new createPDF({
	orientation: 'l',
	units: 'in',
	pdfW: 11,
	pdfH: 8.5,
	limit: 50,
	button: 'PDFCreator.Button',
	radios: 'PDFCreator.RadioButtons',
	images: 'PDFCreator.Image',
	container: 'body',
	clear: true,
	column: 91,
	gutter: 3
});
	
```

### Orientation
valid inputs: `l`or `p`
- Determines the orientation of the document, either landscape or portrait

---
TODO: [] Add HTML template
TODO: [] Finish writing the options


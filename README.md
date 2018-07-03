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
	orientation = 'l',
	units = 'in',
	pdfW = 11,
	pdfH = 8.5,
	limit = 50,
	button = `${this.moduleName}.Button`,
	radios = `${this.moduleName}.RadioButtons`,
	images = `${this.moduleName}.Image`,
	container = 'body',
	clear = true,
	column = 91,
	gutter = 3,
	name = 'My-Custom-PDF'
});
	
```

### Orientation
valid inputs: `l`or `p`
- Determines the orientation of the document, either landscape or portrait

### Unit
valid inputs: `in`or `p`
- Determines the orientation of the document, either landscape or portrait

### .pdf Width
valid inputs: `any number`
- Determines width of PDF in the units specified.

### .pdf Height
valid inputs: `any number`
- Determines the orientation of the document, either landscape or portrait

### Limit
valid inputs: `any number`
- Determines the number of images a user can add to the .pdf they're creating

### Button
valid inputs: `any CSS selector`
- Determines how to find the button that a user will press to create the .pdf

### Radios
valid inputs: `any CSS selector`
- Determines how to find the radio buttons that a user will select from

### Images
valid inputs: `any CSS selector`
- Determines how to find the images that the user can select

### Container
valid inputs: `any CSS selector`
- Determines which HTML element you want to append the .jsPDF script to if you don't have it.

### Clear
valid inputs: `true`or `false`
- When a user generates a .pdf, should the images they selected be cleared?

### Column
valid inputs: `any number`
- Determines the size of the columns (in percentages) for your document

### Gutter
valid inputs: `any number`
- Determines the size of the gutters (in percentages) in your document

### Name
valid inputs: `any string`
- Names the custom document generated.

---
TODO: [] Add HTML template
TODO: [] Finish writing the options


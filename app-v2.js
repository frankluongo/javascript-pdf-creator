class createPDF {
	//
	// Constructor
	//
		constructor(options = {}) {
			this.options = options;
			this.init();
		};

	//
	// Builders
	//

		mapValues () {

			this.selectCSS = 'selected';
			this.selectJS = 'js-selected';

			const {
				orientation = 'l',
				units = 'in',
				pdfW = 11,
				pdfH = 8.5
				limit = 50
				imgClassName = 'pdf-image'
			} = this.options;

			this.orientation = orientation;
			this.units = units;
			this.pdfW = pdfW;
			this.pdfH = pdfH;
			this.limit = limit;
			this.imgClassName = imgClassName;
		};

		init() {
			this.mapValues();
		};

		build() {
			this.selectImages();
			this.findSelectedValues();
			this.checkImages();
			this.convertImages();
		};

	//
	// Actions
	//

		selectImages() {
			this.selectedImages = this.returnArray(`.${this.selectJS}`);
		};

		selectRadio(radios) {
			radios.indexOf(radio.selected)
		};

		convertImages() {
  		this.selectedImages.forEach((image) => {
  			let finalIMG = this.createIMG(image.href);
  			let canvas = this.createCanvas(img);
  		});
		};

		base64Encode(image) {
			let finalIMG = this.createIMG(image.href);
		};

		createIMG (source) {
			let photo = document.createElement('img');
			photo.src = source;

			return photo;
		};

		createCanvas(image) {
			let canvas = document.createElement("canvas");
			canvas.width = image.width;
			canvas.height = image.height;
			let ctx = canvas.getContext("2d");
			ctx.drawImage(image, 0, 0);

			return canvas;
		}

		printPDF () {
			this.document = new jsPDF({
				orientation: this.orientation,
				unit: this.units,
				format: [this.pdfW, this.pdfH]
			});
		};

	//
	// Helpers
	//

		returnArray (selector, context) {
			if (!context) {
				context = document;
			}
			return Array.from(context.querySelectorAll(`${selector}`));
		};

		subtract (value1, value2) {
			return value1 - value2;
		};

		convertToNumber (value) {
			// parses integers with a radix of 10
			return parseInt(value, 10);
		};

		isOdd (value) {
			if (value%2 == 0)
				return true;
			else
				return false;
		};

		convertPXtoIn (pixelVal) {
			// 300 = Pixels per inch
			return pixelVal / 300;
		};

		centerElement (elem, fullMeasure) {
			return (fullMeasure - elem) / 2;
		};

		scaleProportions (origProp1, origProp2, newProp2) {
			return (origProp1 * newProp2) / origProp2;
		};
};

var obj = new createPDF({
	thing: 200,
	otherThing: 3000
});


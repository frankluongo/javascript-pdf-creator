class createPDF {
	//
	// Constructor
	//
		constructor(options = {}) {

			if (options) {
				this.options = options;
			} else {
				this.
			}
			this.init();
		};

	//
	// Builders
	//

		init() {
			console.log('initialized');
			var thing = this.findImages('hello');
			console.log(thing);
		};

		build() {
			this.findSelectedImages();
			this.findSelectedValues();
			this.checkImages();
			const convertImages = this.convertImages();
			convertImages
			.then(this.addIndicatorToLastObjectInArray)
			.then(this.createPDFDocument)
			.then(this.assignNumberOfImagesPerPage)
			.then(this.savePDF);
		};

	//
	// Actions
	//

		convertImages() {
	  	return new Promise((resolve, reject) => {

	  		this.selectedImages.forEach((image) => {
	  			let finalIMG = this.createIMG(image.href);
	  			let canvas = this.createCanvas(img);
	  		});

	    	if (true) {
	      	resolve("SUCCESS");
	    	} else {
	      	reject("FAILURE");
	    	}
	  	})
		};

		base64Encode(image) {

			let finalIMG = this.createIMG(image.href);
		};

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

function convertCurrency(amount) {
    const converted = {
      USD: amount * 0.76,
      GPB: amount * 0.53,
      AUD: amount * 1.01,
      MEX: amount * 13.30
    };
    return converted;
  }
  function tipCalc({ total = 100, tip = 0.15, tax = 0.13 } = {}) {
    return total + (tip * total) + (tax * total);
  }
  const bill = tipCalc({ tip: 0.20, total: 200 });
  console.log(bill);



// const test = testFunction();


var PDF_CREATOR = {

	init(options = {}) {
		this.options = options;
		this.pdfButton = document.querySelector(`#pdf`);
		this.images = Array.from(document.querySelectorAll(`.${this.options.imageClass}`));
		this.selectedClassCSS = `selected`;
		this.selectedClassJS = `js-selected`;
		this.body = document.querySelector('body');


		if(this.images) {
			this.addListeners();
		}
	},


	start() {
		this.allSelectedImages = [];

		this.radioValues = Array.from(document.querySelectorAll('.selection-items'));

		this.limit = 50;

		this.index = 0;
		this.ofFour = 1;

		this.pdfWidth = 11;
		this.pdfHeight = 8.5;
		this.pdfHeightHalf = (this.pdfHeight / 2);

		//
		// PERCENTS
		//

		this.gutter = 3;
		this.columnFull = 91;
		this.columnHalf = 45.5;

		//
		// MEASUREMENTS
		//

		this.twoColGutter = this.convertPercentToMeasurement(this.gutter, this.pdfWidth);
		this.twoColColumn = this.convertPercentToMeasurement(45.5, this.pdfWidth);
		this.twoRowRow = this.convertPercentToMeasurement(50, this.pdfHeight);

		this.buildPDF();
	},

	//
	// BUILDERS
	//

	buildPDF() {
		this.findSelectedImages();
		this.findSelectedRadioValue();
		this.checkNumberOfImages();
		this.convertOurImages();

		this.waitForImages = setInterval(()=>{
			if(this.allSelectedImages.length === this.selectedImages.length) {
				this.afterImagesLoad();
			}
		}, 0);
	},

	afterImagesLoad() {
		clearInterval(this.waitForImages);
		this.addIndicatorToLastObjectInArray();
		this.createPDFDocument();
		this.assignNumberOfImagesPerPage();
		this.savePDF();
	},

	//
	// LISTENERS
	//

	addListeners() {
		this.pdfButton.addEventListener('click', () => this.start());

		for (const img of this.images) {

			img.classList.remove(`everlightbox-trigger`);

			img.addEventListener(`click`, (e) => {
				e.preventDefault();
				console.log('hello!');
				img.classList.toggle(this.selectedClassJS);
				img.classList.toggle(this.selectedClassCSS);
			});
		}
	},

	//
	// ACTIONS
	//

	findSelectedImages() {
		this.selectedImages = Array.from(document.querySelectorAll(`.${this.selectedClassJS}`));
	},

	findSelectedRadioValue() {

		for (const radio_item of this.radioValues) {
			if (radio_item.checked) {
				this.imagesPerPage = parseInt(radio_item.value);
			}
		}
	},

	checkNumberOfImages() {
		if(this.selectedImages.length >= this.limit) {
			var overage = this.selectedImages.length - this.limit;
			alert(`Please remove ${overage} Images and try again.`);
			return;
		}
	},

	convertOurImages() {
		for (const selectedImage of this.selectedImages) {
			this.base64EncodeImage(selectedImage);
		}
	},

	createPDFDocument() {
		this.doc = new jsPDF({
			orientation: 'l',
			unit: 'in',
			format: [this.pdfWidth, this.pdfHeight]
		});
	},

	assignNumberOfImagesPerPage() {

		var width;
		var height;

		switch(this.imagesPerPage) {
			case 1:
				height = this.pdfHeight;
				width = this.columnFull;
			break;


			case 2:
				height = this.pdfHeight;
				width = this.columnHalf;
			break;


			case 4:
				height = this.pdfHeightHalf;
				width = this.columnHalf;
			break;


			default:
		}

		this.printImage(width, height);

	},

	savePDF() {
		this.doc.save('Lincoln-Barbour-Custom-PDF.pdf');
	},

	assignImageSize(selectedPhoto, percentOfWidth, heightLimit) {
		selectedPhoto.printWidth =
			this
			.convertPercentToMeasurement(percentOfWidth, this.pdfWidth);

		selectedPhoto.printHeight =
			this
			.scaleImageProportions(
				selectedPhoto.height,
				selectedPhoto.printWidth,
				selectedPhoto.width
				);

		if (selectedPhoto.printHeight >= heightLimit) {

				selectedPhoto.printHeight =
				this
				.convertPercentToMeasurement(
					this.columnFull,
					heightLimit);

				selectedPhoto.printWidth =
					this
					.scaleImageProportions(
						selectedPhoto.width,
						selectedPhoto.printHeight,
						selectedPhoto.height);
			}
	},

	positionImage(photo) {

		if(this.imagesPerPage === 1) {
			photo.fromLeft = this.centerElement(photo.printWidth, this.pdfWidth);
			photo.fromTop = this.centerElement(photo.printHeight, this.pdfHeight);
		}

		else if(this.imagesPerPage == 2) {

			photo.fromTop = this.centerElement(photo.printHeight, this.pdfHeight);

			if (this.isOdd(photo.index)) {
				photo.fromLeft = this.makeElementClose(this.twoColGutter, this.twoColColumn, photo.printWidth);
			} else {
				photo.fromLeft = this.makeElementFar(this.twoColGutter, this.twoColColumn, photo.printWidth);
			}
		}

		else if(this.imagesPerPage == 4) {

			photo.fromTop = this.centerElement(photo.printHeight, this.pdfHeightHalf);


			switch (photo.ofFour) {
				case 1:
					photo.fromLeft = this.makeElementClose(this.twoColGutter, this.twoColColumn, photo.printWidth);
				break;


				case 2:
					photo.fromLeft = this.makeElementFar(this.twoColGutter, this.twoColColumn, photo.printWidth);
				break;


				case 3:
					photo.fromLeft = this.makeElementClose(this.twoColGutter, this.twoColColumn, photo.printWidth);
					photo.fromTop = this.makeElementFar(0, this.twoRowRow, photo.printHeight);
				break;


				case 4:
					photo.fromLeft = this.makeElementFar(this.twoColGutter, this.twoColColumn, photo.printWidth);
					photo.fromTop = this.makeElementFar(0, this.twoRowRow, photo.printHeight);
				break;


				default:
			}

		} // 4 Images Per Page
	},



	printImage(desiredColumn, heightLimit) {

		for (const photo of this.allSelectedImages) {

			this.assignImageSize(photo, desiredColumn, heightLimit);
			this.positionImage(photo);

			this.addImageToDocument(
				photo.dataURL,
				photo.fromLeft,
				photo.fromTop,
				photo.printWidth,
				photo.printHeight);



			if(!photo.last && this.imagesPerPage === 1) {
				this.doc.addPage();
			} else if (!photo.last && this.imagesPerPage === 2) {
				if(!this.isOdd(photo.index)) {
					this.doc.addPage();
				}
			} else if(!photo.last && this.imagesPerPage === 4) {
				if(photo.ofFour === 4) {
					this.doc.addPage();
				}
			}
		}
	},



	addImageToDocument(dataURL, positionLeft, positionTop, imgWidth, imgHeight) {

		this.doc.addImage(
			dataURL,
			'JPEG',
			positionLeft,
			positionTop,
			imgWidth,
			imgHeight
		);
	},

	base64EncodeImage(image) {

		let hiResImage = image.href;
		let finalPhoto = document.createElement('img');
		finalPhoto.src = hiResImage;

  		let canvas = document.createElement("canvas");

  		finalPhoto.addEventListener('load', () => {
	  		canvas.width = finalPhoto.width;
	  		canvas.height = finalPhoto.height;
	  		let ctx = canvas.getContext("2d");
	  		ctx.drawImage(finalPhoto, 0, 0);
	  		let dataURL = canvas.toDataURL('image/jpeg');

	  		let imageData = {
	  			dataURL: dataURL,
	  			width: this.convertPixelsToInches(finalPhoto.width),
	  			height: this.convertPixelsToInches(finalPhoto.height),
	  			index: this.index,
	  			last: false,
	  			ofFour: this.ofFour
	  		}
	  		this.index++;
	  		this.ofFour++;
	  		if(this.ofFour > 4) {
	  			this.ofFour = 1;
	  		}

	  		this.allSelectedImages.push(imageData);

	  		console.log(imageData);
  		});
	},

	addIndicatorToLastObjectInArray() {
		console.log(this.allSelectedImages);
		var lastItemNumber = this.allSelectedImages.length - 1;
		var lastItem = this.allSelectedImages[lastItemNumber];
		lastItem.last = true;
	},

	//
	// HELPER FUNCTIONS
	//

	convertPixelsToInches(value) {
		return value / 300;
	},

	centerElement(element, full_measurement) {
		return (full_measurement - element) / 2;
	},

	convertPercentToMeasurement(percent, total) {
		return (percent * total) / 100
	},

	scaleImageProportions(original_proportion_1, new_proportion_2, old_proportion_2) {
		return (original_proportion_1 * new_proportion_2) / old_proportion_2;
	},

	makeElementClose(gutter, columnWidth, elementWidth) {
		return gutter + ( this.centerElement(elementWidth, columnWidth) );
	},

	makeElementFar(gutter, columnWidth, elementWidth) {
		return columnWidth + (gutter*2) + ( this.centerElement(elementWidth, columnWidth) );
	},

	isOdd(value) {
		if (value%2 == 0)
			return true;
		else
			return false;
	},

};



    var callback = function() {
		PDF_CREATOR.init({
			imageClass: 'tile-inner'
		});
    };

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll) ) {
  callback();
} else {
  document.addEventListener("DOMContentLoaded", callback);
}

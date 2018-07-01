
class createPDF {
	//
	// Constructor
	//
		constructor(options = {}) {
			this.options = options;
			this.init();
		};

	//
	// Initalizers
	//
		logOptions () {

			this.selectCSS = 'selected';
			this.selectJS = 'js-selected';
			this.moduleName = 'PDFCreator';
			this.selectImageObjects = [];
			this.loadedImages = [];

			const {
				orientation = 'l',
				units = 'in',
				pdfW = 11,
				pdfH = 8.5,
				limit = 50,
				imgClassName = 'pdf-image',
				button = `${this.moduleName}.Button`,
				radios = `${this.moduleName}.RadioButtons`,
				images = `${this.moduleName}.Image`,
				container = 'body',
				clear = true,
				column = 91,
				gutter = 3
			} = this.options;

			this.orientation = orientation;
			this.units = units;
			this.pdfW = pdfW;
			this.pdfH = pdfH;
			this.limit = limit;
			this.imgClassName = imgClassName;
			this.button = `[data-js="${this.moduleName}.Button"]`;
			this.radios = `[data-js="${this.moduleName}.RadioButtons"]`;
			this.images = `[data-js="${this.moduleName}.Image"]`;
			this.container = container;
			this.clear = clear;

			this.columnPercent = column;
			this.gutterPercent = gutter;

			this.column = this.convertPercent(column, this.pdfW);
			this.gutter = this.convertPercent(gutter, this.pdfW);

			this.pdfHeightHalf = this.convertPercent(50, this.pdfH);
			this.doubleGutter = this.addElements(this.gutter, this.gutter);
		};

		createObjectElements () {
			this.pdfButton = this.returnElement(this.button);
			this.pdfRadios = this.returnArray(this.radios);
			this.pdfImages = this.returnArray(this.images);
			this.page = this.returnElement(this.container);
		};

		init() {

			if (!jsPDF) {
				this.appendJSDF();
			}

			this.logOptions();
			this.createObjectElements();
			this.observeChanges();
		};

	//
	// Builders
	//
		loadImages () {
			this.selectImages();
			this.checkLimit();
			this.createFinalImages();
		};

		afterImagesLoad () {
			this.convertImagesForPDF();
			this.buildPDF();
		};

		buildPDF () {
			this.blankPDF();
			this.setPDFParams();
			this.printImages();
			this.savePDF();
			this.resetPDF();
		}

	//
	// Image Actions
	//
		selectImages() {
			this.selectedImages = this.returnArray(`.${this.selectJS}`);
			this.selectedImagesLength = this.selectedImages.length;
		};

		checkLimit() {
			if (this.selectedImagesLength >= this.limit) {
				let overage = this.subtract(this.selectedImagesLength, this.limit);

				alert(`Please remove ${overage} Images and try again.`);
				return;
			}
		};

		createFinalImages () {
			this.selectedImages.forEach((image) => {
				let finalIMG = this.createImage(image);

				if(finalIMG.width === 0 || finalIMG.height === 0) {
					finalIMG.addEventListener('load', () => {
						this.handleFinalImage(finalIMG);
					});
					return;
				} else {
					this.handleFinalImage(finalIMG);
				}


			});
		};

			createImage (image) {

				let photo = document.createElement('img');

				let hiRes = image.getAttribute('data-hi-res');

				if (hiRes) {
					photo.src = hiRes;
				}
				else if (image.href) {
					photo.src = image.href;
				}
				else if (image.src) {
					photo.src = image.src;
				}

				return photo;
			};

			handleFinalImage (image) {
				this.loadedImages.push(image);
				this.checkForLoadComplete();
			};

			checkForLoadComplete () {
				if (this.selectedImagesLength === this.loadedImages.length) {
					this.afterImagesLoad();
				}
			}

		convertImagesForPDF() {
  		this.loadedImages.forEach((image, index) => {
  			let canvas = this.createCanvas(image);
  			let imageObject = this.createImageObject(image, canvas, index);
  			this.selectImageObjects.push(imageObject);
  		});
  		this.addIndicator(this.selectImageObjects);
		};

			createCanvas(image) {
				let canvas = document.createElement("canvas");
				canvas.width = image.width;
				canvas.height = image.height;
				let ctx = canvas.getContext("2d");
				ctx.drawImage(image, 0, 0);
				let dataURL = canvas.toDataURL('image/jpeg');

				return dataURL;
			}

			createImageObject(image, canvasURL, index) {
				let imageObject = {
					url: canvasURL,
					width: this.convertPXtoIn(image.width),
					height: this.convertPXtoIn(image.height),
					index: index,
					last: false
				}
				return imageObject;
			};

			addIndicator(array) {
				let last = this.findLastIndex(array);
				array[last].last = true;
			}

	//
	// PDF Actions
	//
		blankPDF () {
			this.pdfDocument = new jsPDF({
				orientation: this.orientation,
				unit: this.units,
				format: [this.pdfW, this.pdfH]
			});
		};

		setPDFParams () {

			this.imagesPerPage = this.selectRadio();

			// This code is brittle, what if the client wants the user to be able to select more than just 1, 2 or 4 images per page?

			switch(this.imagesPerPage) {
				case 1:
					this.pdfPrintHeight = this.pdfH;
					this.pdfPrintWidth = this.column;
				break;

				case 2:
					this.pdfPrintHeight = this.pdfH;
					this.pdfPrintWidth = this.findHalf(this.column);
				break;

				case 4:
					this.pdfPrintHeight = this.findHalf(this.pdfH);
					this.pdfPrintWidth = this.findHalf(this.column);
				break;

				default:
			}
		};

		printImages() {

			this.selectImageObjects.forEach((imageObject) => {
				this.sizeImage(imageObject);
				this.positionImage(imageObject);
				this.addImageToDocument(imageObject);
				this.nextPage(imageObject);
			});
		};

			sizeImage (imageObject) {

				imageObject.printWidth = this.pdfPrintWidth;

				imageObject.printHeight = this.scaleProportions(
					imageObject.height,
					imageObject.width,
					imageObject.printWidth,
				);

				if (imageObject.printHeight >= this.pdfPrintHeight) {

					imageObject.printHeight = this.convertPercent(this.columnPercent, this.pdfPrintHeight);

					imageObject.printWidth = this.scaleProportions(
						imageObject.width,
						imageObject.height,
						imageObject.printHeight
					);
				}
			};

			positionImage (imageObject) {

				switch(this.imagesPerPage) {
					case 1:
						this.oneImagePerPage(imageObject);
					break;

					case 2:
						this.twoImagesPerPage(imageObject);
					break;

					case 4:
						this.fourImagesPerPage(imageObject);
					break;

					default:
				}
			};

				oneImagePerPage (imageObject) {
						imageObject.left = this.centerElement(imageObject.printWidth, this.pdfW);
						imageObject.top = this.centerElement(imageObject.printHeight, this.pdfH);
				};

				twoImagesPerPage (imageObject) {
					var centerWidth = this.centerElement(imageObject.printWidth, this.pdfPrintWidth);
					var farFromLeft = this.addElements(this.doubleGutter, this.pdfPrintWidth);

					let odd = this.isOdd(imageObject.index);

					if (odd) {
						imageObject.left = this.addElements(this.gutter, centerWidth);
					} else {
						imageObject.left = (farFromLeft + centerWidth);
					}

					imageObject.top = this.centerElement(imageObject.printHeight, this.pdfH);
				};

				fourImagesPerPage (imageObject) {
					var centerWidth = this.centerElement(imageObject.printWidth, this.pdfPrintWidth);
					var centerHalfHeight = this.centerElement(imageObject.printHeight, this.pdfHeightHalf);
					var farFromLeft = this.addElements(this.doubleGutter, this.pdfPrintWidth);

					let index = this.addElements(imageObject.index, 1);
					let ofFour = this.findModulus(index, 4);

					switch (ofFour) {
						case 1:
							imageObject.top = this.centerElement(imageObject.printHeight, this.pdfHeightHalf);
							imageObject.left = this.addElements(this.gutter, centerWidth);
						break;

						case 2:
							imageObject.top = this.centerElement(imageObject.printHeight, this.pdfHeightHalf);
							imageObject.left = this.addElements(farFromLeft, centerWidth);
						break;

						case 3:
							imageObject.left = this.addElements(this.gutter, centerWidth);
							imageObject.top = this.addElements(this.pdfHeightHalf, centerHalfHeight);
						break;

						case 0:
							imageObject.left = this.addElements(farFromLeft, centerWidth);
							imageObject.top = this.addElements(this.pdfHeightHalf, centerHalfHeight);
						break;

						default:
					}
				}

			addImageToDocument (imageObject) {
				this.pdfDocument.addImage(
					imageObject.url,
					'JPEG',
					imageObject.left,
					imageObject.top,
					imageObject.printWidth,
					imageObject.printHeight
				);
			};

			nextPage(imageObject) {

				if(!imageObject.last && this.imagesPerPage === 1) {
					this.pdfDocument.addPage();
				}
				else
				if (!imageObject.last && this.imagesPerPage === 2) {

					if(!this.isOdd(imageObject.index)) {
						this.pdfDocument.addPage();
					}
				}
				else
				if(!imageObject.last && this.imagesPerPage === 4) {

					let index = this.addElements(imageObject.index, 1);
					let ofFour = this.findModulus(index, 4);

					if(ofFour === 0) {
						this.pdfDocument.addPage();
					}
				}
			};

		savePDF () {
			this.pdfDocument.save('Lincoln-Barbour-Custom-PDF.pdf');
		};
		resetPDF () {

			if (this.clear) {
				this.selectedImages.forEach((image) => {
					this.classActions(image, [this.selectCSS, this.selectJS], 'remove');
				});
			}
			this.selectedImages = [];
			this.loadedImages = [];
			this.selectImageObjects = [];
		}

	// Subactions
	// -- actions that are too small to deserve a place in the timeline of events
		selectRadio () {
			for (let radio of this.pdfRadios) {
				if (radio.checked) {
					return this.convertToNumber(radio.value);
				}
			}
		};

		appendJSDF () {
			let url = 'https://unpkg.com/jspdf@latest/dist/jspdf.min.js';
			let script = document.createElement('script');
			script.src = url;
			this.container.appendChild(script);
		};

	//
	// Observers
	//
		observeChanges() {
			this.observeImages();
			this.observeButton();
		};

		observeImages () {
			this.pdfImages.forEach((image) => {
				this.classActions(image, ['everlightbox-trigger'], 'remove');
				image.addEventListener('click', (event) => {
					event.preventDefault();
					this.classActions(image, [this.selectCSS, this.selectJS], 'toggle');
				});
			});
		};

		observeButton() {
			this.pdfButton.addEventListener('click', () => this.loadImages());
		};

	//
	// Helpers
	//
		findModulus(value, modulus) {
			return value % modulus;
		};

		findHalf(value) {
			return value / 2;
		};

		findLastIndex (array) {
			return array.length - 1;
		};

		classActions (element, classNames, action) {
			classNames.forEach((className) => {
				if (action === 'remove') {
					if(element.classList.contains(className)) {
						element.classList.remove(className);
					}
				}

				if (action === 'add') {
					element.classList.add(className);
				}

				if (action === 'toggle') {
					element.classList.toggle(className);
				}

			});
		};

		returnElement (value) {
			return document.querySelector(`${value}`);
		};

		returnArray (selector, context) {
			if (!context) {
				context = document;
			}
			return Array.from(context.querySelectorAll(`${selector}`));
		};

		subtract (value1, value2) {
			return value1 - value2;
		};

		addElements (value1, value2) {
			return value1 + value2;
		};

		multiply (value1, value2) {
			return value1 * value2;
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

		convertPercent (percent, total) {
			return (percent * total) / 100;
		};

		convertPXtoIn (pixelVal) {
			// 300 = Pixels per inch when printing
			return pixelVal / 300;
		};

		centerElement (elem, full) {
			return (full - elem) / 2;
		};

		scaleProportions (origProp1, origProp2, newProp2) {
			return (origProp1 * newProp2) / origProp2;
		};
};

document.addEventListener("DOMContentLoaded", () => {
	var obj = new createPDF();
});


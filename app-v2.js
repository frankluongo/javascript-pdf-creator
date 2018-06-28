class createPDF {
	//
	// Constructor
	//
		constructor(options = {}) {

			if (options) {
				this.name = options.name;
				console.log(this.name);
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
	    	console.log("It is done.");
	    	if (true) {
	      	resolve("SUCCESS");
	    	} else {
	      	reject("FAILURE");
	    	}
	  	})
		};

	//
	// Helpers
	//

		convertToNumber (value) {
			// parses integers with a radix of 10
			return parseInt(value, 10);
		}

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

function doSomething() {
  return new Promise((resolve, reject) => {
    console.log("It is done.");
    // Succeed half of the time.
    if (Math.random() > .5) {
      resolve("SUCCESS")
    } else {
      reject("FAILURE")
    }
  })
}

function successCallback(result) {
  console.log("It succeeded with " + result);
}

function failureCallback(error) {
  console.log("It failed with " + error);
}

function nextFunc() {
	setTimeout(() => {
		console.log('huzzah!');
	}, 3000);
}

function nextNextFunc() {
	console.log('next!');
}

var promise = doSomething();
promise
	.then(successCallback, failureCallback)
	.then(() => {
		setTimeout(() => {
			console.log('huzzah!');
		}, 3000);
	})
	.then(nextNextFunc);



// const test = testFunction();


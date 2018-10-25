puzzlesApp.service("imageCrop", function($q) {
	this.cutImage = function(numCols, numRows, imgSrc) {
		var deferredObject = $q.defer();
		var image = new Image();
		image.src = imgSrc;
		image.onload = function() {
			var ratio = image.width / image.height;
			var canvasResize = document.getElementById('canvasResize');
			if (image.width < image.height) {
				canvasResize.width = 480;
				canvasResize.height = 480 / ratio;
			} else {
				canvasResize.height = 480;
				canvasResize.width = 480 * ratio;
			}
			canvasResize.getContext('2d').drawImage(image, 0, 0, canvasResize.width, canvasResize.height);
			resizedImageSrc = canvasResize.toDataURL('image/jpeg', 1.0);
			var resizedImage = new Image();
			resizedImage.src = resizedImageSrc;
			resizedImage.onload = function() {
				var imagePieces = [];
				var widthOfOnePiece = 480 / numCols;
				var heightOfOnePiece = 480 / numRows;
				for (var x = 0; x < numCols; x++) {
					for (var y = 0; y < numRows; y++) {
						var canvas = document.getElementById('canvas');
						canvas.width = widthOfOnePiece;
						canvas.height = heightOfOnePiece;
						var context = canvas.getContext('2d');
						context.drawImage(resizedImage, y * widthOfOnePiece, x * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, canvas.width, canvas.height);
						imagePieces.push(canvas.toDataURL('image/jpeg', 1.0));
					}
				}
				deferredObject.resolve(imagePieces);
			}
		}
		return deferredObject.promise;
	}
});
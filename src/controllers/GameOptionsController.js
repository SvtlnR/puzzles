puzzlesApp.controller("GameOptionsController", function($window, $scope, $location, puzzlesService, imageCrop) {
	$scope.optionsAmount = [9, 16, 25];
	$scope.pics = ["./images/img1.jpg", "./images/img2.jpeg"];
	$scope.selectedImage = $scope.pics[0];
	$scope.selectedAmount = 9;
	$scope.visibleUploader = false;
	$scope.errorMes = "";
	$scope.checkImage = function() {
		if (angular.isUndefined($scope.selectedImage)) {
			$scope.visibleUploader = true;
			return;
		}
		$scope.fileName="";
		$scope.visibleUploader = false;

	}
	$scope.uploadFile = function(files) {
		var file = files[0];
		if (!file.name.match(/.\.jpe?g/i)) {
			$scope.errorMes = "File extension has to be *.jpg, *jpeg";
			$scope.$apply();
			return;
		}
		var reader = new FileReader();
		reader.onloadend = function(event) {
			$scope.selectedImage = reader.result
		};
		if(file){
			reader.readAsDataURL(file);
		}
		$scope.fileName=file.name;
		$scope.errorMes="";
		$scope.errorStart="";
		$scope.$apply();
	}
	$scope.start = function() {
		if (angular.isUndefined($scope.selectedImage)) {
			$scope.errorStart = "You haven't chosen image";
			return;
		}
		$scope.widthDevice=480;
		if($window.outerWidth<=480){
			$scope.widthDevice=300;
		}
		if($window.outerWidth>=768 && $window.outerWidth<=959){
			$scope.widthDevice=720;
		}
		imageCrop.cutImage(Math.sqrt($scope.selectedAmount), Math.sqrt($scope.selectedAmount), $scope.selectedImage, $scope.widthDevice).then(function(imgPieces) {
			puzzlesService.savePuzzles(imgPieces);
			puzzlesService.saveOptions(Math.sqrt($scope.selectedAmount), Math.sqrt($scope.selectedAmount),$scope.widthDevice);
			puzzlesService.clearPositions();
			puzzlesService.saveTime(0);
			$location.path('/game');
		});
	}
});
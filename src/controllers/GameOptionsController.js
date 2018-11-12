puzzlesApp.controller("GameOptionsController", function($scope, $location, puzzlesService, imageCrop) {
	$scope.optionsAmount = [9, 16, 25];
	$scope.pics=["./images/img1.jpg","./images/img2.jpeg"];
	$scope.selectedImage = $scope.pics[0];
	$scope.selectedAmount = 9;
	$scope.visibleUploader=false;
	$scope.checkImage=function(){
		if(angular.isUndefined($scope.selectedImage)){
			$scope.visibleUploader=true;
			return;
		}
		$scope.visibleUploader=false;

	}
	$scope.uploadFile=function(files){
		console.log(files);
		var file=files[0];
		var reader = new FileReader();
       reader.onloadend = function(event) {
          	$scope.selectedImage=reader.result		
        };
        if(file){
        	reader.readAsDataURL(file);	
        }
	}
	$scope.start = function() {
		if($scope.visibleUploader){

		}

		imageCrop.cutImage(Math.sqrt($scope.selectedAmount), Math.sqrt($scope.selectedAmount), $scope.selectedImage).then(function(imgPieces) {
			puzzlesService.savePuzzles(imgPieces);
			puzzlesService.saveOptions(Math.sqrt($scope.selectedAmount), Math.sqrt($scope.selectedAmount));
			puzzlesService.clearPositions();
			puzzlesService.saveTime(0);
			$location.path('/game');
		});
	}
});
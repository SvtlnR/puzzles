puzzlesApp.controller("GameOptionsController", function($scope, $location, puzzlesService, imageCrop) {
	$scope.optionsAmount = [9, 16, 25];
	$scope.selectedAmount = 9;
	$scope.start = function() {
		imageCrop.cutImage(Math.sqrt($scope.selectedAmount), Math.sqrt($scope.selectedAmount), "/images/img1.jpg").then(function(imgPieces) {
			puzzlesService.savePuzzles(imgPieces);
			puzzlesService.saveOptions(Math.sqrt($scope.selectedAmount), Math.sqrt($scope.selectedAmount));
			puzzlesService.clearPositions();
			$location.path('/game');
		});
	}
});
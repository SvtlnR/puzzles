puzzlesApp.controller("MenuController", function($scope, $location,puzzlesService) {
	$scope.savedGameExists=false;
	if(puzzlesService.getPositions().length!==0){
		$scope.savedGameExists=true;
	}
	$scope.startNewGame=function(){
		puzzlesService.clearPositions();
		$location.path("/gameOptions");	
	}
	$scope.loadGame=function(){
		$location.path("/game");	
	}
});
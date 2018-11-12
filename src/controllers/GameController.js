puzzlesApp.controller("GameController", function($scope, $location, $compile, $q,$interval, puzzlesService) {
	$scope.heightCell = puzzlesService.getWidthDevice() / puzzlesService.getVerticalAmount();
	$scope.widthCell = puzzlesService.getWidthDevice() / puzzlesService.getHorizontalAmount();
	$scope.puzzles = new Array(puzzlesService.getHorizontalAmount() * puzzlesService.getVerticalAmount());
	$scope.message="";
	$scope.pausedGame=true;
	$scope.btnPlayPause="Play";
	var timer;
	pauseGame();
	var storedPuzzles = puzzlesService.getPuzzles();
	$scope.positions = puzzlesService.getPositions();
	if ($scope.positions.length === 0) {
		for (var i = 0; i < $scope.puzzles.length; i++) {
			var puzzle = {};
			puzzle["id"] = i;
			puzzle["val"] = storedPuzzles[i];
			$scope.puzzles[i] = puzzle;
		}
		shuffleArray($scope.puzzles);
		puzzlesService.savePositions($scope.puzzles);
	}
	$scope.totalTime=puzzlesService.getTotalTime();
	$scope.hours=Math.floor($scope.totalTime/3600);
	$scope.minutes=Math.floor(($scope.totalTime-$scope.hours*3600)/60);
	$scope.seconds=Math.floor($scope.totalTime-$scope.hours*3600-$scope.minutes*60);
	if($scope.seconds<10){
			$scope.seconds="0"+$scope.seconds;
	}
	if($scope.minutes<10){
			$scope.minutes="0"+$scope.minutes;
	}
	if($scope.hours<10){
			$scope.hours="0"+$scope.hours;
	}
	$scope.puzzles = $scope.positions;
	$scope.restart = function() {
		pauseGame();
		$scope.isSolved = false;
		shuffleArray($scope.puzzles);
		puzzlesService.savePositions($scope.puzzles);
		puzzlesService.saveTime(0);
		$scope.totalTime=0;
		$scope.seconds="00";
		$scope.minutes="00";
		$scope.hours="00";
		$scope.btnPlayPause="Pause";
		$scope.pausedGame=false;
		resumeGame();
	}
	$scope.pauseOrResume=function(){
		if($scope.isSolved) return;
		if(!$scope.pausedGame){
			$scope.pausedGame=true;
			pauseGame();
			$scope.btnPlayPause="Play";
			return;
		}
		$scope.pausedGame=false;
		resumeGame();	
		$scope.btnPlayPause="Pause";
	}
	$scope.goToMenu = function() {
		pauseGame();
		$location.path('/menu');
	}

	$scope.isSolved = checkIsSolved();
	var dragObject = {};
	$scope.drag = function(e) {
		if (!$scope.isSolved && Object.keys(dragObject).length === 0) {
			dragObject.elem = e.target;

			var coords = getCoordinates(dragObject.elem);
			dragObject.originalLeft = coords.left;
			dragObject.originalTop = coords.top;
			var shiftX = e.pageX - dragObject.originalLeft;
			var shiftY = e.pageY - dragObject.originalTop;
			angular.element(dragObject.elem).on("mousemove", function(event) {
				dragObject.elem.style.zIndex = 999;
				dragObject.elem.style.position = "absolute";
				dragObject.elem.style.left = event.pageX - shiftX + 'px';
				dragObject.elem.style.top = event.pageY - shiftY + 'px';
			});
			angular.element(dragObject.elem).on("mouseup", function(event) {
				angular.element(dragObject.elem).off("mousemove");
				dragObject.elem.style.zIndex = 1;
				selectedElem = findDropparbleElement(event);
				if (selectedElem && selectedElem.classList.contains("draggable")) {
					dragObject.elem.style.left = selectedElem.style.left;
					dragObject.elem.style.top = selectedElem.style.top;
					var dragObjectIndex = dragObject.elem.getAttribute("data-position");
					var selectedElemIndex = selectedElem.getAttribute("data-position");
					swapValues(dragObjectIndex, selectedElemIndex);
					puzzlesService.savePositions($scope.puzzles);
					$scope.isSolved = checkIsSolved();
					$scope.$apply();
				} else {
					dragObject.elem.style.left = dragObject.originalLeft + 'px';
					dragObject.elem.style.top = dragObject.originalTop + 'px';
				}
				dragObject = {};
			});
		}
	}
	$scope.dragPhone=function(e){
		if (!$scope.isSolved && Object.keys(dragObject).length === 0) {
			dragObject.elem = e.target;

			var coords = getCoordinates(dragObject.elem);
			dragObject.originalLeft = coords.left;
			dragObject.originalTop = coords.top;
			var shiftX = e.pageX - dragObject.originalLeft;
			var shiftY = e.pageY - dragObject.originalTop;
			angular.element(dragObject.elem).on("drag", function(event) {
				dragObject.elem.style.zIndex = 999;
				dragObject.elem.style.position = "absolute";
				dragObject.elem.style.left = event.pageX - shiftX + 'px';
				dragObject.elem.style.top = event.pageY - shiftY + 'px';
			});
			angular.element(dragObject.elem).on("dragend", function(event) {
				angular.element(dragObject.elem).off("drag");
				dragObject.elem.style.zIndex = 1;
				selectedElem = findDropparbleElement(event);
				if (selectedElem && selectedElem.classList.contains("draggable")) {
					dragObject.elem.style.left = selectedElem.style.left;
					dragObject.elem.style.top = selectedElem.style.top;
					var dragObjectIndex = dragObject.elem.getAttribute("data-position");
					var selectedElemIndex = selectedElem.getAttribute("data-position");
					swapValues(dragObjectIndex, selectedElemIndex);
					puzzlesService.savePositions($scope.puzzles);
					$scope.isSolved = checkIsSolved();
					$scope.$apply();
				} else {
					dragObject.elem.style.left = dragObject.originalLeft + 'px';
					dragObject.elem.style.top = dragObject.originalTop + 'px';
				}
				dragObject = {};
			});
		}
	}
	function pauseGame(){
		$interval.cancel(timer);
		timer=null;
	}
	function resumeGame(){
		$scope.totalTime=puzzlesService.getTotalTime();
		timer=$interval(timerFunc,1000);
	}
	function timerFunc(){
		$scope.seconds=Number($scope.seconds);
		$scope.minutes=Number($scope.minutes);
		$scope.hours=Number($scope.hours);
		$scope.seconds++;
		if($scope.seconds===60){
			$scope.seconds=0;
			$scope.minutes++;
			if($scope.minutes===60){
				$scope.minutes=0;
				$scope.hours++;
				if($scope.hours===24){
					$scope.hours=0;
				}
			}
		}
		$scope.totalTime=$scope.seconds+$scope.minutes*60+$scope.hours*3600;
		puzzlesService.saveTime($scope.totalTime);
		if($scope.seconds<10){
			$scope.seconds="0"+$scope.seconds;
		}
		if($scope.minutes<10){
			$scope.minutes="0"+$scope.minutes;
		}
		if($scope.hours<10){
			$scope.hours="0"+$scope.hours;
		}		
	}
	function findDropparbleElement(e) {
		dragObject.elem.style.visibility = "hidden";
		var elem = document.elementFromPoint(e.clientX, e.clientY);
		dragObject.elem.style.visibility = "visible";
		if (elem.closest('.droppable')) {
			return elem;
		}
		return null;
	}

	function checkIsSolved() {
		for (var i = 0; i < $scope.positions.length; i++) {
			if ($scope.positions[i]["id"] !== i) {
				return false;
			}
		}
		pauseGame();
		puzzlesService.saveRecordTime($scope.totalTime);
		$scope.recordTime=puzzlesService.getRecordTime();
		$scope.recordHours=Math.floor($scope.recordTime/3600);
		$scope.recordMinutes=Math.floor(($scope.recordTime-$scope.recordHours*3600)/60);
		$scope.recordSeconds=Math.floor($scope.recordTime-$scope.recordHours*3600-$scope.recordMinutes*60);
		if($scope.recordSeconds<10){
				$scope.recordSeconds="0"+$scope.recordSeconds;
		}
		if($scope.recordMinutes<10){
				$scope.recordMinutes="0"+$scope.recordMinutes;
		}
		if($scope.recordHours<10){
				$scope.recordHours="0"+$scope.recordHours;
		}
		$scope.message="Puzzle is solved. Your record time "+$scope.recordHours+":"+$scope.recordMinutes+":"+$scope.recordSeconds;
		return true;
	}

	function swapValues(index1, index2) {
		var temp = $scope.puzzles[index1];
		$scope.puzzles[index1] = $scope.puzzles[index2];
		$scope.puzzles[index2] = temp;
	}

	function shuffleArray(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}

	function getCoordinates(elem) {
		var box = elem.getBoundingClientRect();
		return {
			top: box.top + pageYOffset,
			left: box.left + pageXOffset
		};
	}
});
puzzlesApp.controller("GameController", function($scope, $location, $compile, $q, puzzlesService) {
	$scope.heightCell = 480 / puzzlesService.getVerticalAmount();
	$scope.widthCell = 480 / puzzlesService.getHorizontalAmount();
	$scope.puzzles = new Array(puzzlesService.getHorizontalAmount() * puzzlesService.getVerticalAmount());
	$scope.message="Puzzle is solved";
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
	$scope.puzzles = $scope.positions;
	$scope.restart = function() {
		$scope.isSolved = false;
		shuffleArray($scope.puzzles);
		puzzlesService.savePositions($scope.puzzles);
	}
	$scope.goToMenu = function() {
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
		for (var i = 0; i < $scope.puzzles.length; i++) {
			if ($scope.puzzles[i]["id"] !== i) {
				return false;
			}
		}
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
	}

	function getCoordinates(elem) {
		var box = elem.getBoundingClientRect();
		return {
			top: box.top + pageYOffset,
			left: box.left + pageXOffset
		};
	}
});
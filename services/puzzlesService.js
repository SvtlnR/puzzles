puzzlesApp.service("puzzlesService", function($window) {
	var storedOptions = sessionStorage.getItem("options");
	var options = storedOptions ? JSON.parse(storedOptions) : [];
	var storedPositions = sessionStorage.getItem("positions");
	var positions = storedPositions ? JSON.parse(storedPositions) : [];
	var storedPuzzles = sessionStorage.getItem("puzzles");
	var puzzles = storedPuzzles ? JSON.parse(storedPuzzles) : [];
	this.saveOptions = function(horizontalAmount, verticalAmount) {
		if (options.length != 0) {
			options = [];
		}
		options.push({
			horizontalAmount: horizontalAmount,
			verticalAmount: verticalAmount,
		});
		syncStorageOptions();
	}
	this.getHorizontalAmount = function() {
		return options[0]["horizontalAmount"];
	}
	this.getVerticalAmount = function() {
		return options[0]["verticalAmount"];
	}
	this.getPuzzles = function() {
		return puzzles;
	}
	this.savePositions = function(newPositions) {
		if (positions.length != 0) {
			positions = [];
		}
		positions = newPositions;
		syncStoragePositions();
	}
	this.savePuzzles = function(newPuzzles) {
		if (puzzles.length != 0) {
			puzzles = [];
		}
		puzzles = newPuzzles;
		syncStoragePuzzles();
	}
	this.getPositions = function() {
		return positions;
	}
	this.clearPositions = function() {
		positions = [];
		syncStoragePositions;
	}

	function syncStorageOptions() {
		sessionStorage.setItem("options", JSON.stringify(options));
	}

	function syncStoragePositions() {
		sessionStorage.setItem("positions", JSON.stringify(positions));
	}

	function syncStoragePuzzles() {
		sessionStorage.setItem("puzzles", JSON.stringify(puzzles));
	}
});
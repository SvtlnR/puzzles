puzzlesApp.service("puzzlesService", function($window,$interval) {
	var storedOptions = localStorage.getItem("options");
	var options = storedOptions ? JSON.parse(storedOptions) : [];
	var storedPositions = localStorage.getItem("positions");
	var positions = storedPositions ? JSON.parse(storedPositions) : [];
	var storedPuzzles = localStorage.getItem("puzzles");
	var puzzles = storedPuzzles ? JSON.parse(storedPuzzles) : [];
	var storedTotalTime=localStorage.getItem("totalTime");
	var totalTime=storedTotalTime?Number(storedTotalTime):0;
	var storedRecordTime=localStorage.getItem("recordTime");
	var recordTime=storedRecordTime?JSON.parse(storedRecordTime) : {};
	this.saveOptions = function(horizontalAmount, verticalAmount, widthDevice) {
		if (options.length !== 0) {
			options = [];
		}
		options.push({
			widthDevice: widthDevice,
			horizontalAmount: horizontalAmount,
			verticalAmount: verticalAmount,
		});
		syncStorageOptions();
	}
	this.getWidthDevice=function(){
		return options[0]["widthDevice"];
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
		if (positions.length !== 0) {
			positions = [];
		}
		positions = newPositions;
		syncStoragePositions();
	}
	this.savePuzzles = function(newPuzzles) {
		if (puzzles.length !== 0) {
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
		syncStoragePositions();
	}
	this.getRecordTime=function(){
		var amount=Number(options[0]["horizontalAmount"])*Number(options[0]["verticalAmount"]);
		var index="amount_"+amount;
		return recordTime[index];
	}
	this.saveRecordTime=function(newTime){
		var amount=Number(options[0]["horizontalAmount"])*Number(options[0]["verticalAmount"]);
		var index="amount_"+amount;
		if(angular.isUndefined(recordTime[index])||recordTime[index]===0||newTime<Number(recordTime[index])){
			recordTime[index]=newTime;
			syncRecordTime();
		}
	}
	this.getTotalTime=function(){
		return totalTime;
	}
	this.saveTime=function(newTime){
		totalTime=newTime;
		syncTime();
	}
	function syncTime(){
		localStorage.setItem("totalTime", totalTime);
	}
	function syncRecordTime(){
		localStorage.setItem("recordTime", JSON.stringify(recordTime));
	}
	function syncStorageOptions() {
		localStorage.setItem("options", JSON.stringify(options));
	}

	function syncStoragePositions() {
		localStorage.setItem("positions", JSON.stringify(positions));
	}

	function syncStoragePuzzles() {
		localStorage.setItem("puzzles", JSON.stringify(puzzles));
	}
});
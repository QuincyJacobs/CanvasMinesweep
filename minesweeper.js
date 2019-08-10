$(function(){
	
	// sizes: 20, 25, 40, 50 100
	// good combinations: 
	// s: 50, m: 100	hard
	var squareSize = 30;
	var squareSizes = [200, 150, 120, 100, 80, 60, 50, 40, 30, 25, 20];
	var mineAmount = 150;
	var mineAmounts = [4, 10, 25, 50, 100, 150, 200, 250, 300, 400, 600];
	var flagAmount = 0;
	var squares = [];
	var mouse;
	var potentialSquareSize = squareSize;
	var potentialMineAmount = mineAmount;
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var rowSize = Math.floor(canvas.width / squareSize);
	var columnSize = Math.floor(canvas.height / squareSize);
	
	var COLOR_BLACK 		= "#000000";
	var COLOR_GREY  		= "#888888";
	var COLOR_LIGHT_GREY 	= "#DDDDDD";
	var COLOR_WHITE 		= "#FFFFFF";
	var COLOR_RED			= "#FF0000";
	var COLOR_NUMBER_1  	= "#0033CC";
	var COLOR_NUMBER_2  	= "#33CCFF";
	var COLOR_NUMBER_3  	= "#00FF99";
	var COLOR_NUMBER_4  	= "#00CC00";
	var COLOR_NUMBER_5  	= "#FFFF00";
	var COLOR_NUMBER_6  	= "#FF6600";
	var COLOR_NUMBER_7  	= "#CC0066";
	var COLOR_NUMBER_8  	= "#FF0000";
	
	function setup() {
		if((rowSize * columnSize) <= mineAmount)
		{
			alert("Too many mines or not enough squares in the grid");
		}
		else
		{
			createSquares();
			setMines();
			flagAmount = 0;
			$("#mine_counter_number").html(mineAmount - flagAmount);
		}
	}
	
	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawSquares();
	}
	
	function drawSquares() {
		for(var i = 0; i < squares.length; i++) {
			squares[i].draw();
		}
		console.log(squares.length);
	}
	
	function createSquares() {
		squares = [];
		for(var i = 0; i < columnSize; i++){
			for(var j = 0; j < rowSize; j++){
				createSquare(squareSize, j, i);
			}
		}
	}
	
	function createSquare(size, x, y) {
		var square = new Square(squareSize);
		square.setPosition(x, y);
		squares.push(square);
	}
	
	function setMines(){
		var arr = [];
		
		while(arr.length < mineAmount){
			var randomnumber = Math.ceil(Math.random()*squares.length);
			if(arr.indexOf(randomnumber-1) > -1) continue;
			arr[arr.length] = randomnumber-1;
		}
		
		for(var i = 0; i < arr.length; i++) {
			squares[arr[i]].state = 9;
			setAdjacentNumbers(arr[i]);
		}
	}
	
	function setAdjacentNumbers(minePosition){
		var neighbours = getExistingNeighboursArray(minePosition);
		
		for(var i = 0; i < neighbours.length; i++){
			if(neighbours[i] > -1){ squares[neighbours[i]].increaseState(); }
		}
	}
	
	function getExistingNeighboursArray(arrayPosition){
		
		// position numbers:
		// 0 1 2
		// 7 * 3
		// 6 5 4
		
		var existingNeighbours = [true, true, true, true, true, true, true, true];
		var neighbours = [];
		
		// find if neighbours exist (as border mines miss a few neighbours)
		if(arrayPosition < rowSize) { // top
			existingNeighbours[0] = false;
			existingNeighbours[1] = false;
			existingNeighbours[2] = false;
		}
		if(arrayPosition % rowSize == rowSize-1){ // right
			existingNeighbours[2] = false;
			existingNeighbours[3] = false;
			existingNeighbours[4] = false;
		}
		if(arrayPosition >= (rowSize * columnSize - rowSize)){ // bottom
			existingNeighbours[4] = false;
			existingNeighbours[5] = false;
			existingNeighbours[6] = false;
		}
		if(arrayPosition % rowSize == 0){ // left
			existingNeighbours[0] = false;
			existingNeighbours[6] = false;
			existingNeighbours[7] = false;
		}
		
		// set neighbour array position or set -1 if not present
		if(existingNeighbours[0]){ neighbours[0] = arrayPosition-rowSize-1; } else { neighbours[0] = -1; }
		if(existingNeighbours[1]){ neighbours[1] = arrayPosition-rowSize; } else { neighbours[1] = -1; }
		if(existingNeighbours[2]){ neighbours[2] = arrayPosition-rowSize+1; } else { neighbours[2] = -1; }
		if(existingNeighbours[3]){ neighbours[3] = arrayPosition+1; } else { neighbours[3] = -1; }
		if(existingNeighbours[4]){ neighbours[4] = arrayPosition+rowSize+1; } else { neighbours[4] = -1; }
		if(existingNeighbours[5]){ neighbours[5] = arrayPosition+rowSize; } else { neighbours[5] = -1; }
		if(existingNeighbours[6]){ neighbours[6] = arrayPosition+rowSize-1; } else { neighbours[6] = -1; }
		if(existingNeighbours[7]){ neighbours[7] = arrayPosition-1; } else { neighbours[7] = -1; }
		
		return neighbours;
	}
	
	
	// Square class
	{
		function Square (size) {
			this.width = size;
			this.height = size;
			this.x = 0;
			this.y = 0;
			this.state = 0; // 0: empty field; 1-8: numbered fields; 9: mine;
			this.checked = false;
			this.flagged = false;
		}
		Square.prototype.setPosition = function(x, y) {
			this.x = x * squareSize;
			this.y = y * squareSize;
		}
		Square.prototype.getPosition = function () {
			return ('x: ' + this.x * squareSize + ' - y: ' + this.y * squareSize);
		}
		Square.prototype.increaseState = function () {
			if(this.state < 8){
				this.state++;
			}
		}
		Square.prototype.draw = function() {
			// outer border
			ctx.fillStyle = COLOR_BLACK;
			ctx.fillRect(this.x, this.y, this.width, this.height);
			
			// inner border
			ctx.fillStyle = COLOR_GREY;
			ctx.fillRect(this.x+1, this.y+1, this.width-2, this.height-2);
			
			// field
			if(this.checked){
				switch(this.state){
					case 0: // field without adjacent mines
						break;
					case 1: // field with 1 adjacent mine
						ctx.fillStyle = COLOR_NUMBER_1;
						ctx.fillRect(this.x+5, this.y+5, this.width-10, this.height-10);
						ctx.fillStyle = COLOR_BLACK;
						ctx.font = ""+(squareSize-10)+"pt sans-serif";
						ctx.textAlign="center"; 
						ctx.fillText("1", this.x + (squareSize / 2), this.y + squareSize - 5);
						break;
					case 2: // field with 2 adjacent mines
						ctx.fillStyle = COLOR_NUMBER_2;
						ctx.fillRect(this.x+5, this.y+5, this.width-10, this.height-10);
						ctx.fillStyle = COLOR_BLACK;
						ctx.font = ""+(squareSize-10)+"pt sans-serif";
						ctx.textAlign="center"; 
						ctx.fillText("2", this.x + (squareSize / 2), this.y + squareSize - 5);
						break;
					case 3: // field with 3 adjacent mines
						ctx.fillStyle = COLOR_NUMBER_3;
						ctx.fillRect(this.x+5, this.y+5, this.width-10, this.height-10);
						ctx.fillStyle = COLOR_BLACK;
						ctx.font = ""+(squareSize-10)+"pt sans-serif";
						ctx.textAlign="center"; 
						ctx.fillText("3", this.x + (squareSize / 2), this.y + squareSize - 5);
						break;
					case 4: // field with 4 adjacent mines
						ctx.fillStyle = COLOR_NUMBER_4;
						ctx.fillRect(this.x+5, this.y+5, this.width-10, this.height-10);
						ctx.fillStyle = COLOR_BLACK;
						ctx.font = ""+(squareSize-10)+"pt sans-serif";
						ctx.textAlign="center"; 
						ctx.fillText("4", this.x + (squareSize / 2), this.y + squareSize - 5);
						break;
					case 5: // field with 5 adjacent mines
						ctx.fillStyle = COLOR_NUMBER_5;
						ctx.fillRect(this.x+5, this.y+5, this.width-10, this.height-10);
						ctx.fillStyle = COLOR_BLACK;
						ctx.font = ""+(squareSize-10)+"pt sans-serif";
						ctx.textAlign="center"; 
						ctx.fillText("5", this.x + (squareSize / 2), this.y + squareSize - 5);
						break;
					case 6: // field with 6 adjacent mines
						ctx.fillStyle = COLOR_NUMBER_6;
						ctx.fillRect(this.x+5, this.y+5, this.width-10, this.height-10);
						ctx.fillStyle = COLOR_BLACK;
						ctx.font = ""+(squareSize-10)+"pt sans-serif";
						ctx.textAlign="center"; 
						ctx.fillText("6", this.x + (squareSize / 2), this.y + squareSize - 5);
						break;
					case 7: // field with 7 adjacent mines
						ctx.fillStyle = COLOR_NUMBER_7;
						ctx.fillRect(this.x+5, this.y+5, this.width-10, this.height-10);
						ctx.fillStyle = COLOR_BLACK;
						ctx.font = ""+(squareSize-10)+"pt sans-serif";
						ctx.textAlign="center"; 
						ctx.fillText("7", this.x + (squareSize / 2), this.y + squareSize - 5);
						break;
					case 8: // field with 8 adjacent mines
						ctx.fillStyle = COLOR_NUMBER_8;
						ctx.fillRect(this.x+5, this.y+5, this.width-10, this.height-10);
						ctx.fillStyle = COLOR_BLACK;
						ctx.font = ""+(squareSize-10)+"pt sans-serif";
						ctx.textAlign="center"; 
						ctx.fillText("8", this.x + (squareSize / 2), this.y + squareSize - 5);
						break;
					case 9: // mine
						ctx.fillStyle = COLOR_BLACK;
						ctx.fillRect(this.x+5, this.y+5, this.width-10, this.height-10);
						ctx.fillStyle = COLOR_RED;
						ctx.font = ""+(squareSize-10)+"pt sans-serif";
						ctx.textAlign="center"; 
						ctx.fillText('\u2622', this.x + (squareSize / 2), this.y + squareSize - 5);
						break;
					default:
						console.log("An error has occured in setting the state of a square");
				}
			} else if (this.flagged) { // flagged field
				ctx.fillStyle = COLOR_RED;
				ctx.fillRect(this.x+5, this.y+5, this.width-10, this.height-10);
			} else { // default field
				ctx.fillStyle = COLOR_LIGHT_GREY;
				ctx.fillRect(this.x+5, this.y+5, this.width-10, this.height-10);
			}
		}
	}
	// End of Square class
	
	
	// User interaction
	$("#reset_button").click(function(){
		squareSize = potentialSquareSize;
		mineAmount = potentialMineAmount;
		rowSize = Math.floor(canvas.width / squareSize);
		columnSize = Math.floor(canvas.height / squareSize);
		setup();
		draw();
	});
	
	$(canvas).on('contextmenu', function(e){ return false; });
	
	$(canvas).mousedown(function(e) {
		var rect = canvas.getBoundingClientRect();
		var mouseX = e.clientX - rect.left;
		var mouseY = e.clientY - rect.top;
		var squareArrayPosition = getSquareArrayPosition(mouseX, mouseY);
		var affectedSquare = squares[squareArrayPosition];
		
		switch (e.which) {
			case 1: // left
				if(!affectedSquare.flagged){
					checkSquare(squareArrayPosition);
				}
				break;
			case 2: // middle
				break;
			case 3: // right
				flagSquare(affectedSquare);
				break;
			default:
				alert('You have a strange Mouse!');
		}
	});
	
	function getSquareArrayPosition(x, y) {
		var squareRow = ((x - (x%squareSize)) / squareSize);
		var squareColumn = ((y - (y%squareSize)) / squareSize);
		var arrayPosition = squareRow + (squareColumn * rowSize);
		return arrayPosition;
	}
	
	function checkSquare(squareArrayPosition){
		var square = squares[squareArrayPosition];
		if(!square.checked){
			if(square.flagged) { flagSquare(square); }
			square.checked = true;
			square.draw();
			if(square.state == 0){
				var neighbours = getExistingNeighboursArray(squareArrayPosition);
				for(var i = 0; i < neighbours.length; i++){
					if(neighbours[i] > -1){ checkSquare(neighbours[i]); }
				}
			}
			if(square.state == 9){
				loseGame();
			} else {
				if(winCheck()){
					winGame();
				}
			}
		}
	}
	
	function flagSquare(square){
		if(!square.checked){
			square.flagged = !square.flagged;
			square.flagged ? flagAmount += 1 : flagAmount -= 1;
			square.draw();
			$("#mine_counter_number").html(mineAmount - flagAmount);
			if((mineAmount - flagAmount) == 0){
				if(winCheck()){
					winGame();
				}
			}
		}
	}
	
	function winCheck(){
		var minesFlagged = 0;
		var squaresChecked = 0;
		for (var i = 0; i < squares.length; i++){
			if(squares[i].checked){ squaresChecked++; }
			if(squares[i].state == 9 && squares[i].flagged){ minesFlagged++; }
		}
		var wonGame = (minesFlagged == mineAmount) && (minesFlagged + squaresChecked == squares.length);
		return wonGame;
	}
	
	function winGame(){
		for (var i = 0; i < squares.length; i++){
			if(squares[i].state > 9){ squares[i].checked = true; }
		}
		alert("You win");
	}
	
	function loseGame(){
		for (var i = 0; i < squares.length; i++){
			squares[i].checked = true;
		}
		draw();
	}

	setup();
	draw();

	
	// OPTIONS MENU

	$('#square_range_number').text(rowSize * columnSize);
	document.getElementById("square_range").value = squareSizes.indexOf(squareSize);
	$('#mine_range_number').text(mineAmount);
	document.getElementById("mine_range").value = mineAmounts.indexOf(mineAmount);
	
	$('#square_range').on("input change", function() {
		potentialSquareSize = squareSizes[this.value];
		var amountOfSquares = (Math.floor(canvas.width / squareSizes[this.value]) * Math.floor(canvas.height / squareSizes[this.value]));
		$('#square_range_number').text(amountOfSquares);
	});

	$('#mine_range').on("input change", function() {
		potentialMineAmount = mineAmounts[this.value];
		$('#mine_range_number').text(potentialMineAmount);
	});
});
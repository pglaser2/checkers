angular.module('ngCheckers', [])
	
	.controller('checkersCtrl', function($scope, $timeout) {
		var RED = "Red", BLACK = "Black", BOARD_WIDTH = 8; 
			selectedSquare = null;
		
		function Piece(player, x, y) {
			this.player = player;
			this.x = x;
			this.y = y;
			this.isKing = false;
			this.isChoice = false;
			this.matados = [];
		}
		
		$scope.newGame = function() {
			$scope.player = RED;
			$scope.redScore = 0;
			$scope.blackScore = 0;
			
			$scope.board = [];
			for(var i = 0; i < BOARD_WIDTH; i++){
				$scope.board[i] = [];
				for(var j = 0; j < BOARD_WIDTH; j++){
					if((i === 0 && j % 2 === 0) || (i === 1 && j % 2 === 1)) {
						$scope.board[i][j] = new Piece(BLACK, j, i);
					} else if ((i === BOARD_WIDTH - 2 && j % 2 === 0) || ( i === BOARD_WIDTH - 1 && j % 2 === 1)){
						$scope.board[i][j] = new Piece(RED, j, i);
					} else {
						$scope.board[i][j] = new Piece(null, j, i);
					}
				}
			}
		}
		$scope.newGame();
		
		$scope.setStyling = function(square) {
			if(square.player === RED)
				return{"backgroundColor": "#FF0000"};
			else if(square.player === BLACK)
				return {"backgroundColor": "#A3A3A3"};
			return {"backgroundColor": "none"};
		}
		
		$scope.setClass = function(square) {
			if(square.y % 2 === 0) {
				if(square.x % 2 === 0) {
					return{"backgroundColor": square.isChoice ? "green" : "black"};
				} else{
					return{"backgroundColor": "white"};
				}
			} else {
				if(square.x % 2 === 1) {
					return{"backgroundColor": square.isChoice ? "green" : "black"};
				} else {
					return {"backgroundColor": "white"};
				}
			}
		}
	});
			
			
			
			
		
						

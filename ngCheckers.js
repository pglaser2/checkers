angular.module("ngCheckers", [])

  .controller("checkersCtrl", function ($scope, $timeout) {
    var RED = "Red",
      BLACK = "Black",
      BOARD_WIDTH = 8;
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
      for (var i = 0; i < BOARD_WIDTH; i++) {
        $scope.board[i] = [];
        for (var j = 0; j < BOARD_WIDTH; j++) {
          if ((i === 0 && j % 2 === 0) || (i === 1 && j % 2 === 1)) {
            $scope.board[i][j] = new Piece(BLACK, j, i);
          } else if (
            (i === BOARD_WIDTH - 2 && j % 2 === 0) ||
            (i === BOARD_WIDTH - 1 && j % 2 === 1)
          ) {
            $scope.board[i][j] = new Piece(RED, j, i);
          } else {
            $scope.board[i][j] = new Piece(null, j, i);
          }
        }
      }
    };
    $scope.newGame();

    $scope.setStyling = function(square) {
      if (square.player === RED) return { backgroundColor: "#FF0000" };
      else if (square.player === BLACK) return { backgroundColor: "#A3A3A3" };
      return { backgroundColor: "none" };
    };

    $scope.setClass = function(square) {
      if (square.y % 2 === 0) {
        if (square.x % 2 === 0) {
          return { backgroundColor: square.isChoice ? "green" : "black" };
        } else {
          return { backgroundColor: "white" };
        }
      } else {
        if (square.x % 2 === 1) {
          return { backgroundColor: square.isChoice ? "green" : "black" };
        } else {
          return { backgroundColor: "white" };
        }
      }
    };

    $scope.select = function(square) {
      if (selectedSquare !== null && !square.player) {
        movePiece(square);
        resetChoices();
      } else if (square.player === $scope.player) {
        selectedSquare = square;
        resetChoices();
        setChoices(selectedSquare.x, selectedSquare.y, 1, [], -1, -1);
      } else {
        selectedSquare = null;
      }
      console.log($scope.board);
    };

    // Change the score
    function addScore(player) {
      // check the players color
      if (player === RED) {
        // pre-increase the players score and check if he won afterwars
        checkScore(++$scope.redScore, player);
      } else {
        // pre-increase the players score and check if he won afterwars
        checkScore(++$scope.blackScore, player);
      }
    }

    function checkScore(score, player) {
      // check if the score reached the goal
      if (score === BOARD_WIDTH) {
        // wait 200ms so you can see the piece move
        setTimeout(function () {
          // alert the winner
          alert(player + " wins!");
        }, 200);
      }
      // else do nothing
    }

    function resetChoices() {
      for (var i = 0; i < BOARD_WIDTH; i++) {
        for (var j = 0; j < BOARD_WIDTH; j++) {
          $scope.board[i][j].isChoice = false;
          $scope.board[i][j].matados = [];
        }
      }
    }

    function movePiece(square) {
      if (square.isChoice) {
		  var becomeKing = selectedSquare.isKing; //King Check
        // check if a piece was jumped over
        for(var i = 0; i < square.matados.length; i++) {
          // for each piece in the matados array
          square.matados.forEach((piece) => {
            // remove the piece
            piece.player = null;
            // increase the score of the current player
            addScore(selectedSquare.player);
          });
		  var matado = square.matados[i];
		  becomeKing = becomeKing || becomeKingAfterJump(matado.x, matado.y);
		  
        }
        square.player = selectedSquare.player;
		square.isKing = becomeKing || isKing(square);
        selectedSquare.player = null;
		selectedSquare.isKing = false;
        $scope.player = $scope.player === RED ? BLACK : RED;
      }
    }
	
	function isKing(square){
		if($scope.player === RED) {
			if(square.y === 0)
				return true;
		} else {
			if(square.y === BOARD_WIDTH - 1)
				return true;
		}
		return false;
	}
	
	function becomeKingAfterJump(x, y){
		return($scope.player === RED && y == 1) ||
			   ($scope.player === BLACK && y == BOARD_WIDTH - 2);
	}
	

    function setChoices(x, y, depth, matados, oldX, oldY, isKing) {
      if (depth > 10) return;
      isKing = isKing || 
				($scope.player === RED && y == 0) || 
				($scope.player === BLACK && y == BOARD_WIDTH - 1);
      if ($scope.player === RED || isKing) {
        //check left side, a square might not be available
        //Upper Left
        // check if the Piece is already at the TOP end of the board
        if (x > 0 && y > 0) {
          // define the square in the top left as UP_LEFT
          var UP_LEFT = $scope.board[y - 1][x - 1];
          // check if UP_LEFT contains a player's piece, UP_LEFT.palyer is defined
          if (UP_LEFT.player) {
            // check if the player who owns position UP_LEFT is NOT the scope-player respectively the opponent
            if (UP_LEFT.player !== $scope.player) {
              // check if a jump over the opponent is possible respectively the players piece is at least two rows (y > 1) and two columns (x > 1)  (apart from the top-left-corner of the board AND destination is NOT the position the piece comes from ?) not sure about that one
              if (x > 1 && y > 1 && !(x - 2 === oldX && y - 2 === oldY)) {
                // define the destination-square of the possible jump as UP_LEFT_2
                var UP_LEFT_2 = $scope.board[y - 2][x - 2];
                // check if UP_LEFT_2 is NOT owned by any player
                if (!UP_LEFT_2.player) {
                  // set UP_LEFT_2 as a possible choice
                  UP_LEFT_2.isChoice = true;
                  // create a full copy of the matados array and define it as jumpers
                  var jumpers = matados.slice(0);
                  // check if the opponents piece located in UP_LEFT is included in the jumpers array, if not push it into it
                  if (jumpers.indexOf(UP_LEFT) === -1) 
					  jumpers.push(UP_LEFT);
                  // reference the jumpers array by the squares matados variable
                  UP_LEFT_2.matados = jumpers;
                  setChoices(x - 2, y - 2, depth + 1, jumpers, x, y, isKing);
                }
              }
            }
          } else if (depth === 1) {
            UP_LEFT.isChoice = true;
          }
        }

        //Upper Right
        if (x < BOARD_WIDTH - 1 && y > 0) {
          var UP_RIGHT = $scope.board[y - 1][x + 1];
          if (UP_RIGHT.player) {
            if (UP_RIGHT.player !== $scope.player) {
              if (
                x < BOARD_WIDTH - 2 &&
                y > 1 &&
                !(x + 2 === oldX && y - 2 === oldY)
              ) {
                var UP_RIGHT_2 = $scope.board[y - 2][x + 2];
                if (!UP_RIGHT_2.player) {
                  UP_RIGHT_2.isChoice = true;
                  var jumpers = matados.slice(0);
                  if (jumpers.indexOf(UP_RIGHT) === -1) jumpers.push(UP_RIGHT);
                  UP_RIGHT_2.matados = jumpers;
                  setChoices(x + 2, y - 2, depth + 1, jumpers, x, y, isKing);
                }
              }
            }
          } else if (depth === 1) {
            UP_RIGHT.isChoice = true;
          }
        }
      }

      //Lower Choices
      if ($scope.player === BLACK || isKing) {
        //Lower Left
        if (x > 0 && y < BOARD_WIDTH - 1) {
          var LOWER_LEFT = $scope.board[y + 1][x - 1];
          if (LOWER_LEFT.player) {
            if (LOWER_LEFT.player !== $scope.player) {
              if (x > 1 &&y < BOARD_WIDTH - 2 &&!(x - 2 === oldX && y + 2 === oldY)) {
                var LOWER_LEFT_2 = $scope.board[y + 2][x - 2];
                if (!LOWER_LEFT_2.player) {
                  LOWER_LEFT_2.isChoice = true;
                  var jumpers = matados.slice(0);
                  if (jumpers.indexOf(LOWER_LEFT) === -1)
                    jumpers.push(LOWER_LEFT);
                  LOWER_LEFT_2.matados = jumpers;
                  setChoices(x - 2, y + 2, depth + 1, jumpers, x, y, isKing);
                }
              }
            }
          } else if (depth === 1) {
            LOWER_LEFT.isChoice = true;
          }
        }

        //Lower Right
        if (x < BOARD_WIDTH - 1 && y < BOARD_WIDTH - 1) {
          var LOWER_RIGHT = $scope.board[y + 1][x + 1];
          if (LOWER_RIGHT.player) {
            if (LOWER_RIGHT.player != $scope.player) {
              if (
                x < BOARD_WIDTH - 2 &&
                y < BOARD_WIDTH - 2 &&
                !(x + 2 === oldX && y + 2 === oldY)
              ) {
                var LOWER_RIGHT_2 = $scope.board[y + 2][x + 2];
                if (!LOWER_RIGHT_2.player) {
                  LOWER_RIGHT_2.isChoice = true;
                  var jumpers = matados.slice(0);
                  // bugfix
                  if (jumpers.indexOf(LOWER_RIGHT) === -1)
                    jumpers.push(LOWER_RIGHT);
                  LOWER_RIGHT_2.matados = jumpers;
                  setChoices(x + 2, y + 2, depth + 1, jumpers, x, y, isKing);
                }
              }
            }
          } else if (depth === 1) {
            LOWER_RIGHT.isChoice = true;
          }
        }
      }
    }
  });
			
			
			
			
		
						

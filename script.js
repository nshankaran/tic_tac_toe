(function() {
    var count = 0;
    var winningCombination = [];

    var players = {
        playerX: {
            name: "Player X",
            value: "X"
        },
        playerO: {
            name: "Player O",
            value: "O"
        }
    };

    // Forward declaring due to circular dependency
    var onButtonClick;

    /**
     * Reset the game, enabling the click event handlers again.
     */
    var resetGame = function() {
        count = 0;
        winningCombination = [];
        var inputElements = document.getElementsByTagName('input');
        var i;
        for(i=0; i < inputElements.length; i++) {
            var elem = inputElements[i];
            elem.value = '';
            elem.classList.remove("winner");
            elem.addEventListener('click', onButtonClick, false);
        }
    };

    /**
     * End the game and ask the user if she wants to play again.
     */
    var endGame = function() {
        var pressedOk = confirm("Do you want to play again?");
        if(pressedOk) {
            resetGame();
        }
    };

    /**
     * Declare a winner and end the game.
     */
    var declareWinner = function(playerName) {
        winningCombination.forEach(function(element) {
            element.className += ' winner'
        });

        alert(playerName + " is the winner");
        endGame();
    };

    /**
     * Declare a tie and end the game as no more moves left.
     */
    var declareTie = function() {
        alert("It was a tie.");
        endGame();
    };

    /**
     * Perform row checks.
     * @param {Number} rowNumber The first encountered row number.
     * @param {Array} arr The array containing IDs of all buttons checked by the players.
     * @returns {Boolean} Whether a match is found horizontally.
     */
    var checkHorizontally = function(rowNumber, arr) {
        var testPassed = false;
        var str = rowNumber.toString() + "-";
        if(rowNumber === 0) {
            testPassed = arr.indexOf(str + (rowNumber)) !== -1 &&
                   arr.indexOf(str + (rowNumber + 1)) !== -1 &&
                   arr.indexOf(str + (rowNumber + 2)) !== -1;
            if(testPassed) {
                winningCombination.push.apply(winningCombination,
                    [
                        document.getElementsByClassName("firstRow")[0],
                        document.getElementsByClassName("firstRow")[1],
                        document.getElementsByClassName("firstRow")[2]
                    ]
                );
            }
            return testPassed;
        }
        if(rowNumber === 1) {
            testPassed = arr.indexOf(str + (rowNumber - 1)) !== -1 &&
                   arr.indexOf(str + (rowNumber)) !== -1 &&
                   arr.indexOf(str + (rowNumber + 1)) !== -1;
            if(testPassed) {
                winningCombination.push.apply(winningCombination,
                    [
                        document.getElementsByClassName("secondRow")[0],
                        document.getElementsByClassName("secondRow")[1],
                        document.getElementsByClassName("secondRow")[2]
                    ]
                );
            }
            return testPassed;
        }
        if(rowNumber === 2) {
            testPassed = arr.indexOf(str + (rowNumber - 1)) !== -1 &&
                   arr.indexOf(str + (rowNumber - 2)) !== -1 &&
                   arr.indexOf(str + (rowNumber)) !== -1;
            if(testPassed) {
                winningCombination.push.apply(winningCombination,
                    [
                        document.getElementsByClassName("thirdRow")[0],
                        document.getElementsByClassName("thirdRow")[1],
                        document.getElementsByClassName("thirdRow")[2]
                    ]
                );
            }
            return testPassed;
        }

        return testPassed;
    };

    /**
     * Perform column checks.
     * @param {Number} columnNumber The first encountered column number.
     * @param {Array} arr The array containing IDs of all buttons checked by the players.
     * @returns {Boolean} Whether a match is found vertically.
     */
    var checkVertically = function(columnNumber, arr) {
        var testPassed = false;
        var str = "-" + columnNumber.toString();
        if(columnNumber === 0) {
            testPassed = arr.indexOf((columnNumber) + str) !== -1 &&
                            arr.indexOf((columnNumber + 1) + str) !== -1 &&
                            arr.indexOf((columnNumber + 2) + str) !== -1;
            if(testPassed) {
                winningCombination.push.apply(winningCombination,
                    [
                        document.getElementsByClassName("firstRow")[0],
                        document.getElementsByClassName("secondRow")[0],
                        document.getElementsByClassName("thirdRow")[0]
                    ]
                );
            }
            return testPassed;
        }
        if(columnNumber === 1) {
            testPassed = arr.indexOf((columnNumber - 1) + str) !== -1 &&
                   arr.indexOf((columnNumber) + str) !== -1 &&
                   arr.indexOf((columnNumber + 1) + str) !== -1;
            if(testPassed) {
                winningCombination.push.apply(winningCombination,
                    [
                        document.getElementsByClassName("firstRow")[1],
                        document.getElementsByClassName("secondRow")[1],
                        document.getElementsByClassName("thirdRow")[1]
                    ]
                );
            }
            return testPassed;
        }
        if(columnNumber === 2) {
            testPassed = arr.indexOf((columnNumber - 1) + str) !== -1 &&
                            arr.indexOf((columnNumber - 2) + str) !== -1 &&
                            arr.indexOf((columnNumber) + str) !== -1;
            if(testPassed) {
                winningCombination.push.apply(winningCombination,
                    [
                        document.getElementsByClassName("firstRow")[2],
                        document.getElementsByClassName("secondRow")[2],
                        document.getElementsByClassName("thirdRow")[2]
                    ]
                );
            }
            return testPassed;
        }
        return testPassed;
    };

    /**
     * Perform diagonal check.
     * @param {String} valueToCheck The button text to check against.
     * @returns {Boolean} Whether a match is found diagonally.
     */
    var checkDiagonally = function(valueToCheck) {
        var testPasses;
        testPasses = document.getElementsByClassName("firstRow")[0].value === valueToCheck &&
                        document.getElementsByClassName("secondRow")[1].value === valueToCheck &&
                        document.getElementsByClassName("thirdRow")[2].value === valueToCheck;
        if(testPasses) {
            winningCombination.push.apply(winningCombination,
                [
                    document.getElementsByClassName("firstRow")[0],
                    document.getElementsByClassName("secondRow")[1],
                    document.getElementsByClassName("thirdRow")[2]
                ]
            );
            // Return early
            return true;
        }

        // Check for the other diagonal
        testPasses = document.getElementsByClassName("firstRow")[2].value === valueToCheck &&
                        document.getElementsByClassName("secondRow")[1].value === valueToCheck &&
                        document.getElementsByClassName("thirdRow")[0].value === valueToCheck;
        if(testPasses) {
            winningCombination.push.apply(winningCombination,
                [
                    document.getElementsByClassName("firstRow")[2],
                    document.getElementsByClassName("secondRow")[1],
                    document.getElementsByClassName("thirdRow")[0]
                ]
            );
        }
        return testPasses;
    };

    /**
     * Helper function to iterate over the array containing the plays made by the two players.
     * @param {Array} arr The array containing IDs of all buttons checked by the players.
     * @param {Object} playerInfo The player information belonging to the 'players' object.
     * @returns {Boolean} Whether all tests pass and a winner is established or not.
     */
    var iterateOverArray = function(arr, playerInfo) {
        var diagonalCheck = false;
        var horizontalCheck = false;
        var verticalCheck = false;

        var testPassed = false;
        var i;
        for(i=0; i < arr.length; i++) {
            var splitStr = arr[i].split("-");
            if(splitStr[0] === splitStr[1]) {
                diagonalCheck = checkDiagonally(playerInfo.value);
                if(diagonalCheck) {
                    testPassed = true;
                    declareWinner(playerInfo.name);
                    break; // break if found a winner already
                }
            }
            horizontalCheck = checkHorizontally(parseInt(splitStr[0], 10) , arr);
            if(horizontalCheck) {
                testPassed = true;
                declareWinner(playerInfo.name);
                break;
            }
            verticalCheck = checkVertically(parseInt(splitStr[1], 10) , arr);
            if(verticalCheck) {
                testPassed = true;
                declareWinner(playerInfo.name);
                break;
            }
        }
        return testPassed;
    };

    /**
     * Function that checks the status of the game after every play.
     * @returns {Boolean} Whether all tests pass and a winner is established or not.
     */
    var checkStatus = function() {
        var inputElements = document.getElementsByTagName('input');
        var i;
        var XArray = [];
        var OArray = [];

        for(i=0; i < inputElements.length; i++) {
            var element = inputElements[i];
            if(element.value !== "") {
                element.value === players.playerX.value ? XArray.push(element.id) : OArray.push(element.id);
            }
        }

        var testPassed = iterateOverArray(XArray, players.playerX);
        if(!testPassed) {
            testPassed = iterateOverArray(OArray, players.playerO);
        }

        return testPassed;
    };

    /**
     * Callback function for the click event handler. Remove the click event listener for the button
     * clicked on.
     * @listens event The JS click event
     */
    onButtonClick = function(event) {
        if(winningCombination.length !== 0) {
            // Notify that winner is already declared.
            alert("Winner is already declared.");
            endGame();
            return;
        }
        count++;
        var target = event.target;
        target.removeEventListener('click', onButtonClick, false);

        if(count%2 === 0) {
            // For even clicks
            target.value = players.playerO.value;
        }
        else {
            // For odd clicks
            target.value = players.playerX.value;
        }
        if(count >= 3) {
            var testPassed = checkStatus();
            if(count === 9 && !testPassed) {
                // Declare a tie
                declareTie();
                resetGame();
            }
        }
    };

    /**
     * Initializes the click event handlers for each button element.
     */
    var initialize = function() {
        var inputElements = document.getElementsByTagName('input');
        var i;
        for(i=0; i < inputElements.length; i++) {
            var elem = inputElements[i];
            elem.addEventListener('click', onButtonClick, false);

            // Add id and class for each button element
            if(i < 3) {
                elem.id = "0-" + i;
                elem.className += ' firstRow';
            }
            else if(i > 2 && i < 6) {
                elem.id = "1-" + (i-3);
                elem.className += ' secondRow';
            }
            else {
                elem.id = "2-" + (i-6);
                elem.className += ' thirdRow';
            }
        }
    };

    window.onload = function() {
        initialize();
    };

}());

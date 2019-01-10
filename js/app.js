$(() => {
  const gridWidth = 10
  const $cpuBoard = $('.board')
  const $playerBoard = $('.board2')
  const $playerInfo = $('.player-info')
  const $cpuInfo = $('.cpu-info')
  const $resetButton = $('button')
  const $playAgainScreen = $('.play-again')
  const $resetBoxText = $('.reset-text')
  const $patrolBoat = $('.patrol-boat')
  const $destroyer = $('.destroyer')
  const $submarine = $('.submarine')
  const $battleship = $('.battleship')
  const $aircraftCarrier = $('.aircraft-carrier')
  let player1Virtual
  let cpuPlayerVirtual
  let shipPosition = []
  let selectedShip
  let placing = true
  let shipsPlaced = 0
  const target = 17
  const $ships = $('.ship')
  let $cpuSquares
  let $playerSquares
  let cpuSquaresArray = []
  let playerSquaresArray = []
  let selectedShipName
  const player1 = {
    board: [],
    hitcount: 0,
    sunkShips: 0,
    name: 'Player',
    updateTextMiss: () => $playerInfo.html('Opponent missed'),
    updateTextHit: () => $playerInfo.html('Opponent hit your ship'),
    updateTextSunk: () => $playerInfo.html('Opponent sunk your ship')
  }
  const cpuPlayer = {
    board: [],
    hitcount: 0,
    sunkShips: 0,
    name: 'CPU',
    updateTextMiss: () => $cpuInfo.html('You missed'),
    updateTextHit: () => $cpuInfo.html('You hit opponent ship'),
    updateTextSunk: () => $playerInfo.html('You sunk opponents ship')
  }
  const ships = [

    {
      name: 'Patrol Boat',
      l: 2,
      v: 2,
      element: $patrolBoat
    },
    {
      name: 'Destroyer',
      l: 3,
      v: 3,
      element: $destroyer
    },
    {
      name: 'Submarine',
      l: 3,
      v: 4,
      element: $submarine
    },
    {
      name: 'Battleship',
      l: 4,
      v: 5,
      element: $battleship
    },
    {
      name: 'Aircraft Carrier',
      l: 5,
      v: 6,
      element: $aircraftCarrier
    }
  ]

  function init() {
    destroyBoard()
    createBoards()
    createSquares()
    createArrayFromSquares()
    createPlayer1Board()
    createCpuPlayerBoard()
    $resetButton.hide()
    $playAgainScreen.removeClass('play-again')
  }

  init()

  // --------------- Create Boards


  function createBoards() {
    $playerBoard.empty()
    $cpuBoard.empty()
    for (let i = 0; i < gridWidth * gridWidth; i++) {
      // Create square
      $playerBoard.append($('<div>'))
      $cpuBoard.append($('<div>'))
    }
  }

  function createSquares() {
    $cpuSquares = $cpuBoard.find('div')
    $playerSquares = $playerBoard.find('div')
  }

  function createArrayFromSquares() {
    cpuSquaresArray = Array.from($cpuSquares)
    playerSquaresArray = Array.from($playerSquares)
  }


  function createPlayer1Board() {
    player1Virtual = Array.apply(undefined, {
      length: gridWidth * gridWidth
    })
    player1.board = [...player1Virtual]
  }

  function createCpuPlayerBoard() {
    cpuPlayerVirtual = Array.apply(undefined, {
      length: gridWidth * gridWidth
    })
    ships.forEach(ship => placeRandomCpuPieces(cpuPlayerVirtual, ship))
    cpuPlayer.board = [...cpuPlayerVirtual]
  }

  function destroyBoard() {
    shipPosition = []
    cpuSquaresArray = []
    playerSquaresArray = []
    shipsPlaced = 0
    player1.hitcount = 0
    cpuPlayer.hitcount = 0
  }


  // ------------ Game playing funcitons


  function startGame() {
    $cpuSquares.on('click', e => {
      const index = cpuSquaresArray.indexOf(e.target)
      if (cpuPlayerVirtual === undefined) return
      fireTorpedo(index, cpuPlayer, cpuPlayerVirtual, $cpuSquares)
      cpuMove()
      checkForWinner()
    })
  }

  function endGame() {
    $cpuSquares.off('click')
    $resetButton.show()
    $playAgainScreen.addClass('play-again')
  }

  function restartGame() {
    init()
    // console.log('NEW', player1.board)
    $ships.show()
    $playerInfo.html('click on a ship to place')
    $cpuInfo.html('')
    $resetBoxText.html('')
  }

  function countShipsPlaced() {
    if (shipsPlaced === 5) {
      $playerInfo.html('Try and find opponents ship !')
      startGame()
    }
  }

  function checkForWinner() {
    if (cpuPlayer.hitcount === target) {
      $resetBoxText.html('Game over, you won')
      endGame()
    } else if (player1.hitcount === target) {
      $resetBoxText.html('Game over, you lost')
      endGame()
    }
  }

  // ----------- functions for moving and placing the ships


  function canPlaceShipHere() {
    shipPosition.forEach((element) => {
      if (player1.board[element] !== undefined) {
        $playerInfo.html('You can not place here')
        disableEnter()
      }
    })
  }


  function isVertical(shipPosition) {
    if (shipPosition[1] - shipPosition[0] === 10)
      return true
  }

  function rotateShipVertical(shipPosition) {
    const verticalShip = []
    // loop through ship length and retrun index0
    for (let i = 0; i < selectedShip.l; i++) {
      verticalShip.push(shipPosition[0] + (gridWidth * i))
      verticalShip.forEach(i => {
        $(playerSquaresArray[i]).addClass('active')
      })
    }
    return verticalShip
  }


  function rotateShipHorizontal(shipPosition) {
    const horizontalShip = []
    for (let i = 0; i < selectedShip.l; i++) {
      horizontalShip.push(shipPosition[0] + i)
      horizontalShip.forEach(i => {
        $(playerSquaresArray[i]).addClass('active')
      })
    }
    return horizontalShip
  }


  function movePieceDown() {
    shipPosition.forEach(
      (position, i) => {
        (shipPosition[i] = position + gridWidth)
        addClassActive(i)
      })
  }

  function movePieceUp() {
    shipPosition.forEach(
      (position, i) => {
        (shipPosition[i] = position - gridWidth)
        addClassActive(i)
      })
  }



  //--------------------- Logic for cpu Random Guess --> Needs more work

  // store the hit value
  // store the possible next squares it can hit --> this done validGuesses
  // pick a random square in valid guesses and replace randomHit with the new square ---> done
  // if next hit is a miss, pop this number out ot validGuesses and try another
  // if the validGuess was a hit, pop the other possible moves out of the array and repeat > 5 *
  // take out attempt of validGuesses, do not clear and try next one

  let lastGuesses = []
  let lastGuessResult
  let validGuesses = []
  let possibleGuesses = Array.apply(null, {
    length: gridWidth * gridWidth
  }).map(Number.call, Number)
  const possibleSquaresToHit = [1, -1, gridWidth, -gridWidth]

  function cpuMove() {
    let nextGuess
    if (!lastGuesses.length) {
      nextGuess = possibleGuesses[Math.floor(Math.random() * possibleGuesses.length)] // From remaining squares
    } else if (lastGuessResult === 'hit') {
      possibleSquaresToHit.forEach(move => {
        const newMove = lastGuesses[lastGuesses.length - 1] + move
        if (
          newMove >= 0 &&
          newMove < gridWidth * gridWidth &&
          possibleGuesses.includes(newMove)
        ) {
          validGuesses.push(newMove)
        }
      })
      // unique?
      validGuesses = Array.from(new Set(validGuesses))

      nextGuess = validGuesses[0]
    } else if (lastGuessResult === 'sunk') {
      validGuesses = []
    } else {
      nextGuess = validGuesses[0]
    }

    if (!nextGuess) {
      nextGuess = possibleGuesses[Math.floor(Math.random() * possibleGuesses.length)]
    }

    lastGuesses.push(nextGuess)
    fireTorpedo(nextGuess, player1, player1Virtual, $playerSquares)
    const squareHit = player1.board[nextGuess]

    if (squareHit === 1) {
      lastGuessResult = 'hit'
    } else if (squareHit === 9) {
      lastGuessResult = 'sunk'
    } else {
      lastGuessResult = 'miss'
    }
    const possibleGuessIndex = possibleGuesses.indexOf(nextGuess)
    if (possibleGuessIndex !== -1) possibleGuesses.splice(possibleGuessIndex, 1)

    var validGuessIndex = validGuesses.indexOf(nextGuess)
    if (validGuessIndex !== -1) validGuesses.splice(validGuessIndex, 1)
  }

  function fireTorpedo(index, player, board, squares) {

    const value = player.board[index]
    if (value === 1) {
      return
    } else if (value === 0) {
      return
    } else if (value) {
      player.board[index] = 1
      $(squares[index]).css({
        'background-color': 'red'
      })
      player.hitcount++
      player.updateTextHit()
      $cpuInfo.html('you hit')
      if (player.board.includes(value)) {
        console.log('not sunk')
      } else {
        console.log('sunk')
        player.sunkShips++
        player.updateTextSunk()
        const sunkIndexes = []
        board.forEach((v, i) => {
          if (v === value) sunkIndexes.push(i)
        })
        sunkIndexes.forEach(sunk => {
          player.board[sunk] = 9
          $(squares[sunk]).css({
            'background': 'url("fire.png")',
            'background-size': 'contain',
            'background-repeat': 'no-repeat',
            'background-position': 'center'
          })
        })
      }
    } else {
      board[index] = 0
      $(squares[index]).css({
        'background': 'url("miss.png")',
        'background-size': 'contain',
        'background-repeat': 'no-repeat',
        'background-position': 'center'
      })
      player.updateTextMiss()
    }
  }


  // TO REFACTOR ------------->

  function placeRandomCpuPieces(board, ship) {
    let arrayOfIndexes = []
    for (let i = 0; i < gridWidth * gridWidth; i++) {
      arrayOfIndexes.push(i)
    }
    if (Math.random() >= 0.5) {
      board = rotateBoard(board, gridWidth)
      arrayOfIndexes = rotateBoard(arrayOfIndexes, gridWidth)
    }
    const rows = chunkArray(board, gridWidth)
    // Create a counter for the index of the board
    let index = 0
    // Loop through the rows
    let availableSpaces = rows.map(row => {
      const undefinedSquares = [
        [] // Each unbroken row of undefined has its own array
      ]
      // For each row, loop through the squares
      row.forEach(current => {
        // If it is an undefined, add the index into the last array
        if (current === undefined) {
          // Push the ORIGINAL index value using the array of indexes
          undefinedSquares[undefinedSquares.length - 1].push(
            arrayOfIndexes[index]
          )
        } else {
          // If it is not undefined, create a new array
          undefinedSquares.push([])
        }
        index++
      })
      // Filter the chunks by the size of the piece that you are placing
      return undefinedSquares.filter(consecutiveUndefinedSquare => consecutiveUndefinedSquare.length >= ship.l)
    })
    // Remove the outer array
    availableSpaces = availableSpaces.flat()
    // Remove all empty arrays where no move was possible in a row
    // I only want the available spaces where the ship can actually fit
    availableSpaces = availableSpaces.filter(available => available.length > 0)
    // Select random free chunk
    // This selected space is going to be ALL possible spaces, i.e [0,1,2,3,4]
    const selectedSpace =
      availableSpaces[Math.floor(Math.random() * availableSpaces.length)]
    // Build all possible moves in selected selectedSpace
    const possible = []
    let counter = 0
    selectedSpace.forEach(() => {
      // Copy the array as splice mutates the array
      const temp = [...selectedSpace]
      const move = temp.splice(counter, ship.l)
      // Get rid of any moves where the piece overlaps
      if (move.length === ship.l) {
        possible.push(move)
      }
      counter++
    })

    const final = possible[Math.floor(Math.random() * possible.length)]

    final.forEach(space => {
      cpuPlayerVirtual[space] = ship.v
    })
  }


  //------------------EVENT LISTENERS ---------------------------

  $ships.on('click', e => {
    const clickedShip = $(e.target)

    // Check if there are any active squares
    const activeSquares = $(document).find('.active')
    if (activeSquares.length) {
      const selectedShip = ships.find(ship => ship.name === selectedShipName)
      selectedShip.element.show()
      $playerSquares.removeClass('active')
    }

    selectedShipName = clickedShip.data('name')
    $playerInfo.html(`Use arrows to place your ${selectedShipName}`)
    shipsPlaced++
    placing = true
    shipPosition = []
    selectedShip = ships.find(ships => ships.name === selectedShipName)
    for (let i = 0; i < selectedShip.l; i++) {
      shipPosition.push(i)
      const squareToMakeActive = $(playerSquaresArray[i])
      squareToMakeActive.addClass('active')
    }
    clickedShip.hide()
  })


  $(document).on('keydown', e => {
    if (placing) {
      switch (e.keyCode) {
        case 37: // left
          if (shipPosition[0] % gridWidth > 0) {
            removeClassActive()
            shipPosition.forEach((position, i) => {
              shipPosition[i] = position - 1
              $($playerSquares[shipPosition[i]]).addClass('active')
            })
          }
          break
        case 38: // up
          if (shipPosition[shipPosition.length - 1] - gridWidth >= 0 && !isVertical(shipPosition)) {
            removeClassActive()
            movePieceUp()
          } else if (isVertical(shipPosition) && shipPosition[0] - gridWidth >= 0) {
            removeClassActive()
            movePieceUp()
          }
          break
        case 39: //right
          if (shipPosition[shipPosition.length - 1] % gridWidth < gridWidth - 1) {
            displayInstructions()
            removeClassActive()
            shipPosition.forEach((position, i) => {
              shipPosition[i] = position + 1
              $($playerSquares[shipPosition[i]]).addClass('active')
            })
          }
          break
        case 40: // down
          if (shipPosition[0] + gridWidth < gridWidth * gridWidth && !isVertical(shipPosition)) {
            displayInstructions()
            removeClassActive()
            movePieceDown()
          } else if (isVertical(shipPosition) && shipPosition[shipPosition.length - 1] + gridWidth < gridWidth * gridWidth) {
            displayInstructions()
            removeClassActive()
            movePieceDown()
          }
          break
        case 13: // enter
          $playerInfo.html(`${selectedShip.name} placed`)
          countShipsPlaced()
          canPlaceShipHere()
          placing = false
          shipPosition.forEach(i => {
            $(playerSquaresArray[i]).css({
              'background-color': '#56f442'
            }) // <---- this could be a unique class for the ship
            player1Virtual[i] = selectedShip.v
            player1.board[i] = selectedShip.v
          })
          $playerSquares.removeClass('active')
          // console.log(player1.board)
          break

        case 32: // space
          if (!isVertical(shipPosition)) {
            removeClassActive()
            shipPosition = rotateShipVertical(shipPosition)
          } else {
            removeClassActive()
            shipPosition = rotateShipHorizontal(shipPosition, selectedShip.l)
          }
          break
      }
    }
  })

  $resetButton.on('click', restartGame)



  // --------------------- misc funcitons

  function disableEnter() {
    document.off('keydown', 13)
  }

  function removeClassActive() {
    $playerSquares.removeClass('active')
  }

  function addClassActive(i) {
    $($playerSquares[shipPosition[i]]).addClass('active')
  }

  function displayInstructions() {
    $playerInfo.html('Use Space-bar to rotate and Enter to place')
  }

})

// ---------------------------------------

function chunkArray(board, gridWidth) {
  const rows = []
  for (let i = 0, j = board.length; i < j; i += gridWidth) {
    const tempArray = board.slice(i, i + gridWidth)
    rows.push(tempArray)
  }
  return rows
}

function rotateBoard(board, gridWidth) {
  const a = chunkArray(board, gridWidth)
  const unflattened = a[0].map((col, c) =>
    a.map((row, r) => a[r][c]).reverse()
  )
  return unflattened.flat()
}

// miss                  = 0
// hit                   = 1
// patrol-boat (2)       = 2
// destroyer (3)         = 3
// submarine (3)         = 4
// battleship (4)        = 5
// aircraft-carrier (5)  = 6

// PSEUDOCODE FOR COMPUTER MOVE
// Make new empty array for the size of the board
// (later) Rotate board vertical or horizontal
// Split the board into rows
// Filter the rows by the number of free squares
// Select one
// Store the correct number in it

// PSEUDOCODE FOR PLAYER MOVE
// Create a player 1 with an empty array (gridWidth*gridWidth)
// Add eventListener for each piece
// When you click on each ship it appears (top left)
// Use keyboard to move piece up down left right
// Make sure that the piece can't move over the edges
// Space to rotate the pieces
// Enter to save
// When you save, store the correct values into the player1
// pieceValue = 4
// piecePosition = [0,1,2,3]
// Press right
// currentPiece = [1,2,3,4]
// loop through and save to the index values (above) the correct value for the ship to player1Virtual
// once all pieces are placed, start game, cpu player should generate own board

// PSUEDOCODE FOR RANDOMLY PLACING A SHIP
// Build an array to look up the original indexes regardless of whether it has been rotated or not
// Rotate board vertical or horizontal
// - https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
// Rotate the board along with the indexes
// Rotate the indexes along with the board
// Split the board into rows to help not select squares that are crossing a border



//https://github.com/LearnTeachCode/Battleship-JavaScript/blob/gh-pages/battleship.js

// var u = undefined
// var player1Original = [
//   3, u, u, u, u, u, 4,
//   3, 5, 5, 5, 5, u, 4,
//   3, 6, u, u, u, u, 4,
//   u, 6, u, u, u, u, u,
//   u, 6, u, u, u, u, u,
//   u, 6, u, u, 2, 2, u,
//   u, 6, u, u, u, u, u
// ]
// var player1 = player1Original.slice(0)
// displayBoardInConsole(player1, gridWidth)

// const player1 = new Array(grid*grid)

// function displayBoardInConsole(board, gridWidth) {
//   // Split the board into rows
//   const rows = chunkArray(board, gridWidth)
//   // Loop through each row
//   rows.forEach(row => {
//     // Loop through each square and replace undefined values with _
//     const tempRow = row.map(v => {
//       if (typeof v === 'undefined') {
//         return '_'
//       } else {
//         return v + ''
//       }
//     })
//     // Display in console
//     console.log(tempRow)
//   })
// }

// hitcount++
// if (hitcount === target) {
//   alert('YOU HAVE WON')
// }
// console.log('hitcount', hitcount)

// -------------------- old hit logic

// // Last time you made a hit)
// lastGuessinArray = previousHit[previousHit.length - 1]
// squareHit = player1.board[lastGuessinArray]
// if (checkNextMove.length) {
//   randomHit = validGuesses[Math.floor(Math.random() * validGuesses.length)]
//   // console.log('HERE', randomHit)
// } else {
//   randomHit = getRandomNumber()
// }
// // has hit
// if (squareHit === 1) {
//   randomHit = checkNextMove()
//   previousHit.push(randomHit)
//   fireTorpedo(randomHit, player1, player1Virtual, $playerSquares)
//   validGuesses = []
//   // repeat number
// } else if (previousHit.includes(randomHit)) {
//   cpuMove()
//   // guess again
// } else {
//   previousHit.push(randomHit)
//   // console.log('first hit previousHit[]', previousHit)
//   fireTorpedo(randomHit, player1, player1Virtual, $playerSquares)
// }
// // console.log('last guess value', squareHit)
// // console.log('the last guess', lastGuessinArray)
// // console.log('the array of previous guesses', previousHit)
// // console.log('VALID GUESSES', validGuesses)
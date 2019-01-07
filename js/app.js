// miss                  = 0
// hit                   = 1
// patrol-boat (2)       = 2
// destroyer (3)         = 3
// submarine (3)         = 4
// battleship (4)        = 5
// aircraft-carrier (5)  = 6


$(() => {
  const gridWidth = 10
  const $cpuBoard = $('.board')
  const $playerBoard = $('.board2')
  let player1Original
  let player1
  let cpuPlayerOriginal
  let cpuPlayer
  let shipPosition = []
  let selectedShip
  let placing = true

  // let hitcount = 0
  // const target = 17

  const $ships = $('.ship')
  const ships = [

    {
      name: 'Patrol Boat',
      color: 'yellow',
      l: 2,
      v: 2
    },
    {
      name: 'Destroyer',
      color: 'blue',
      l: 3,
      v: 3
    },
    {
      name: 'Submarine',
      color: 'orange',
      l: 3,
      v: 4
    },
    {
      name: 'Battleship',
      color: 'green',
      l: 4,
      v: 5
    },
    {
      name: 'Aircraft Carrier',
      color: 'purple',
      l: 5,
      v: 6
    }
  ]

  function createBoards() {
    for (let i = 0; i < gridWidth * gridWidth; i++) {
      // Create square
      $playerBoard.append($('<div>'))
      $cpuBoard.append($('<div>'))
    }
  }
  createBoards()

  const $cpuSquares = $cpuBoard.find('div')
  const cpuSquaresArray = Array.from($cpuSquares)
  const $playerSquares = $playerBoard.find('div')
  const playerSquaresArray = Array.from($playerSquares)

  createCpuPlayer()
  createPlayer1()


  $cpuSquares.on('click', e => {
    const index = cpuSquaresArray.indexOf(e.target)
    checkValue(index, cpuPlayer, cpuPlayerOriginal, $cpuSquares)
    cpuMove()
  })

  function cpuMove() {
    const index = getRandomNumber()
    checkValue(index, player1, player1Original, $playerSquares)
  }

  // index, e, player, board, squares

  function getRandomNumber() {
    return Math.floor(Math.random() * gridWidth * gridWidth)
  }

  $ships.on('click', e => {
    placing = true
    shipPosition = []
    const clickedShip = $(e.target)
    const selectedShipName = clickedShip.data('name')
    selectedShip = ships.find(ships => ships.name === selectedShipName)
    for (let i = 0; i < selectedShip.l; i++) {
      shipPosition.push(i)
      $(playerSquaresArray[i]).addClass('active')
      clickedShip.css({
        height: 0,
        width: 0
      })
    }
  })

  $(document).on('keydown', e => {
    if (placing) {

      switch (e.keyCode) {
        case 37: // left
          if (shipPosition[0] % gridWidth > 0) {
            $playerSquares.removeClass('active')
            shipPosition.forEach((position, i) => {
              shipPosition[i] = position - 1
              $($playerSquares[shipPosition[i]]).addClass('active')
            })
          }
          break
        case 38: // up
          if (shipPosition[shipPosition.length - 1] - gridWidth >= 0) {
            $playerSquares.removeClass('active')
            shipPosition.forEach(
              (position, i) => {
                (shipPosition[i] = position - gridWidth)
                $($playerSquares[shipPosition[i]]).addClass('active')
              })
          }
          break
        case 39: //right
          if (shipPosition[shipPosition.length - 1] % gridWidth < gridWidth - 1) {
            $playerSquares.removeClass('active')
            shipPosition.forEach((position, i) => {
              shipPosition[i] = position + 1
              $($playerSquares[shipPosition[i]]).addClass('active')
            })
          }
          break
        case 40: // down
          if (shipPosition[0] + gridWidth < gridWidth * gridWidth) {
            $playerSquares.removeClass('active')
            shipPosition.forEach(
              (position, i) => {
                (shipPosition[i] = position + gridWidth)
                $($playerSquares[shipPosition[i]]).addClass('active')
              })
          }
          break
        case 13:
          placing = false
          shipPosition.forEach(i => {
            $(playerSquaresArray[i]).css({
              'background-color': selectedShip.color
            }) // <---- this could be a unique class for the ship

            player1Original[i] = selectedShip.v
            player1[i] = selectedShip.v
          })
          break

        case 32:
          if (!isVertical(shipPosition)) {
            $playerSquares.removeClass('active')
            shipPosition = rotateShipVertical(shipPosition)
          } else {
            $playerSquares.removeClass('active')
            shipPosition = rotateShipHorizontal(shipPosition)
          }
          break
      }
    }
  })

  function isVertical(shipPosition) {
    if (shipPosition[1] - shipPosition[0] === 10)
      return true
  }

  function rotateShipVertical(shipPosition) {
    const verticalShip = []
    const shipLength = selectedShip.l
    // loop through ship length and retrun index0
    for (let i = 0; i < shipLength; i++) {
      verticalShip.push(shipPosition[0] + (gridWidth * i))
      verticalShip.forEach(i => {
        $(playerSquaresArray[i]).addClass('active')
      })
    }
    return verticalShip
  }

  function rotateShipHorizontal(shipPosition) {
    const horizontalShip = []
    const shipLength = selectedShip.l
    for (let i = 0; i < shipLength; i++) {
      horizontalShip.push(shipPosition[0] + i)
      horizontalShip.forEach(i => {
        $(playerSquaresArray[i]).addClass('active')
      })
    }
    return horizontalShip
  }


  function checkValue(index, player, board, squares) {
    const value = player[index]
    if (value === 1) {
      return
    } else if (value === 0) {
      return
    } else if (value) {
      player[index] = 1
      $(squares[index]).css({
        'background-color': 'red'
      })
      if (player.includes(value)) {
        console.log('not sunk')
      } else {
        console.log('sunk')
        const sunkIndexes = []
        board.forEach((v, i) => {
          console.log(v)
          if (v === value) sunkIndexes.push(i)
        })
        console.log(sunkIndexes)
        sunkIndexes.forEach(sunk =>
          $(squares[sunk]).css({
            'background-color': 'black'
          })
        )
      }
    } else {
      board[index] = 0
      $(squares[index]).css({
        'background-color': 'grey'
      })
    }
  }


  function createPlayer1() {
    player1Original = Array.apply(undefined, {
      length: gridWidth * gridWidth
    })
    player1 = [...player1Original]
  }

  function createCpuPlayer() {
    cpuPlayerOriginal = Array.apply(undefined, {
      length: gridWidth * gridWidth
    })
    ships.forEach(ship => checkForValidMove(cpuPlayerOriginal, ship))
    cpuPlayer = [...cpuPlayerOriginal]
  }

  // TO REFACTOR ------------->

  function checkForValidMove(board, ship) {
    // Build an array to look up the original indexes regardless of whether it has been rotated or not
    let arrayOfIndexes = []
    for (let i = 0; i < gridWidth * gridWidth; i++) {
      arrayOfIndexes.push(i)
    }
    // Rotate board vertical or horizontal
    // - https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
    if (Math.random() >= 0.5) {
      // Rotate the board along with the indexes
      board = rotateBoard(board, gridWidth)
      // Rotate the indexes along with the board
      arrayOfIndexes = rotateBoard(arrayOfIndexes, gridWidth)
    }
    // Split the board into rows to help not select squares that are crossing a border
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
      // Red & Green
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
    // [0,1,2,3,4]
    // => [0,1]
    // => [1,2] etc

    // Starting at index 0
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

    // Pick one of the possible moves randomly
    const final = possible[Math.floor(Math.random() * possible.length)]

    final.forEach(space => {
      // Assign the value to the original cpu board
      cpuPlayerOriginal[space] = ship.v
      $(cpuSquaresArray[space]).css({
        'background-color': ship.color
      })
    })
  }
})

// ----------------------------------------------

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
// loop through and save to the index values (above) the correct value for the ship to player1Original
// once all pieces are placed, start game, cpu player should generate own board


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
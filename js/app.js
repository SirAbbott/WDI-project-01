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

$(() => {
  const gridWidth = 10
  const $board = $('.board')
  let player1Original
  let player1
  let cpuPlayerOriginal
  let cpuPlayer
  const ships = [{
    name: 'Patrol Boat',
    color: 'yellow',
    l: 2,
    v: 2
  }, {
    name: 'Destroyer',
    color: 'orange',
    l: 3,
    v: 3
  }, {
    name: 'Submarine',
    color: 'blue',
    l: 3,
    v: 4
  }, {
    name: 'Battleship',
    color: 'green',
    l: 4,
    v: 5
  }, {
    name: 'Aircraft Carrier',
    color: 'purple',
    l: 5,
    v: 6
  }]

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
  function createBoard() {
    for (let i = 0; i < gridWidth * gridWidth; i++) {
      // Create square
      $board.append($('<div>'))
    }
  }
  createBoard()

  const $squares = $board.find('div')
  const squaresArray = Array.from($squares)
  $squares.on('click', e => {
    const index = squaresArray.indexOf(e.target)
    console.log(index)
    console.log(cpuPlayer[index])
    checkValue(index, e)
  })



  function checkValue(index, e) {
    const value = cpuPlayer[index]
    // If you have already hit that square
    if (value === 1) {
      return
      // If you have already missed that square
    } else if (value === 0) {
      return
      // Check if there is a ship - HIT IT
    } else if (value) {
      cpuPlayer[index] = 1
      $(e.target).css({
        'background-color': 'red'
      })
      // Check to see if the array still contains any of the same value
      // If not, then the ship must have been sunk!
      if (cpuPlayer.includes(value)) {
        console.log('not sunk')
      } else {
        console.log('sunk')
        // Loop through the original array to return the indexes of the squares which contain the same number as the ship that has been sunk
        const sunkIndexes = []
        cpuPlayerOriginal.forEach((v, i) => {
          if (v === value) sunkIndexes.push(i)
        })
        // The length would give you which ship has been sunk...
        console.log(sunkIndexes.length)
        // Turn them all black
        sunkIndexes.forEach(s => $(squaresArray[s]).css({
          'background-color': 'black'
        }))
      }
      // You've missed
    } else {
      cpuPlayer[index] = 0
      $(e.target).css({
        'background-color': 'grey'
      })
    }
  }


  function createPlayer() {
    player1Original = Array.apply(undefined, {
      length: gridWidth * gridWidth
    })
    player1 = [...player1Original]
    console.log(player1)
  }
  createPlayer()

  function createCpuPlayer() {
    // Create an array with undefined values the size of the gridWidth in length and height
    // - new Array(gridWidth * gridWidth) doesn't add undefined to the array?!
    cpuPlayerOriginal = Array.apply(undefined, {
      length: gridWidth * gridWidth
    })

    // displayBoardInConsole(cpuPlayerOriginal, gridWidth)

    // Loop through all ship pieces and find a space for it...
    ships.forEach(ship => checkForValidMove(cpuPlayerOriginal, ship))

    // make a copy of the array for the game (i.e. sunk and miss shots etc)
    cpuPlayer = [...cpuPlayerOriginal]
  }

  createCpuPlayer()

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
          undefinedSquares[undefinedSquares.length - 1].push(arrayOfIndexes[index])
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
    // We only want the available spaces where the ship can actually fit
    availableSpaces = availableSpaces.filter(av => av.length > 0)

    // Select random free chunk
    // This selected space is going to be ALL possible spaces, i.e [0,1,2,3,4]
    const selectedSpace = availableSpaces[Math.floor(Math.random() * availableSpaces.length)]

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
      $(squaresArray[space]).css({
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
  const unflattened = a[0].map((col, c) => a.map((row, r) => a[r][c]).reverse())
  return unflattened.flat()
}

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
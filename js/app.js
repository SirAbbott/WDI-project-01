// miss                  = 0
// hit                   = 1
// patrol-boat (2)       = 2
// destroyer (3)         = 3
// submarine (3)         = 4
// battleship (4)        = 5
// aircraft-carrier (5)  = 6

$(() => {
  let index
  const gridWidth = 7
  const $board = $('.board')
  let cpuPlayerOriginal
  let cpuPlayer
  const ships = [{
    name: "Patrol Boat",
    color: "red",
    l: 2,
    v: 2
  }, {
    name: "Destroyer",
    color: "orange",
    l: 3,
    v: 3
  }, {
    name: "Submarine",
    color: "blue",
    l: 3,
    v: 4
  }, {
    name: "Battleship",
    color: "green",
    l: 4,
    v: 5
  }, {
    name: "Aircraft Carrier",
    color: "purple",
    l: 5,
    v: 6
  }]

  var u = undefined
  var player1Original = [
    3, u, u, u, u, u, 4,
    3, 5, 5, 5, 5, u, 4,
    3, 6, u, u, u, u, 4,
    u, 6, u, u, u, u, u,
    u, 6, u, u, u, u, u,
    u, 6, u, u, 2, 2, u,
    u, 6, u, u, u, u, u
  ]
  var player1 = player1Original.slice(0)

  function displayBoardInConsole(board, gridWidth) {
    // Split the board into rows
    const rows = chunkArray(board, gridWidth)
    // Loop through each row
    rows.forEach(row => {
      // Loop through each square and replace undefined values with _
      const tempRow = row.map(v => {
        if (typeof v === 'undefined') {
          return '_'
        } else {
          return v + ''
        }
      })
      // Display in console
      console.log(tempRow)
    })
  }
  displayBoardInConsole(player1, gridWidth)

  function chunkArray(board, gridWidth) {
    const rows = []
    for (let i = 0, j = board.length; i < j; i += gridWidth) {
      const tempArray = board.slice(i, i + gridWidth)
      rows.push(tempArray)
    }
    return rows
  }

  // const player1 = new Array(grid*grid)
  for (let i = 0; i < gridWidth * gridWidth; i++) {
    // Create square
    $board.append($('<div />'))
  }

  const $squares = $board.find('div')
  console.log($squares)
  const squaresArray = Array.from($squares)

  $squares.on('click', e => {
    index = squaresArray.indexOf(e.target)
    console.log(index)
    console.log(cpuPlayer[index])
    checkValue(e)
  })

  function checkValue(e) {
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
        'background-color': 'yellow'
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
        'background-color': 'red'
      })
    }
  }

  function createCpuPlayer() {
    // new Array(gridWidth * gridWidth) doesn't add undefined to the array?!
    cpuPlayerOriginal = Array.apply(undefined, {
      length: gridWidth * gridWidth
    })
    console.log(cpuPlayerOriginal)
    // cpuPlayerOriginal = player1Original.splice(0)
    displayBoardInConsole(cpuPlayerOriginal, gridWidth)
    ships.forEach(ship => checkForValidMove(cpuPlayerOriginal, ship))
    cpuPlayer = [...cpuPlayerOriginal]
  }

  createCpuPlayer()

  function checkForValidMove(board, ship) {
    // Split the board into rows to help not select squares that are crossing a border
    const rows = chunkArray(board, gridWidth)
    // Create a counter for the index of the board
    let index = 0
    // Loop through the rows
    let availableSpaces = rows.map(row => {
      const chunks = [
        []
      ]
      // For each row, loop through the squares
      row.forEach(current => {
        // If it is an undefined, add the index into the last array
        if (current === undefined) {
          chunks[chunks.length - 1].push(index)
        } else {
          // If it is not undefined, create a new array
          chunks.push([])
        }
        index++
      })
      console.log(chunks)
      // Filter the chunks by the size of the piece that you are placing
      const filtered = chunks.filter(chunk => chunk.length >= ship.l)
      // Remove the outer array
      return filtered.flat()
    })

    // Remove all empty arrays where no move was possible in a row
    availableSpaces = availableSpaces.filter(av => av.length > 0)

    // Select random free chunk
    // This selected space is going to be ALL possible spaces, i.e [0,1,2,3,4]
    const selectedSpace = availableSpaces[Math.floor(Math.random() * availableSpaces.length)]
    // selectedSpace.forEach(space => {
    //   $(squaresArray[space]).css({
    //     'background-color': 'red'
    //   })
    // })
    console.log("selectedSpace", selectedSpace)
    // Build all possible moves in selected selectedSpace
    const possible = []
    // Starting at index 0
    let counter = 0
    selectedSpace.forEach(() => {
      const temp = [...selectedSpace]
      const move = temp.splice(counter, ship.l)
      // console.log("selectedSpace non mutate", selectedSpace)
      // console.log("HERE", temp)
      // Get rid of any moves where the piece overlaps
      if (move.length === ship.l) {
        possible.push(move)
      }
      counter++
    })
    console.log("possible", possible)
    const indexToSelect = Math.floor(Math.random() * possible.length)
    console.log("indexToSelect", indexToSelect)
    const final = possible[indexToSelect]
    // console.log("final", final)
    final.forEach(space => {
      cpuPlayerOriginal[space] = ship.v
      $(squaresArray[space]).css({
        'background-color': ship.color
      })
    })
  }
})

// Make new empty array for the size of the board
// (later) Rotate board vertical or horizontal
// Split the board into rows
// Filter the rows by the number of free squares
// Select one
// Store the correct number in it
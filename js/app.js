$(() => {
  let index
  const gridWidth = 7
  const $board = $('.board')

  // miss                  = 0
  // hit                   = 1
  // patrol-boat (2)       = 2
  // destroyer (3)         = 3
  // submarine (3)         = 4
  // battleship (4)        = 5
  // aircraft-carrier (5)  = 6

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
    var i, j, chunk = gridWidth
    for (i = 0, j = board.length; i < j; i += chunk) {
      let temparray = board.slice(i, i + chunk)
      temparray = temparray.map(v => {
        if (typeof v === 'undefined') {
          return '_'
        } else {
          return v + ''
        }
      })
      console.log(temparray)
    }
  }
  displayBoardInConsole(player1, gridWidth)

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
    console.log(player1[index])
    checkValue(e)
  })

  function checkValue(e) {
    const value = player1[index]
    // If you have already hit that square
    if (value === 1) {
      return
      // If you have already missed that square
    } else if (value === 0) {
      return
      // Check if there is a ship - HIT IT
    } else if (value) {
      player1[index] = 1
      $(e.target).css({
        'background-color': 'yellow'
      })
      // Check to see if the array still contains any of the same value
      // If not, then the ship must have been sunk!
      if (player1.includes(value)) {
        console.log('not sunk')
      } else {
        console.log('sunk')
        // Loop through the original array to return the indexes of the squares which contain the same number as the ship that has been sunk
        const sunkIndexes = []
        player1Original.forEach((v, i) => {
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
      player1[index] = 0
      $(e.target).css({
        'background-color': 'red'
      })
    }
  }
})

// Make new empty array for the size of the board
// (later) Rotate board vertical or horizontal
// Split the board into rows
// Filter the rows by the number of free squares
// Select one
// Store the correct number in it
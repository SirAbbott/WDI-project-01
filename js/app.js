$(() => {

  let $squares
  let index
  const gridWidth = 7
  // const $ships = $(".ships");
  const $board = $('.board')
  var player1 = [
    1, 0, 0, 0, 0, 0, 0,
    1, 0, 1, 1, 1, 0, 0,
    1, 0, 0, 0, 0, 0, 0,
    0, 1, 0, 0, 0, 0, 0,
    0, 1, 0, 0, 0, 0, 0,
    0, 1, 0, 0, 1, 1, 0,
    0, 1, 0, 0, 0, 0, 0
  ]
  // var player2 = []


  for (let i = 0; i < gridWidth * gridWidth; i++) {
    // Create square
    $board.append($('<div />'))
  }

  $squares = $board.find('div')
  console.log($squares)

  $squares.on('click', e => {
    const squaresArray = Array.from($squares)
    index = squaresArray.indexOf(e.target)
    console.log(index)
    console.log(player1[index])
    checkValue()
  })

  function checkValue() {
    if (player1[index] === 1) {
      player1[index] = 2
    } else if (player1[index] === 0) {
      player1[index] = 3
    }
  }

  // place ships on grid
  // $ships.on("click", select);

  // function select(e) {}

  // let player1 = new Array(gridSize);
  // let player2 = new Array(gridSize);

  // When the player selects which squares do something like this...
  // player1[0] = { color: "red", hit: false };
  // player1[1] = { color: "red", hit: false };

  // const $squares = $(".square");
  // Guess
  // $squares.on("click", guess);

  // function guess(e) {
  //   // https://stackoverflow.com/questions/222841/most-efficient-way-to-convert-an-htmlcollection-to-an-array
  //   const squareArray = Array.from($squares);
  //   // Find the index of the square that was clicked on
  //   const indexGuessed = squareArray.indexOf(e.target);
  //   // Look up the index of the guess in the array and if there is an object, then turn hit to be true
  //   if (player1.indexOf(indexGuessed)) {
  //     player1[indexGuessed].hit = true;
  //   }
  // }
})
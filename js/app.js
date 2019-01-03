document.addEventListener("DOMContentLoaded", () => {
  let $board;
  let $squares;
  const gridWidth = 7;
  const $board = $(".board");

  for (let i = 0; i < gridWidth * gridWidth; i++) {
    // Create square
    $board.append($("<div />"));
  }
  $squares = $board.find("div");

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
});

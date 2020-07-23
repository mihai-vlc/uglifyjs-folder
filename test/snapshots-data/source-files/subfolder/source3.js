function add() {
  return a + b;
}

function calc() {
  return {
    add: add
  }
}

calc();

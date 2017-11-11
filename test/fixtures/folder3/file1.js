function test(data, name) {
  function calculate(data) {
    return data + 123;
  }

  return data + name + calculate() + calculate();
}

test();

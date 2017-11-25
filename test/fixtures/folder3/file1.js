function test(data, name) {
  function calculate(data) {
    return data + 123;
  }

  return data + name + calculate(data) + calculate(name);
}
console.log('folder3/file1.js');
console.log(test(1, 3));

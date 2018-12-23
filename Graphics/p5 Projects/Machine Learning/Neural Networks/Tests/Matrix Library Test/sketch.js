var m;
var o;

function setup() {
  m = new Matrix(4,2);
  m.matrix = [
    [1,2],
    [3,1],
    [2,-5],
    [6,1]
  ];
  m.print();
  Matrix.print(m.transpose());
}

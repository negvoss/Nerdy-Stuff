function Matrix(rows,cols) {
  this.rows = rows;
  this.cols = cols;
  this.matrix = new Array(this.rows);
  for (var i = 0; i < this.matrix.length; i++) {
    this.matrix[i] = new Array(this.cols);
    for (var j = 0; j < this.matrix[i].length; j++) {
      this.matrix[i][j] = 0;
    }
  }

  this.mult = function(other) {
    if (this.cols != other.rows) return NaN; // this.cols must equal other.rows for valid multiplication
    var product = new Matrix(this.rows,other.cols);
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < other.cols; j++) {
        var sum = 0;
        for (var k = 0; k < this.cols; k++) {
          sum += this.matrix[i][k]*other.matrix[k][j]
        }
        product.matrix[i][j] = sum;
      }
    }
    return product;
  }

  this.transpose = function() {
    var transposed = new Matrix(this.cols,this.rows);
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.cols; j++) {
        transposed.matrix[j][i] = this.matrix[i][j];
      }
    }
    return transposed;
  }

  this.print = function() {
    console.table(this.matrix);
  }
}

Matrix.print = function(matrix) {
  matrix.print();
}

Matrix.mult = function(matrix1,matrix2) {
  return matrix1.mult(matrix2);
}

Matrix.transpose = function(matrix) {
  return matrix.transpose();
}

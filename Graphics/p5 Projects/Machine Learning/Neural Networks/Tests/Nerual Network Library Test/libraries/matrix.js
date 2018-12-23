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

  this.add = function(other) {
    // Sizes of matrices must be equal for valid addition
    if (this.rows != other.rows || this.cols != other.cols) return NaN;
    var sum = new Matrix(this.rows,this.cols);
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.cols; j++) {
        sum.matrix[i][j] = this.matrix[i][j] + other.matrix[i][j];
      }
    }
    return sum;
  }

  this.sub = function(other) {
    // Sizes of matrices must be equal for valid subtraction
    if (this.rows != other.rows || this.cols != other.cols) return NaN;
    var difference = new Matrix(this.rows,this.cols);
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.cols; j++) {
        difference.matrix[i][j] = this.matrix[i][j] - other.matrix[i][j];
      }
    }
    return difference;
  }

  this.mult = function(other) {
    // this.cols must equal other.rows for valid multiplication
    if (this.cols != other.rows) return NaN;
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

  this.multEW = function(other) { // Element-wise multiplication
    // Sizes of matrices must be equal for valid subtraction
    if (this.rows != other.rows || this.cols != other.cols) return NaN;
    var product = new Matrix(this.rows,this.cols);
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.cols; j++) {
        product.matrix[i][j] = this.matrix[i][j]*other.matrix[i][j];
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

  this.randomize = function() {
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.cols; j++) {
        this.matrix[i][j] = random(-1,1);
      }
    }
  }

  this.print = function() {
    console.table(this.matrix);
  }
}

Matrix.add = function(matrix1,matrix2) {
  return matrix1.add(matrix2);
}

Matrix.sub = function(matrix1,matrix2) {
  return matrix1.sub(matrix2);
}

Matrix.mult = function(matrix1,matrix2) {
  return matrix1.mult(matrix2);
}

Matrix.multEW = function(matrix1,matrix2) {
  return matrix1.multEW(matrix2);
}

Matrix.transpose = function(matrix) {
  return matrix.transpose();
}

Matrix.randomize = function(matrix) {
  return matrix.randomize();
}

Matrix.print = function(matrix) {
  matrix.print();
}

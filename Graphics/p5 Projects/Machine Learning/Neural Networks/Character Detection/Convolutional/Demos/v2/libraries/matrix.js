const e = 2.718281828;

const Matrix = function(rows,cols) {
  this.rows = rows;
  this.cols = cols;
  this.matrix = new Array(this.rows);
  for (let i = 0; i < this.matrix.length; i++) {
    this.matrix[i] = new Array(this.cols);
    for (let j = 0; j < this.matrix[i].length; j++) {
      this.matrix[i][j] = 0;
    }
  }

  this.add = function(other) {
    if (other instanceof Matrix) {
      // Sizes of matrices must be equal for valid addition
      if (this.rows != other.rows || this.cols != other.cols) return NaN;
      const sum = new Matrix(this.rows,this.cols);
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          sum.matrix[i][j] = this.matrix[i][j] + other.matrix[i][j];
        }
      }
      return sum;
    } else {
      return this.add(new Matrix(this.rows,this.cols).fill(other));
    }
  }

  this.sub = function(other) {
    // Sizes of matrices must be equal for valid subtraction
    if (this.rows != other.rows || this.cols != other.cols) return NaN;
    const difference = new Matrix(this.rows,this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        difference.matrix[i][j] = this.matrix[i][j] - other.matrix[i][j];
      }
    }
    return difference;
  }

  this.dot = function(other) {
    // this.cols must equal other.rows for valid multiplication
    if (this.cols != other.rows) return NaN;
    const product = new Matrix(this.rows,other.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < other.cols; j++) {
        let sum = 0;
        for (let k = 0; k < this.cols; k++) {
          sum += this.matrix[i][k]*other.matrix[k][j]
        }
        product.matrix[i][j] = sum;
      }
    }
    return product;
  }

  this.mult = function(other) { // Element-wise multiplication
    // Sizes of matrices must be equal for valid subtraction
    if (other instanceof Matrix) {
      if (this.rows != other.rows || this.cols != other.cols) return NaN;
      const product = new Matrix(this.rows,this.cols);
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
          product.matrix[i][j] = this.matrix[i][j]*other.matrix[i][j];
        }
      }
      return product;
    } else {
      return this.mult(new Matrix(this.rows,this.cols).fill(other));
    }
  }

  this.transpose = function() {
    const transposed = new Matrix(this.cols,this.rows);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        transposed.matrix[j][i] = this.matrix[i][j];
      }
    }
    return transposed;
  }

  this.randomize = function() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] = random(-1,1);
      }
    }
    return this;
  }

  this.fill = function(filler) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] = filler;
      }
    }
    return this;
  }

  this.sigmoid = function() { // regulate values between 0 and 1
    for (let i = 0; i < this.rows; i++) {
      this.matrix[i][0] = 1/(1 + pow(e,-this.matrix[i][0]));
    }
    return this;
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

Matrix.dot = function(matrix1,matrix2) {
  return matrix1.dot(matrix2);
}

Matrix.mult = function(matrix1,matrix2) {
  return matrix1.mult(matrix2);
}

Matrix.transpose = function(matrix) {
  return matrix.transpose();
}

Matrix.randomize = function(matrix) {
  return matrix.randomize();
}

Matrix.fill = function(matrix,filler) {
  return matrix.fill(filler);
}

Matrix.sigmoid = function(matrix) {
  return matrix.sigmoid();
}

Matrix.print = function(matrix) {
  matrix.print();
}

export class KalmanFilter {
  private x: number[]; // Estado
  private P: number[][]; // Covariância do estado
  private F: number[][]; // Matriz de transição
  private Q: number[][]; // Covariância do ruído do processo
  private R: number[][]; // Covariância do ruído da medição

  constructor() {
    // Inicializa com valores padrão para tracking 3D
    this.x = [0, 0, 0, 0]; // Estado inicial (posição/rotação)
    this.P = this.createIdentityMatrix(4); // Covariância inicial
    this.F = this.createIdentityMatrix(4); // Modelo de movimento constante
    this.Q = this.createIdentityMatrix(4, 0.001); // Pequeno ruído do processo
    this.R = this.createIdentityMatrix(4, 0.1); // Ruído da medição moderado
  }

  private createIdentityMatrix(size: number, value: number = 1): number[][] {
    return Array(size).fill(0).map((_, i) => 
      Array(size).fill(0).map((_, j) => i === j ? value : 0)
    );
  }

  private matrixMultiply(a: number[][], b: number[][]): number[][] {
    return a.map(row => 
      b[0].map((_, i) => 
        row.reduce((sum, cell, j) => sum + cell * b[j][i], 0)
      )
    );
  }

  update(measurement: number[]): number[] {
    // Predição
    const xPred = this.x;
    const PPred = this.matrixMultiply(
      this.matrixMultiply(this.F, this.P),
      this.F
    ).map((row, i) => 
      row.map((cell, j) => cell + this.Q[i][j])
    );

    // Ganho de Kalman
    const S = PPred.map((row, i) => 
      row.map((cell, j) => cell + this.R[i][j])
    );
    const K = PPred.map(row => 
      row.map((cell, j) => cell / S[0][j])
    );

    // Atualização
    const innovation = measurement.map((m, i) => m - xPred[i]);
    this.x = xPred.map((x, i) => 
      x + K[i].reduce((sum, k, j) => sum + k * innovation[j], 0)
    );

    this.P = this.P.map((row, i) => 
      row.map((cell, j) => 
        cell * (1 - K[i][j])
      )
    );

    return this.x;
  }
}
// https://de.wikipedia.org/wiki/Levenshtein-Distanz

const minimumEditDistance = (m, n) => {
  /* I\J | # | N | E | W | S | T | R |
   *  #  | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
   *  O  | 1 |   |   |   |   |   |   |
   *  L  | 2 |   |   |   |   |   |   |
   *  D  | 3 |   |   |   |   |   |   |
   *  S  | 4 |   |   |   |   |   |   |
   *  T  | 5 |   |   |   |   |   |   |
   *  R  | 6 |   |   |   |   |   |   |
   */

  const matrix = [];

  // fill y-axis
  for (let i = 0; i <= m.length; i++) {
    matrix[i] = [i];
  }

  // fill x-axis
  for (let j = 0; j <= n.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= m.length; i += 1) {
    for (let j = 1; j <= n.length; j += 1) {
      const indicator = m[i - 1] === n[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + indicator // substitution
      );
    }
  }

  return matrix;
};

module.exports = minimumEditDistance;

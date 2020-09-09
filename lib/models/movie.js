const pool = require('../utils/pool');

class Movie {
  id;
  title;
  year_released;
  watched;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.year_released = row.year_released;
    this.watched = row.watched;
  }

  static async insert(movie) {
    const { rows } = await pool.query(
      'INSERT INTO movies (title, year_released, watched) VALUES ($1, $2, $3) RETURNING *',
      [movie.title, movie.year_released, movie.watched]
    );

    return new Movie(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM movies WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Movie(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM movies'
    );

    return rows.map(row => new Movie(row));
  }

  static async update(id, updatedMovie) {
    const { rows } = await pool.query(
      `UPDATE movies
      SET title=$1, year_released=$2, watched=$3
      WHERE id = $4
      RETURNING *
      `,
      [updatedMovie.title, updatedMovie.year_released, updatedMovie.watched, id]
    );

    return new Movie(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM movies WHERE id = $1 RETURNING *',
      [id]
    );

    return new Movie(rows[0]);
  }
}

module.exports = Movie;

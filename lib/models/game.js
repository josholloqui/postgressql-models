const pool = require('../utils/pool');

class Game {
  id;
  name;
  played;
  age_played;
  difficulty;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.played = row.played;
    this.age_played = row.age_played;
    this.difficulty = row.difficulty;
  }

  static async insert(game) {
    const { rows } = await pool.query(
      'INSERT INTO games (name, played, age_played, difficulty) VALUES ($1, $2, $3, $4) RETURNING *',
      [game.name, game.played, game.age_played, game.difficulty]
    );

    return new Game(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM games WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Game(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM games'
    );

    return rows.map(row => new Game(row));
  }

  static async update(id, updatedGame) {
    const { rows } = await pool.query(
      `UPDATE games
      SET name=$1, played=$2, age_played=$3, difficulty=$4
      WHERE id = $5
      RETURNING *
      `,
      [updatedGame.name, updatedGame.played, updatedGame.age_played, updatedGame.difficulty, id]
    );

    return new Game(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM games WHERE id = $1 RETURNING *',
      [id]
    );

    return new Game(rows[0]);
  }
}

module.exports = Game;

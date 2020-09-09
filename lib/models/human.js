const pool = require('../utils/pool');

class Human {
  id;
  name;
  age;
  height;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.age = row.age;
    this.height = row.height;
  }

  static async insert(human) {
    const { rows } = await pool.query(
      'INSERT INTO humans (name, age, height) VALUES ($1, $2, $3) RETURNING *',
      [human.name, human.age, human.height]
    );

    return new Human(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM humans WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Human(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM humans'
    );

    return rows.map(row => new Human(row));
  }

  static async update(id, updatedHuman) {
    const { rows } = await pool.query(
      `UPDATE humans
      SET name=$1, age=$2, height=$3
      WHERE id = $4
      RETURNING *
      `,
      [updatedHuman.name, updatedHuman.age, updatedHuman.height, id]
    );

    return new Human(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM humans WHERE id = $1 RETURNING *',
      [id]
    );

    return new Human(rows[0]);
  }
}

module.exports = Human;

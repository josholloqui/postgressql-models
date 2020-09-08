const pool = require('../utils/pool');

class Chicken {
  id;
  name;
  age;
  weight;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.age = row.age;
    this.weight = row.weight;
  }

  static async insert(chicken) {
    const { rows } = await pool.query(
      'INSERT INTO chickens (name, age, weight) VALUES ($1, $2, $3) RETURNING *',
      [chicken.name, chicken.age, chicken.weight]
    );

    return new Chicken(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM chickens WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Chicken(rows[0]);
  }
}

module.exports = Chicken;

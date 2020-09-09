const pool = require('../utils/pool');

class Cat {
id;
name;
lucky;
color;
lives;

constructor(row) {
  this.id = row.id;
  this.name = row.name;
  this.lucky = row.lucky;
  this.color = row.color;
  this.lives = row.lives;
}

static async insert(cat) {
  const { rows } = await pool.query(
    'INSERT INTO cats (name, lucky, color, lives) VALUES ($1, $2, $3, $4) RETURNING *',
    [cat.name, cat.lucky, cat.color, cat.lives]
  );

  return new Cat(rows[0]);
}

static async findById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM cats WHERE id = $1',
    [id]
  );

  if(!rows[0]) return null;
  else return new Cat(rows[0]);
}

static async find() {
  const { rows } = await pool.query(
    'SELECT * FROM cats'
  );

  return rows.map(row => new Cat(row));
}

}

module.exports = Cat;

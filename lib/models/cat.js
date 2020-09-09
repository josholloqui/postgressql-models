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

}

module.exports = Cat;

const fs = require('fs');
const Chicken = require('./chicken');
const pool = require('../utils/pool');

describe('Chicken Model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('inserts new chicken into the database', async() => {
    const newChicken = await Chicken.insert({
      name: 'squack',
      age: 2,
      weight: '4 lbs'
    });

    const { rows } = await pool.query(
      'SELECT * FROM chickens WHERE id = $1',
      [newChicken.id]
    );

    expect(rows[0]).toEqual(newChicken);
  });

  it('finds the chicken by its id', async() => {
    const fred = await Chicken.insert({
      name: 'fred',
      age: 3,
      weight: '2.5 lbs'
    });

    const foundFred = await Chicken.findById(fred.id);

    expect(foundFred).toEqual({
      id: fred.id,
      name: 'fred',
      age: 3,
      weight: '2.5 lbs'
    });
  });
});

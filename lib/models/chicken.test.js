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

  it('returns null if cant find chicken by id', async() => {
    const noFred = await Chicken.findById(808);

    expect(noFred).toEqual(null);
  });

  it('finds all the chickens', async() => {
    await Promise.all([
      Chicken.insert({
        name: 'fred',
        age: 3,
        weight: '5 lbs'
      }),
      Chicken.insert({
        name: 'ted',
        age: 1,
        weight: '2.5 lbs'
      }),
      Chicken.insert({
        name: 'sid',
        age: 6,
        weight: '3.7 lbs'
      })
    ]);

    const chickens = await Chicken.find();

    expect(chickens).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'fred', age: 3, weight: '5 lbs' },
      { id: expect.any(String), name: 'ted', age: 1, weight: '2.5 lbs' },
      { id: expect.any(String), name: 'sid', age: 6, weight: '3.7 lbs' }
    ]));
  });

  it('updates chicken by id', async() => {
    const alphaChicken = await Chicken.insert({
      name: 'fred',
      age: 4,
      weight: '3.4 lbs'
    });

    const betaChicken = await Chicken.update(alphaChicken.id, {
      name: 'fred2',
      age: 5,
      weight: '4 lbs'
    });

    expect(betaChicken).toEqual({
      id: alphaChicken.id,
      name: 'fred2',
      age: 5,
      weight: '4 lbs'
    });
  });

  it('deletes a chicken by id', async() => {
    const createdChicken = await Chicken.insert({
      name: 'fred',
      age: 4,
      weight: '3.4 lbs'
    });

    const deletedChicken = await Chicken.delete(createdChicken.id);

    expect(deletedChicken).toEqual({
      id: createdChicken.id,
      name: 'fred',
      age: 4,
      weight: '3.4 lbs'
    });
  });
});

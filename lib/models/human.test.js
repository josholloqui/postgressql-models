const fs = require('fs');
const Human = require('./human');
const pool = require('../utils/pool');

describe('Human Model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('inserts new human into the database', async() => {
    const newHuman = await Human.insert({
      name: 'Will Smith',
      age: 51,
      height: '6 foot 2 inches'
    });

    const { rows } = await pool.query(
      'SELECT * FROM humans WHERE id = $1',
      [newHuman.id]
    );

    expect(rows[0]).toEqual(newHuman);
  });

  it('finds the human by its id', async() => {
    const will = await Human.insert({
      name: 'Will Smith',
      age: 51,
      height: '6 foot 2 inches'
    });

    const foundWill = await Human.findById(will.id);

    expect(foundWill).toEqual({
      id: will.id,
      name: 'Will Smith',
      age: 51,
      height: '6 foot 2 inches'
    });
  });

  it('returns null if cant find human by id', async() => {
    const noWill = await Human.findById(808);

    expect(noWill).toEqual(null);
  });

  it('finds all the humans', async() => {
    await Promise.all([
      Human.insert({
        name: 'Will Smith',
        age: 51,
        height: '6 foot 2 inches'
      }),
      Human.insert({
        name: 'The Rock',
        age: 48,
        height: '6 foot 5 inches'
      }),
      Human.insert({
        name: 'Vin Diesel',
        age: 53,
        height: '6 foot'
      })
    ]);

    const humans = await Human.find();

    expect(humans).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'Will Smith', age: 51, height: '6 foot 2 inches' },
      { id: expect.any(String), name: 'The Rock', age: 48, height: '6 foot 5 inches' },
      { id: expect.any(String), name: 'Vin Diesel', age: 53, height: '6 foot' }
    ]));
  });

  it('updates humans by id', async() => {
    const alphaHuman = await Human.insert({
      name: 'Will Smith',
      age: 51,
      height: '6 foot 2 inches'
    });

    const betaHuman = await Human.update(alphaHuman.id, {
      name: 'Will Smith2',
      age: 19,
      height: '8 foot 7 inches'
    });

    expect(betaHuman).toEqual({
      id: alphaHuman.id,
      name: 'Will Smith2',
      age: 19,
      height: '8 foot 7 inches'
    });
  });

  it('deletes a human by id', async() => {
    const createdHuman = await Human.insert({
      name: 'Will Smith',
      age: 51,
      height: '6 foot 2 inches'
    });

    const deletedHuman = await Human.delete(createdHuman.id);

    expect(deletedHuman).toEqual({
      id: createdHuman.id,
      name: 'Will Smith',
      age: 51,
      height: '6 foot 2 inches'
    });
  });

});

const fs = require('fs');
const Cat = require('./cat');
const pool = require('../utils/pool');

describe('Cat Model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('inserts new lucky cat into the database', async() => {
    const newCat = await Cat.insert({
      name: 'Becca',
      lucky: true,
      color: 'red and white',
      lives: 7
    });

    expect(newCat).toEqual({
      id: expect.any(String),
      name: 'Becca',
      lucky: true,
      color: 'red and white',
      lives: 7
    });
  });

  it('finds the lucky cat by its id', async() => {
    const becca = await Cat.insert({
      name: 'Becca',
      lucky: true,
      color: 'red and white',
      lives: 7
    });

    const foundBecca = await Cat.findById(becca.id);

    expect(foundBecca).toEqual({
      id: becca.id,
      name: 'Becca',
      lucky: true,
      color: 'red and white',
      lives: 7
    });
  });

  it('returns null if cant find lucky cat by id', async() => {
    const noBecca = await Cat.findById(808);

    expect(noBecca).toEqual(null);
  });
});

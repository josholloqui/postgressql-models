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
});

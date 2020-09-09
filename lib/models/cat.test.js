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

  it('finds all the cats', async() => {
    await Promise.all([
      Cat.insert({
        name: 'Becca',
        lucky: true,
        color: 'red and white',
        lives: 7
      }),
      Cat.insert({
        name: 'Steve',
        lucky: false,
        color: 'black and white',
        lives: 1
      }),
      Cat.insert({
        name: 'Kevin',
        lucky: true,
        color: 'orange',
        lives: 9
      })
    ]);

    const cats = await Cat.find();

    expect(cats).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'Becca', lucky: true, color: 'red and white', lives: 7 },
      { id: expect.any(String), name: 'Steve', lucky: false, color: 'black and white', lives: 1 },
      { id: expect.any(String), name: 'Kevin', lucky: true, color: 'orange', lives: 9 }
    ]));
  });

  it('updates cat by id', async() => {
    const alphaCat = await Cat.insert({
      name: 'Becca',
      lucky: true,
      color: 'red and white',
      lives: 7
    });

    const betaCat = await Cat.update(alphaCat.id, {
      name: 'Becca2',
      lucky: false,
      color: 'red',
      lives: 1
    });

    expect(betaCat).toEqual({
      id: alphaCat.id,
      name: 'Becca2',
      lucky: false,
      color: 'red',
      lives: 1
    });
  });

  it('deletes a cat by id', async() => {
    const createdCat = await Cat.insert({
      name: 'Becca',
      lucky: true,
      color: 'red and white',
      lives: 7
    });

    const deletedCat = await Cat.delete(createdCat.id);

    expect(deletedCat).toEqual({
      id: createdCat.id,
      name: 'Becca',
      lucky: true,
      color: 'red and white',
      lives: 7
    });
  });

});

const fs = require('fs');
const Movie = require('./movie');
const pool = require('../utils/pool');

describe('Movie Model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('inserts new movie into the database', async() => {
    const newMovie = await Movie.insert({
      title: 'Spirited Away',
      year_released: 2001,
      watched: true
    });

    const { rows } = await pool.query(
      'SELECT * FROM movies WHERE id = $1',
      [newMovie.id]
    );

    expect(rows[0]).toEqual(newMovie);
  });

  it('finds the movie by its id', async() => {
    const fred = await Movie.insert({
      title: 'Spirited Away',
      year_released: 2001,
      watched: true
    });

    const foundFred = await Movie.findById(fred.id);

    expect(foundFred).toEqual({
      id: fred.id,
      title: 'Spirited Away',
      year_released: 2001,
      watched: true
    });
  });

  it('returns null if cant find movie by id', async() => {
    const noFred = await Movie.findById(808);

    expect(noFred).toEqual(null);
  });

  it('finds all the movies', async() => {
    await Promise.all([
      Movie.insert({
        title: 'Spirited Away',
        year_released: 2001,
        watched: true
      }),
      Movie.insert({
        title: 'Iron Man',
        year_released: 2008,
        watched: false
      }),
      Movie.insert({
        title: 'About Time',
        year_released: 2013,
        watched: true
      })
    ]);

    const movies = await Movie.find();

    expect(movies).toEqual(expect.arrayContaining([
      { id: expect.any(String), title: 'Spirited Away', year_released: 2001, watched: true },
      { id: expect.any(String), title: 'Iron Man', year_released: 2008, watched: false },
      { id: expect.any(String), title: 'About Time', year_released: 2013, watched: true }
    ]));
  });

  it('updates movie by id', async() => {
    const alphaMovie = await Movie.insert({
      title: 'Spirited Away',
      year_released: 2001,
      watched: true
    });

    const betaMovie = await Movie.update(alphaMovie.id, {
      title: 'Spirited Away2',
      year_released: 2002,
      watched: false
    });

    expect(betaMovie).toEqual({
      id: alphaMovie.id,
      title: 'Spirited Away2',
      year_released: 2002,
      watched: false
    });
  });

  it('deletes a movie by id', async() => {
    const createdMovie = await Movie.insert({
      title: 'Spirited Away',
      year_released: 2001,
      watched: true
    });

    const deletedMovie = await Movie.delete(createdMovie.id);

    expect(deletedMovie).toEqual({
      id: createdMovie.id,
      title: 'Spirited Away',
      year_released: 2001,
      watched: true
    });
  });
});
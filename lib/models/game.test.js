const fs = require('fs');
const Game = require('./game');
const pool = require('../utils/pool');

describe('Game Model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('inserts new game into the database', async() => {
    const newGame = await Game.insert({
      name: 'God of War',
      played: true,
      age_played: 23,
      difficulty: 'regular'
    });

    const { rows } = await pool.query(
      'SELECT * FROM games WHERE id = $1',
      [newGame.id]
    );

    expect(rows[0]).toEqual(newGame);
  });

  it('finds the game by its id', async() => {
    const godOfWar = await Game.insert({
      name: 'God of War',
      played: true,
      age_played: 23,
      difficulty: 'regular'
    });

    const foundGodOfWar = await Game.findById(godOfWar.id);

    expect(foundGodOfWar).toEqual({
      id: godOfWar.id,
      name: 'God of War',
      played: true,
      age_played: 23,
      difficulty: 'regular'
    });
  });

  it('returns null if cant find game by id', async() => {
    const noGame = await Game.findById(808);

    expect(noGame).toEqual(null);
  });

  it('finds all the games', async() => {
    await Promise.all([
      Game.insert({
        name: 'God of War',
        played: true,
        age_played: 23,
        difficulty: 'regular'
      }),
      Game.insert({
        name: 'Halo Infinite',
        played: false,
        age_played: 25,
        difficulty: 'hard'
      }),
      Game.insert({
        name: 'Skyrim',
        played: true,
        age_played: 15,
        difficulty: 'easy'
      })
    ]);

    const games = await Game.find();

    expect(games).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'God of War', played: true, age_played: 23, difficulty: 'regular' },
      { id: expect.any(String), name: 'Halo Infinite', played: false, age_played: 25, difficulty: 'hard' },
      { id: expect.any(String), name: 'Skyrim', played: true, age_played: 15, difficulty: 'easy' }
    ]));
  });

  it('updates game by id', async() => {
    const alphaGame = await Game.insert({
      name: 'God of War',
      played: true,
      age_played: 23,
      difficulty: 'regular'
    });

    const betaGame = await Game.update(alphaGame.id, {
      name: 'God of War2',
      played: false,
      age_played: 25,
      difficulty: 'hard'
    });

    expect(betaGame).toEqual({
      id: alphaGame.id,
      name: 'God of War2',
      played: false,
      age_played: 25,
      difficulty: 'hard'
    });
  });

  it('deletes a game by id', async() => {
    const createdGame = await Game.insert({
      name: 'God of War',
      played: true,
      age_played: 23,
      difficulty: 'regular'
    });

    const deletedGame = await Game.delete(createdGame.id);

    expect(deletedGame).toEqual({
      id: createdGame.id,
      name: 'God of War',
      played: true,
      age_played: 23,
      difficulty: 'regular'
    });
  });
});

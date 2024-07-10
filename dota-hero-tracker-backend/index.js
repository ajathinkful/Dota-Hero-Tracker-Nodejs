const express = require('express');
const axios = require('axios');
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig['development']); // Adjust environment as needed

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors'); // Import cors middleware

app.use(cors()); // Enable CORS for all routes

const fetchAndStoreMatches = async () => {
  try {
    const response = await axios.get('https://api.opendota.com/api/players/124197337/recentMatches');
    const matches = response.data;

    for (const match of matches) {
      await knex.raw(`
        INSERT INTO matches (match_id, player_id, hero_id, win, gpm, kills, deaths, assists, game_mode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT (match_id)
        DO UPDATE SET
          player_id = EXCLUDED.player_id,
          hero_id = EXCLUDED.hero_id,
          win = EXCLUDED.win,
          gpm = EXCLUDED.gpm,
          kills = EXCLUDED.kills,
          deaths = EXCLUDED.deaths,
          assists = EXCLUDED.assists,
          game_mode = EXCLUDED.game_mode
      `, [
        match.match_id,
        124197337, // Assuming player_id is the same for all matches
        match.hero_id,
        match.radiant_win ? match.player_slot < 128 : match.player_slot >= 128,
        match.gold_per_min,
        match.kills,
        match.deaths,
        match.assists,
        match.game_mode
      ]);

      // Check the number of Turbo matches in the database
      const turboCountResult = await knex('matches').where('game_mode', 23).count('id as count').first();
      const turboCount = parseInt(turboCountResult.count);

      // Delete the oldest Turbo match if the count exceeds 200
      if (turboCount > 200) {
        await knex('matches')
          .where('game_mode', 23)
          .orderBy('match_id', 'asc')
          .limit(1)
          .del();
      }

      // Check the number of All Pick matches in the database
      const allPickCountResult = await knex('matches').where('game_mode', 22).count('id as count').first();
      const allPickCount = parseInt(allPickCountResult.count);

      // Delete the oldest All Pick match if the count exceeds 200
      if (allPickCount > 200) {
        await knex('matches')
          .where('game_mode', 22)
          .orderBy('match_id', 'asc')
          .limit(1)
          .del();
      }
    }
    console.log('Matches fetched and stored successfully');
  } catch (error) {
    console.error('Error fetching and storing matches:', error);
  }
};

// Endpoint to manually fetch and store recent matches data
app.get('/fetch-and-store-matches', async (req, res) => {
  try {
    await fetchAndStoreMatches();
    res.json({ message: 'Matches fetched and stored successfully' });
  } catch (error) {
    console.error('Error fetching and storing matches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to fetch all matches from the database
app.get('/matches', async (req, res) => {
  try {
    const matches = await knex('matches').select('*');
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  fetchAndStoreMatches();
  setInterval(fetchAndStoreMatches, 10800000); //3hr interval
});

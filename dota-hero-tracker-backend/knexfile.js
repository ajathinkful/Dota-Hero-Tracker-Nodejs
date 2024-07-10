// knexfile.js

module.exports = {
  development: {
    client: 'pg',
    connection: {
      connectionString: 'postgres://svhapqwh:rPT_DF_OpvGMaaZKvj6DtnxYIrxm0SoG@jelani.db.elephantsql.com/svhapqwh',
      ssl: {
        rejectUnauthorized: false,
      },
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
};

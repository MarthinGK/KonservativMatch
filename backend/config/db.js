const { Pool } = require('pg');

// Set up the connection pool 
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'konservativdatingdb',
  password: '1728',
  port: 5432,  // Default port for PostgreSQL d
});

module.exports = pool;
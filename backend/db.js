require('dotenv').config(); // Ensure this is at the top of the file
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DATABASE_USERNAME,
  host: process.env.DATABASE_EXTERNAL_HOSTNAME,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,  // Default port for PostgreSQL d
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

module.exports = pool;



// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'konservativdatingdb',
//   password: '1728',
//   port: 5432,  // Default port for PostgreSQL d
// });

// module.exports = pool;


// const pool = new Pool({
//   user: process.env.DATABASE_USERNAME,
//   host: process.env.DATABASE_HOSTNAME,
//   database: process.env.DATABASE_NAME, // Fix: Use DATABASE_NAME, not DATABASE_HOSTNAME
//   password: process.env.DATABASE_PASSWORD,
//   port: 5432, // Default port for PostgreSQL
//   ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false, // Conditional SSL
// });

// module.exports = pool;

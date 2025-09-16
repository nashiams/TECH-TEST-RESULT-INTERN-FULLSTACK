const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5433,
  database: "tech_test_intern_fullstack",
  idleTimeoutMillis: 500,
});

module.exports = pool;

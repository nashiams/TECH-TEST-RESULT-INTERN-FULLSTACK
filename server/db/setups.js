const { createUsers, drop, createProducts } = require("../sql/sql_db");
const pool = require("./pool");

async function setup() {
  //   await pool.query(`CREATE DATABASE IF NOT EXISTS tech_test_intern_fullstack`);
  await pool.query(drop);
  console.log("drop ok");
  await pool.query(createUsers);
  console.log("table1 ok");
  await pool.query(createProducts);
  console.log("table2 ok");
}

setup();

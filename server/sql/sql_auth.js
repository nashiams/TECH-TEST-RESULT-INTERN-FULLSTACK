let createNewUserQuery = `
        INSERT INTO "Users" (username, password)
        VALUES ($1, $2)
        RETURNING id, username
      `;

let searchingUserQuery = `SELECT * FROM "Users" WHERE username = $1`;

module.exports = { createNewUserQuery, searchingUserQuery };

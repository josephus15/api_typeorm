const config = require('../config.json'); // Ensure correct path
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
  try {
    // Read database credentials from config.json
    const { host, port, user, password, database } = config.database;

    // Ensure all required fields exist
    if (!host || !user || !database) {
      throw new Error("Database configuration is incomplete.");
    }

    // Create DB connection (including password)
    const connection = await mysql.createConnection({ host, port, user, password });

    // Fix: Correct string interpolation for database creation
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // Connect to database using Sequelize
    const sequelize = new Sequelize(database, user, password, { host, dialect: 'mysql' });

    // Initialize models
    db.User = require('../users/user.model')(sequelize);

    // Sync models with database
    await sequelize.sync({ alter: true });

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
  }
}

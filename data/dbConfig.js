const knex = require('knex');

const env = process.env.DB_ENV || 'development';
const config = require('../knexfile');

// select the development object
const db = knex(config[env]);

modules.export = db;
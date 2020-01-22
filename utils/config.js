/* eslint-disable prefer-const */
require("dotenv").config()

let { PORT } = process.env
let { MONGODB_URI } = process.env

module.exports = {
  MONGODB_URI,
  PORT,
}

const Pool = require("pg").Pool
const pool = new Pool({
    user: "postgres",
    password: "JaishreeRam!",
    host: "localhost",
    port: 5432,
    database: "wedding"

})

module.exports = pool
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

if (process.env.NODE_ENV == 'production') {
    var env_path = fs.readFileSync(path.join(process.cwd(), '.env.prod'))
} else {
    var env_path = fs.readFileSync(path.join(process.cwd(), '.env'))
}
const config = dotenv.parse(env_path)

var db_password ="";
if (config.DB_PASSWORD) {
    db_password = `:${config.DB_PASSWORD}`
}

module.exports = {
    url: `${config.DB_DRIVER}://${config.DB_USER}${db_password}@${config.DB_HOST}/${config.DB_DATABASE}`,
    dialect: config.DB_DRIVER
}
var env = process.env.NODE_ENV || 'development';

// Configuration of environment
// Configuration stored in config.json file in this directory
// There are two configuration: development and test
// For production we use environment of Heroku
// Load config.json file retrieve all the keys and values and set them into environment process
if (env === 'development' || env === 'test') {
    var config = require('./config.json');
    var envConfig = config[env];
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}
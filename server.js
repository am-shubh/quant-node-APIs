//Dependencies
require('dotenv').config()
const http = require('http');
const app = require('./app');

// defining port
const port = process.env.PORT || 8800;

//creating server
const server = http.createServer(app);

// Start the server
server.listen(port, () => {
    console.log('The server is up and running now on port '+ port);
});

module.exports = server;
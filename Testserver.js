const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
let username;
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'sql12.freesqldatabase.com',
    user: 'sql12661021',
    password: 'sR9jZsnCs1',
    database: 'sql12661021',
});

// Open the connection
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Insert a name into the table
const nameToInsert = 'John Doe';
connection.query('INSERT INTO your_table_name (name) VALUES (?)', [nameToInsert], (err, results) => {
    if (err) {
        console.error('Error inserting name:', err);
        return;
    }
    console.log('Name inserted successfully. Inserted ID:', results.insertId);
});

// Close the connection after inserting
connection.end((err) => {
    if (err) {
        console.error('Error closing connection:', err);
        return;
    }
    console.log('Connection closed');
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    socket.on("enckey/sid",(data)=>{
        io.emit("enckey/sid", ({user: data.user , key: data.key , sid: data.sid }));
    });
    socket.on("message" , (data)=>{
        io.emit("message" , ({message:data.message,time:data.time,to:data.to,from:data.from}))  });
    socket.on("newuser" , (data) =>{
        io.emit("newuser", data);
        io.emit("socektID", ({to: data , Sid: socket.id}));
    });
    socket.on("disconnect",  ()=>{
        io.emit("disc" , ({sid: socket.id}));
    });
});

const PORT = process.env.PORT || 5500;

server.listen(PORT, () => {
    console.log(`Server is up and running, server listening on port ${PORT}.`);
});

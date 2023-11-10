const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
let username;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    const Sid = socket.id;
    socket.on("enckey/sid",(data)=>{
        io.emit("enckey/sid", ({user: data.user , key: data.key , sid: data.sid }));
    });
    socket.on("message" , (data)=>{
        io.emit("message" , ({message:data.message,time:data.time,to:data.to,from:data.from}))  });
    socket.on("newuser" , (data) =>{
        io.emit("newuser", data);
        io.emit("socektID", ({to: data , Sid: Sid}));
    });
    socket.on("disconnect",  ()=>{
        io.emit("disc" , ({sid: Sid}));
    });
});

const PORT = process.env.PORT || 5500;

server.listen(PORT, () => {
    console.log(`Server is up and running, server listening on port ${PORT}.`);
});

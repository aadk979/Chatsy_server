const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
let username;
const systemstorage = {};
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
function savetosystemstorage(key, data1, data2) {
  systemstorage[key] = { name:data1, uic:data2};
}

// Function to retrieve data
function retrievefromsystemstorage(key) {
  return systemstorage[key];
}

io.on("connection", (socket) => {
    socket.on("enckey",(data)=>{
        io.emit("enckey", ({user: data.user , key: data.key }));
    });
    socket.on("message" , (data)=>{
        io.emit("message" , ({message:data.message,time:data.time,to:data.to,from:data.from}))  });
    socket.on("newuser" , (data) =>{
        io.emit("newuser", data);
    });
    socket.on("id" ,  (data)=>{
        io.emit("id" , ({user: data.user ,uic: data.uic}));
        savetosystemstorage(socket.id , data.user ,data.uic);
        console.log(retrievefromsystemstorage(socket.id));
    })
    socket.on("disconnect" , ()=>{
      const dat = retrievefromsystemstorage(socket.id);
      io.emit("disc" , ({uic: dat.uic}));
      
    })
});

const PORT = process.env.PORT || 5500;

server.listen(PORT, () => {
    console.log(`Server is up and running, server listening on port ${PORT}.`);
});

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

function generateUniqueCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < 15; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));

    // Add a dash every 5 characters except for the last one
    if ((i + 1) % 5 === 0 && i !== 14) {
      code += '-';
    }
  }

  return code;
}

function savetosystemstorage(key, data1, data2) {
  systemstorage[key] = { name:data1, uic:data2};
}

// Function to retrieve data
function retrievefromsystemstorage(key) {
  return systemstorage[key];
}

io.on("connection", (socket) => {
  	socket.on("redirect-request" , (data)=>{
      const code = generateUniqueCode();
      io.emit(data,{link:"https://fearfulnoxiouslegacy.development98979.repl.co/" , uic: code});
    })
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
      const data = retrievefromsystemstorage(socket.id);
      let s = data.uic;
      io.emit("disc" , ({uic: s , t: "t"}));
      
    })
});

const PORT = process.env.PORT || 5500;

server.listen(PORT, () => {
    console.log(`Server is up and running, server listening on port ${PORT}.`);
});

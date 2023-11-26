const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
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

let systemstorage = {};

function savetosystemstorage(key, data1, data2) {
    systemstorage[key] = { name: data1, uic: data2 };
}

function retrieveSecondData(key) {
    const storedData = systemstorage[key];

    if (storedData) {
        return storedData.uic;
    } else {
        return null;
    }
}

function deleteFromSystemStorage(key) {
  delete systemstorage[key];
  console.log(`Data with key '${key}' has been deleted.`);
}

function grc() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let code = '';

  for (let i = 0; i < 30; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

io.on("connection", (socket) => {
    socket.on("val", (data) => {
    	if (retrieveSecondData(data.uic) === data.val) {
     	 io.emit(data.id, "valid");
       deleteFromSystemStorage(data.uic);
    	} else {
     	 io.emit(data.id, "invalid");
       deleteFromSystemStorage(data.uic);
    	}
  	});

  socket.on("redirect-request", (data) => {
    const cody = grc();
    const code = generateUniqueCode();
    io.emit(data, { link: "https://conversation-hub-chat.netlify.app", uic: code, vc: cody });
    savetosystemstorage(code, code, cody);
  });

    socket.on("key", (data) => {
        io.emit("key", { to: data.to,from: data.from, key: data.key });
    });

    socket.on("message", (data) => {
        io.emit("message", { message: data.message, time: data.time, to: data.to, from: data.from });
    });

    socket.on("newuser", (data) => {
        io.emit("newuser", data);
    });

    socket.on("id", (data) => {
        io.emit("id", { user: data.user, uic: data.uic });
        savetosystemstorage(socket.id, data.user, data.uic);
    });

    socket.on("database", (data)=>{
      let apiKey = "AIzaSyBUPdvAhW0_nvsORmn-FbMjKHmMQ6k9RW8";
  		let authDomain = "chat-app-1c51b.firebaseapp.com";
  		let projectId = "chat-app-1c51b";
  		let storageBucket = "chat-app-1c51b.appspot.com";
  		let messagingSenderId = "799254440677";
  		let appId = "1:799254440677:web:bf21610dd8e99c10a5820c";
  		let measurementId = "G-E4HENDDV36";
      io.emit(data, ({api: apiKey,dom: authDomain , pi: projectId , sb: storageBucket , ms: messagingSenderId, ai: appId , mi: measurementId}));
    });

    socket.on("disconnect", () => {
        const data = retrieveSecondData(socket.id);
        io.emit("disc", { uic: data });
        deleteFromSystemStorage(socket.id);
    });
});

const PORT = process.env.PORT || 5500;

server.listen(PORT, () => {
    console.log(`Server is up and running, server listening on port ${PORT}.`);
});

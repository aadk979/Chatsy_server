const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://chatsy-entry.netlify.app" , "https://chatsy-chat.netlify.app" , "https://official-entry-point.development98979.repl.co" , "https://chatsyonline.web.app"],
        methods: ["GET", "POST"]
    }
});

const admin = require('firebase-admin');

// Your Firebase Admin SDK configuration
const serviceAccount = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key.replace(/\\n/g, '\n'), // Replace escaped newlines
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url,
};

// Your Firestore database URL
const databaseURL = 'https://chat-app-1c51b-default-rtdb.firebaseio.com/';

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL,
});

function saveToReportLog(name, reason, sender) {
  // Add a new document with the specified data
  admin.firestore().collection('report_log').add({
    name: name,
    reason: reason,
    sender: sender
  })
  .then((docRef) => {
    console.log('Document written with ID: ', docRef.id);
  })
  .catch((error) => {
    console.error('Error adding document: ', error);
  });
}

async function ban(ip,c,d) {
  // Get a reference to the 'banned' collection
  const bannedCollection = admin.firestore().collection('banned');

  // Get a reference to the document with the given name
  const docRef = bannedCollection.doc(ip);

  try {
    // Try to get the document
    const docSnapshot = await docRef.get();

    // Check if the document exists
    //docSnapshot.data()
    if (docSnapshot.exists) {
      // Log the document data
      const datar = docSnapshot.data();
      io.emit(c, datar.trial);
      docRef.set({ip:ip, trial: (datar.trial + 1)});
    } else {
      // If the document doesn't exist, add it
      await docRef.set({
        ip: ip,
        trial: 1,
        date_start:d
      });
      io.emit(c, 1);
    }
  } catch (error) {
    // Handle errors
    console.error('Error accessing document:', error);
  }
}

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
  console.log("com");
    socket.on("val", (data) => {
    	if (retrieveSecondData(data.uic) === data.val) {
     	 io.emit(data.id, "valid");
       deleteFromSystemStorage(data.uic);
    	} else {
     	 io.emit(data.id, "invalid");
       deleteFromSystemStorage(data.uic);
    	}
  	});

    socket.on("ban" , (data)=>{
      ban(data.ip,data.c,data.date);
      console.log(data.c);
    });

  socket.on("redirect-request", (data) => {
    const cody = grc();
    const code = generateUniqueCode();
    io.emit(data, { link: "https://chatsy-chat.netlify.app", uic: code, vc: cody });
    savetosystemstorage(code, code, cody);
  });

    socket.on("report", (data)=>{
        io.emit("report" , ({name: data.name}));
        saveToReportLog(data.name,data.reason,data.reporter);
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

const PORT = process.env.PORT || 5764;

server.listen(PORT, () => {
    console.log(`Server is up and running, server listening on port ${PORT}.`);
});

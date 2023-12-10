const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const server = http.createServer(app);
const crypto = require('crypto');
const io = new Server(server, {
    cors: {
        origin: '*',
        //origin: ["https://chatsy-entry.netlify.app" , "https://chatsy-chat.netlify.app" , "https://official-entry-point.development98979.repl.co" , "https://chatsyonline.web.app"],
        methods: ["GET", "POST"]
    }
});
const pk = process.env.pk;
const spk = process.env.spk;
console.log(spk);

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
  let ac;

  // Disable the user using Firebase Admin SDK
  admin.auth().updateUser(name, {
    disabled: true,
  })
  .then((r) => { 
    ac = `User with uid ${r.uid} has been suspended.`;

    // Add a new document with the specified data
    return admin.firestore().collection('report_log').add({
      name: name,
      reason: reason,
      sender: sender,
      action_taken: ac
    });
  })
  .then((docRef) => {
    console.log('Document written with ID: ', docRef.id);
  })
  .catch((error) => {
    console.error('Error adding document: ', error);
  });
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
function dec(m){
    const decryptedData = crypto.privateDecrypt({key: spk,passphrase: '' }, m );
    return decryptedData;
}

io.on("connection", (socket) => {
    console.log("com");
    socket.on('p-reset', (data) => {
        admin.auth().sendPasswordResetEmail(data.e)
            .then(() => {
                io.emit(data.c, 'Password reset link sent to your email.');
            })
            .catch((error) => {
                io.emit(data.c, 'Something went wrong. Try again later.');
            });
    });

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
        io.emit(data.c, { vc: cody });
        savetosystemstorage(data.uid, data.uid, cody);
    });

    socket.on("report", (data)=>{
        io.emit("report" , ({name: data.reported_id}));
        saveToReportLog(data.reported_id,data.reason,data.reporter);
    });
    socket.on("key", (data) => {
        io.emit((data.to +'key').toString(), { to: data.to,from: data.from, key: data.key });
    });

    socket.on("message", (data) => {
        io.emit((data.to +'mess').toString(), { message: data.message, time: data.time, to: data.to, from: data.from });
    });

    socket.on('dbe' , (data)=>{
        admin.firestore().collection('messages').add({data});
    });

    socket.on('d-req', (data)=>{
        const d = dec(data.d);
        io.emit(data.c , d);
    });
    
    socket.on('req-pk',(data)=>{
        io.emit(data.c , ({pk:pk}));
    });
    
    socket.on("newuser", (data) => {
        io.emit("newuser", ({uid:data.uid , name:data.name}));
    });

    socket.on("id", (data) => {
        io.emit("id", { user: data.user, uic: data.uic });
        savetosystemstorage(socket.id, data.user, data.uic);
    });

    socket.on("disconnect", () => {
        const data = retrieveSecondData(socket.id);
        io.emit("disc", { uic: data });
        deleteFromSystemStorage(socket.id);
    });
});

const PORT = process.env.PORT || 5764;

server.listen(PORT, () => {
    console.log(`Server is up and running on port : ${PORT}.`);
});

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

const admin = require('firebase-admin');

// Your Firebase Admin SDK configuration
const serviceAccount = {
  "type": "service_account",
  "project_id": "chat-app-1c51b",
  "private_key_id": "29c2ea244b666f5553cdcd3eb3adb22638ad9be3",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCcOtqg6aOqlcuh\nrm1BFEkcBSL0VOvphn+4EO1ibbGhIcsjHple9DYs6F1M8UrrRZvf2wbwzmY6Pwtk\nLswYUt1zYn5TqfDCViP6l1vUu2P+eLpKwLl2XJMTttFJIFKYDCY+nH9ERj4I0OWN\nPLuvCg+Qc4DtYR1tMypmoFx8u/NUM7Nd0kfw2SMnZ1N25kLMh58tPJ66SiuMMNAm\niVyF5A4KYdHFSWVsBSYsbwteb5yp05PqQyyYqPuuboRx0SbnvX5zvBlqEqYhfmER\nja8Jf1SumrlL6MiymwyGU5YeVVZAewJYatZYWGErkYPmlM9mlPvtUIOztLSQSvTB\nGMzwgF2jAgMBAAECggEADnk3WvP6OSoCgPqPXZmbAlEJgXhCmNJgj7VlwJon/CUM\n1DaX/9+BC10Fk8TA65X50F3SwUll2BySGhhpyREYOgHUcTzLtL1VPPh7xfQMWf1m\nSNmc9PWznH5x2iP38uUhP+iws6sMQTXVJmYLfzZf5cKFnbhDCSRV18cgel/RNaol\nXB387vybI85+t0JXpq9Ll3kkmIIUnpQLlziYPz8cowP3KNGV7R12BztpfTinBDhE\njahppwy28YdUtG30afp7s3JQJ/Eq7xLEPKIbHKMnIhwGmwlDEyuLq0xqaO+Xwpk6\nnpa/LPEhZZwNQMM4xHq2pTF+bXkZvOvWD1oLj5lMtQKBgQDWxLARDN9KBIGrRyi6\nM+00XX6ACpiQMQREFn3jw12BbKWVfuUjoa7zLRLaV2Hv7JrpFOSa8tQYMzM052Om\n19Z06zJrDxzeDkxXreST9Tx6jD/Qnez+DVO91OeVRleMsg4J+zx1TSawHyDytXz1\nBkkTEgh0GHMNOG7xGuOtStEZBwKBgQC6OSc61X2rVB49iuA3qSen2pxy5ydCvcoF\n+CFAOW9CK3yvxZc5I2RscCbi+dmc7tYuaPd24AYYMozTSvwl+yl7AA06pV3DgtZ8\nL4KUFIYn5SA/2fzMgPLxjxNYIUBmBQi3L5CsfRZ7PKgabEr0bNdXZNuBDPjejmqy\n4DMwEGh7hQKBgQCf2SDab+Q5aQVB/+KWRFPGZ9fhYQGQQItWSg9E2IHd9ImBrULK\ntGpMYD3p+KPSOR5LYNuNYDLwGBuCwr3uzjK2LuAFwufPdoDnuWupnBt5cq2EjiZ4\nKF8tqSr8dbBv7Y55a17iR5wF9gVF4EKy9Ayrfv5/ujrXmisolMTklAzxPQKBgHF4\nM8Qwo+NKXSbIwTiJNKWdmiiVWqHbPQcIG1Kj7HwYPWBo+G0TeLRuXfN9pDBwg0dC\nJE9lz7Dc1FxG239VHABblrP+YTSpO4Ht/RW3r8sNXOorLFN72wx/Tp0rna7MMHRW\nYkQH8DPlUNTQ2Zc33rrctLdcrSQHCVK3M9l8lf11AoGABzDlSOrk78Cb4iUqJX5y\n8FeqRQJmFb6uDVpJiJheiKLvh3ulNZWigWk2jNVJwCmJC6mCTOGPjiUttFsOW909\nTdIbJ0LuZr4OZpazhk4IrdDtWwEBv/kdaB+ByU3ho9i6/o6LaxFEgQS+g/n9LUzK\nK/DuTmEEyde4TBrYbO7mbyk=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fqhxg@chat-app-1c51b.iam.gserviceaccount.com",
  "client_id": "113227241884187599583",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fqhxg%40chat-app-1c51b.iam.gserviceaccount.com",
};

// Your Firestore database URL
const databaseURL = 'https://chat-app-1c51b-default-rtdb.firebaseio.com/';

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL,
});
async function saveToReportLog(name, reason, sender) {
  // Add a new document with the specified data
  db.collection('report_log').add({
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

function ban(ip,c,d) {
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
    io.emit(data, { link: "https://conversation-hub-chat.netlify.app", uic: code, vc: cody });
    savetosystemstorage(code, code, cody);
  });

    socket.on("report", (data)=>{
        io.emit("report" , ({name: data.name}));
        saveToReportLog(data.name,data.reason,data.reproter);
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

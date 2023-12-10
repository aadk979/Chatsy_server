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

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

function getPublicKey() {
  return publicKey;
}

function gk(){
  return privateKey;
}

const pubkey = getPublicKey();
const privatekey = gk();

const admin = require('firebase-admin');

// Your Firebase Admin SDK configuration
const serviceAccount = {
  "type": "service_account",
  "project_id": "chatsy-2fb9e",
  "private_key_id": "f76cbe54f74bf7a330a40a946b76d0f8f9e25dcb",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCeuf+8kFy1cwWg\nm548rPT5bG/1O254DsJphiIoFAnyiptXkXQsJTZ8xnxfQCeYVAVeyZQ4BckKnNgg\nmBbp21HuAiyRD+2cj/4xVQzj8qZtS2QvpCuyk4N0aewToMJfnUgykMxQOVGnuvEl\nvnWpmccgI2BSUF7FCjb6KlJbb0AReR/exTZAwUAG4AEQKXIRT+ddCACrIPOcWkA5\nYYXbhUHLDEuwAixAT2Q7CLV/M/02ZgpUWcvQOCTZYfCK44UNMA40Urh21wdtXs1S\nvcx4QQU9ZSXZaFuAQitxuJxcAj4q1OyhS1BbqKuX99qE1cI+Mz0MwnEulusKOfoP\nLJg2jj61AgMBAAECggEAGKHf1KkIoiYUAP01fNAQgma4JzQObDZKKGsnANY/RvMI\nsXnCsBkkUA/TfEqt+l9LqA6bYGhRb0Kw7bn8kFU3bTrMJMT2iH32IjzDL9rXxg1V\nomkVWPS4iUfo2ZDwqTr02dgLxQVoLSH/S263vta9BrlGuO99DZIMvxzzQ/pLVIqb\nQahHsy+D4bNHowc7DseJShLnoTdYnKrqFzYREr2B7jqix+sscLVdZcJ2oqXUtI1d\naPeppBCYAyb2iTfOkej0LepEfBwpKhXhac9gpn2xcc4J12++1UudnHgMrpeZpcDM\nVQozISK22Zts+PT6qJ1OTA6eTVQ2cLdBMs8kQmIXfwKBgQDbubttBg4wH3FTSos4\nA5ZDsO46l2BQ+DKVd5NDHjcGmS/GHvFEAf/0IvGB3NQSCIixYMdCQbbatklNW3cV\nbEWInT1W0k4A0+CkYrtbUn+WHG2uDBgNcpnVHgzIRamTaMgBLKRg8CQvVyPHLN41\nw8tkhTig7wMknKp9uHAiTsU4EwKBgQC47kP8EArEqbjS10Dqk5GXP2h6Uo3oZuA5\nxkt0CpprRxdiLNMHO06q4KFUTaAVNG61wrOPCcX3XoM7L/f9DtyZoSP+4BxoHieS\nf82fOdvDsLSFv03OYsYniDlPWGZt77Y0PcDx7bruJKfCouOivUkTok9FB59CQfjn\nQBYhRJGXFwKBgCBWNEQ2SO5CIl58sQJ8XKf3qQfMcWtZK7CdmXmeP8Dj2IkS0rUM\niku2vM483qUMxnk8YfbZTvzfKOiOlnb7qTwS0A0wBDTQ+dWXhjVJbed8pZOgygVo\noUUhGAZ9YhiEqjKqDEML9HdXHrfYXZeSCiPwC0Z8Bn1j5R99fls+Nn4rAoGAGvcD\nCrn8F/j3bibc3FdwHzGrtkpbTsvRXhs/3Ue+hG31RudqTd+j9N6UJ4q6EN14VyBw\ntiaiqxMo53RzIH8OQ4hvizZ6beQXuRDRlqoFFV+qsuXWHoXghtsiICOvq9AMLUnj\n3GLhot/NZmAB+TTIdwhvro0R98NO28lIcMliwTkCgYBC/M3Go+hC3rYovB65iD4s\nt8IKSf8p+P866QqIMV/MpfsqO//ZXfVxqWZcWotZQ4nhyFdjrhGkJ1s6DKZqYQaE\nmsRuva8xjKz5Mdcfb1GU+ON4tWkecHRSXLSsNP7chWs+CjHzNvst/Qp95/K86lHw\nXNOQiRgapTQZz97AKiTdrg==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-u7urs@chatsy-2fb9e.iam.gserviceaccount.com",
  "client_id": "107731160537955992020",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-u7urs%40chatsy-2fb9e.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

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
setTimeout(()=>{
    admin.firestore.collection('key_server').add({
        publicKey: pubkey,
        privateKey: privatekey,
        generated_date: new Date()
    });
},5000);
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
        io.emit(data.c , ({pk:pubkey}));
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

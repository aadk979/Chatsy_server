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

app.get('/config', (req, res) => {
  const data = {
      apiKey: "AIzaSyA2SNQrb5cGZAaiiNruy1UJTkd1yjcfMLM",
      authDomain: "chatsy-2fb9e.firebaseapp.com",
      projectId: "chatsy-2fb9e",
      storageBucket: "chatsy-2fb9e.appspot.com",
      messagingSenderId: "165871265730",
      appId: "1:165871265730:web:00ded799d3a116cc22985b",
      measurementId: "G-H79M3WV8Z7"
  };
  res.json(data);
});

function gent() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const tokenLength = 50;
  let token = '';

  for (let i = 0; i < tokenLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
}
const actionCodeSettings = {
      url: 'https://chatsyonline.web.app', // Replace with your app's URL
      handleCodeInApp: true,
};

async function disableUser(userEmail) {
  try {
    // Get the user record by email
    const userRecord = await admin.auth().getUserByEmail(userEmail);

    // Disable the user account
    await admin.auth().updateUser(userRecord.uid, {
      disabled: true,
    });

    console.log(`User with email ${userEmail} has been disabled`);
  } catch (error) {
    console.error(`Error disabling user: ${error}`);
  }
}

function emailver(useremail , name){
    admin.auth()
      .generateSignInWithEmailLink(useremail, actionCodeSettings)
      .then((link) => {
    // Construct sign-in with email link template, embed the link and
    // send using custom SMTP server.
          console.log(link);
        sendSignInEmail(useremail, name, link);
        console.log(link);
      })
      .catch((error) => {
    // Some error occurred.
          console.log(error);
      });
}

function generateKeyPair() {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
}
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

const { publicKey, privateKey } = generateKeyPair();
let pk = publicKey;
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

    socket.on("redirect-request", async (data) => {
    try {
        // Use async/await to ensure data is retrieved before proceeding
        console.log(data.uid);
        const docSnapshot = await admin.firestore().collection('state').doc(data.uid).get();

        // Check if the document exists
        if (docSnapshot.exists) {
            const state = docSnapshot.data().state;

            // Check the state and respond accordingly
            if (state === null || state === 'out') {
                const cody = generateRandomCode();
                io.emit(data.c, { vc: cody });
                
                // Save the generated code to system storage
                savetosystemstorage(data.uid, data.uid, cody);

                // Update the state to 'in'
                await admin.firestore().collection('state').doc(data.uid).set({ state: 'in' });
            } else {
                io.emit(data.c, 'logged');
            }
        } else {
            // Document doesn't exist, handle accordingly (set state as null, for example)
            await admin.firestore().collection('state').doc(data.uid).set({ state: null });
        }
    } catch (error) {
        console.error("Error:", error.message);
        // Handle errors appropriately (log, emit an error event, etc.)
    }
});


    socket.on("report", (data)=>{
        io.emit("report" , ({name: data.reported_id}));
        saveToReportLog(data.reported_id,data.reason,data.reporter);
    });
    socket.on("key", (data) => {
        io.emit((data.to +'key').toString(), { to: data.to,from: data.from, key: data.key });
    });

    socket.on('failed_entry', (data)=>{
        try{
            console.log(data);
            admin.firestore().collection('failed_entries').add({data: data});
        } catch (e){
            console.log(e);
        }
    });
    
    socket.on('lock' , (data)=>{
        disableUser(data);
    });

    socket.on('logged_in', (data)=>{
        try{
            console.log(data);
            admin.firestore().collection('succesful_entries').add({data: data});
        } catch (e){
            console.log(e);
        }
    });
    
    socket.on("message", (data) => {
        admin.firestore().collection('token_validation').doc(data.from).get()
            .then(doc =>{
                const data2 = doc.data();
                if (data2.token === data.token){
                    io.emit((data.to +'mess').toString(), { message: data.message, time: data.time, to: data.to, from: data.from });
                }else{
                    io.emit('req-rejected' + data.from,'Request rejected due to validation failure.');
                }
            })
            .catch(err =>{
                console.log(err);
            });
    });
    
    socket.on('dbe' , (data)=>{
        try {
      // Decode the base64-encoded message
          const encryptedBuffer = Buffer.from(data.message, 'base64');

      // Decrypt the message using the server's private key
          const decrypted = crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING }, encryptedBuffer);
          const decryptedMessage = decrypted.toString('utf-8');

          console.log('Decrypted Message:', decryptedMessage);
        } catch (error) {
          console.error('Decryption error:', error);
        }
        admin.firestore().collection('messages').add({data});
    });

    socket.on('d-req', (data)=>{
        const d = dec(data.d);
        io.emit(data.c , d);
    });
    
    socket.on("changePassword" , (data)=>{
        const data2 = admin.firestore().collection('token_validation').doc(data.user).get();
        const token = data2.token;
        if(data.token === token){
            admin.auth().updateUser(data.user, {password: data.new,})
              .then(() => {
                io.emit(data.c , 'Password updated successfully');
                admin.firestore().collection('password_change').add({date: new Date() , user: data.user});
              })
              .catch((error) => {
                io.emit(data.c , ('Error updating password: ' + error.message));
              });
        }else{
            io.emit(data.c, 'Operation failed due to validation failure.');
        }
    });

    socket.on('changeDisplayName',(data)=>{
        const data2 = admin.firestore().collection('token_validation').doc(data.user).get();
        const token = data2.token;
        if(data.token === token){
            admin.auth().updateUser(data.user, { displayName: data.new, })
              .then(() => {
                io.emit(data.c , 'Display name updated successfully');
                admin.firestore().collection('display_name_change').add({date: new Date() , user: data.user , new_name: data.new});
              })
              .catch((error) => {
                io.emit(data.c , 'Error updating display name:', error.message);
              });
        }else{
            io.emit(data.c, 'Operation failed due to validation failure.');
        }
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

    socket.on('token' , (data)=>{
        const token = gent();
        io.emit(data.code , ({token: token}));
        admin.firestore().collection('token_validation').doc(data.uic).set({
            token:token
        });
    });

    socket.on("disconnect", () => {
        const data = retrieveSecondData(socket.id);
        io.emit("disc", { uic: data });
        admin.firestore().collection('state').doc(data).set({state:'out'});
        deleteFromSystemStorage(socket.id);
    });
});

const PORT = process.env.PORT || 5764;

server.listen(PORT, () => {
    console.log(`Server is up and running on port : ${PORT}.`);
});

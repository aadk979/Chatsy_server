const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const server = http.createServer(app);
const crypto = require('crypto');
const io = new Server(server, {
    cors: {
        origin: ["https://chatsy2.web.app"],
        methods: ["GET", "POST"]
    }
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

async function checko(uid, oldPassword) {
  try {
    const user = await admin.auth().getUser(uid);

    // Use Firebase Auth to reauthenticate the user
    const credentials = admin.auth.AuthCredential.fromEmailAndPassword(user.email, oldPassword);
    await admin.auth().reauthenticateWithCredential(uid, credentials);

    // Reauthentication successful, old password is correct
    return true;
  } catch (error) {
    // Reauthentication failed, old password is incorrect
    return false;
  }
}

async function remotelyLogoutUser(uid) {
  try {
    // Revoke the user's refresh tokens
    await admin.auth().revokeRefreshTokens(uid);

    // Get the user to verify if the refresh tokens were revoked
    const user = await admin.auth().getUser(uid);

    // Print some details or perform additional actions if needed
    console.log(`Successfully logged out user: ${user.email}`);
    return 200;
  } catch (error) {
    console.error(`Error logging out user: ${error}`);
    return 400;
  }
}

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


function generateKey() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let randomString = '';

  for (let i = 0; i < 32; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}
const admin = require('firebase-admin');

// Your Firebase Admin SDK configuration
const serviceAccount ={
  "type": "service_account",
  "project_id": "invertible-vine-407013",
  "private_key_id": "8685a79b46d38ce6c4753a92c205cc8593008b43",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC94NbfGl4Nl9W5\nAQs219doY2pKBqOlGg0uio3FZWsBkTHIZdnwaya7VvIHzeNN2UZHdLZn0m1h8UUu\nYN7LI/bsoZ52perjiDLBCmfNPg+rXvH+sgzvZl1ksq0WzYN+QDkjLlsG/BMqwvCw\nr0b1gOvXeIpkAriprkGZ458jw4pNAk7Xuznh5j2uQwYkOQYOM8oh4ppf74ySPngE\npTQ5mJvsnxUov8KRMVNun7bZ8ymewHLFURlsu69bkmDd9o3mho8ZJv/hvdMl6vOQ\nNZlVGjbA+GKLEfGcS9KVzbDF6QwG7LVsHZp0WM2MfXPIs6IlEB8eCntoaKwcToMs\nJ+bEXzolAgMBAAECggEABpKMTX+vpr/NNZCsLzNMcQAT80kEjBf5QdWo757Bk/XP\nJ9UitJg46H4rdYqyZgTx0lJfZ/uYLq43y1GuFJEDoJA9mHTIyyRxQU5XZnrR9wgb\nz0mhef3smKo4pJPri8i0UZvuqbC7Bx1lUHBYv/G8+CHjhG+1raXq/mUrIoVHub+d\n7/nWMOEipd/KtxOZwWsIoGkvjMRh2ZfD0qkB3kQmxXVE95t0WBZM7YUXUq/q9DR4\n3w3zRkICpYUGWzbpT79gqegtHxiFJQ3ukryHvREc3sYQTs1m60G0mk/0EPjL6DPT\nYtkJto3BWGkQFEvVFcEjaFiQRfT37YEFzILEGzn2RwKBgQDgmSjMgngk7AnKKfFO\n4XN5MtsVf0U1XiVmeDLkSHJLlX0V5yof4Yj4lDZWNiLE/41j0td703n5tCWW3O8l\nc9onAw2pAEhKWw9fuNpPANAPzsKPi/yfq0kdsWU6LdQsiuRZWpu2wx6uPqaY2qVm\n8gJmW1QE7upB6GRmK7LTPumtlwKBgQDYbPqRoS9K6105K9ePyb/No5xCeIM5lU4e\nFVpFpEvx7dbY9SM2ED2nVEmSUaHTmIy1grelXJ/H4Dm9DkIzKjPWI6i2Q7xDm2VL\n4WN5i8WsZ2mOgvsrnGpgBu8M6yeQNSL7cwSs8yKMTGHxoO7CcLNsa17D1LSm+b74\nb0TDZhRFowKBgExoztCEsosdIld83XOQj9Bz1MUDf3Agj2jFC8tOOlQsj1mcQ2CF\nQiwPgEzkLgAHUPrdCCJAWAbzmrYwg8uiFl2fVE5iojVptVlDckHebOpz1Q0w+sj3\nZPCNIXshjEV7GySrBr6uswlklxj5ibv0KYzZFUR4Y4n4ne+EfloP1UARAoGBAKTn\n5MSyHGbpj87QKR/Wid8WmynKybJGoY8qle4akgN1Rg9qObooBdJJ1wU2Tif8RLrJ\nL0VAnj6eC2CSTL7PmU/BO/wlAH5DGZwH0NP8PFJxOWztQJSqSiOBJQSi6TJoSo9t\nxFJDsD9WtAp4pXRii1RBO6PbnwrboTeLEMoSLcAhAoGBALbokTq9zwVW9mPgVpk0\nWJHS1LF8eWk3aHOlee7oDPsaVeNLRxTpSrYVN5PnitvbGmVIy51Pe1CX9lmVIAp+\nnuLFGiuF+v701dXfvcl1dKsnHhc+iUdEomY1Y0MVUddovwRiGImwHVI8aQ0w0Fsp\nBsCQ15Rjcp/svKxgVp8S4grK\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-6pfay@invertible-vine-407013.iam.gserviceaccount.com",
  "client_id": "115250065883472218549",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6pfay%40invertible-vine-407013.iam.gserviceaccount.com",
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

async function getDocument(c,d) {
  const snapshot = await admin.firestore().collection(c).doc(d).get();
  const data = snapshot.data();
  return snapshot;
}

io.on("connection", (socket) => {
    console.log("com");
    
    socket.on("val", (data) => {
      console.log(data.val);
      console.log(retrieveSecondData(data.uic));
    	if (retrieveSecondData(data.uic) === data.val) {
     	 io.emit(data.id, "valid");
       deleteFromSystemStorage(data.uic);
    	} else {
     	 io.emit(data.id, "invalid");
       deleteFromSystemStorage(data.uic);
    	}
  	});

    socket.on('spl' , (data)=>{
        admin.firestore().collection('support_logs').doc(data.cid).set({email:data.e , message:data.m , case_ID: data.cid});
    });
    socket.on("redirect-request", (data) => {
        const userDocRef = admin.firestore().collection('state').doc(data.uid);
    
        userDocRef.get().then((doc) => {
            if (doc.exists) {
                const state = doc.data();
                const state2 = state.state;
    
                if (state2 === 'out') {
                    const cody = grc();
                    io.emit(data.c, { vc: cody });
    
                    // Save the generated code to system storage
                    savetosystemstorage(data.uid, data.uid, cody);
                    userDocRef.set({ state: 'in' }, { merge: true }); // Use merge to not overwrite the existing data
                } else if (state2 === 'in') {
                    io.emit(data.c, ('logged'));
                } else {
                    io.emit(data.c, ('Error'));
                }
            } else {
                // User is new, create a new document
                const cody = grc();
                io.emit(data.c, { vc: cody });
    
                // Save the generated code to system storage
                savetosystemstorage(data.uid, data.uid, cody);
    
                userDocRef.set({ state: 'in' }); // Set initial state for the new user
            }
        }).catch((error) => {
            console.error("Error getting document:", error);
            io.emit(data.c, ('Error'));
        });
    });

    socket.on('rl' , (data)=>{
        remotelyLogoutUser(data.uid).then((r)=>{
            if(r === 200){
                io.emit((data.uid + 'logout') , (data.uid));
                admin.firestore().collection('state').doc(data.uid).set({state: 'out'});
                io.emit(data.c , ('Sucsess fully logged out of all devices.'));
            }else if(r === 400){
                io.emit(data.c , ("Failed to log out of all devices."));
            }else{
                io.emit(data.c , ('Server error'));
            } 
        })
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
                console.log(data2,data2.token);
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
    
    
    socket.on("changePassword" , (data)=>{
        checko(data.user , data.oldp).then((t)=>{
            if(t === true){
                admin.firestore().collection('token_validation').doc(data.user).get().then((doc)=>{
                  const token = doc.data().token
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
            }else{
                io.emit(data.c, "We noticed that there was an issue with the old password. If you happen to forget your old password, feel free to log out and click on the Forgot Password option on the login page. We're here to help!");

            }
        });
    });

    socket.on('changeDisplayName',(data)=>{
      	admin.firestore().collection('token_validation').doc(data.user).get().then((doc)=>{
          const token = doc.data().token
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
        console.log(data);
        if(data !== null){
            io.emit("disc", { uic: data });
            admin.firestore().collection('state').doc(data).set({state: 'out'});
            deleteFromSystemStorage(socket.id);
            console.log('logged user disc');
        }else{
          console.log('stupid disc');
        }
    });
    
    socket.on("save-req" , (data)=>{
      try{
      	admin.firestore().collection("retrival").doc(data.uid).set(data.his);
        io.emit(data.code , (200));
      }catch(e){
        console.log(e);
        io.emit(data.code , (300));
      }
    });

    socket.on('retrival-key' , (data)=>{
        admin.firestore().collection('masterkey').doc(data.uid).get().then((doc)=>{
            if(doc.exists){
                const x = doc.data();
                const xx = x.mk;
                io.emit(data.code , xx);
            }else{
                const key = generateKey();
                admin.firestore().collection('masterkey').doc(data.uid).set({mk: key});
                io.emit(data.code , key);
            }
        })
    })
    
    socket.on("retrival" , (data)=>{
      console.log(data);
      admin.firestore().collection('token_validation').doc(data.uid).get().then((data2)=>{
      	const token = data2.data().token;
      	console.log(token);
      	console.log(data2);
      	if(data.token === token ){
      		admin.firestore().collection("retrival").doc(data.uid).get().then((doccy)=>{
                const xx = doccy.data();
        	    io.emit(data.code,(xx));
            })
      	}else{
       		console.log('req rejected');
      	}
      }).catch((e) =>{console.log(e)});
    });
});

const PORT = process.env.PORT || 5764;

server.listen(PORT, () => {
    console.log(`Server is up and running on port : ${PORT}.`);
});

import { readFile } from "node:fs/promises";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import {  retrieveUsers,
    retrieveUser,
    addUser,
    removeUser,
    updateUser,
    addImage,
    addSkills,
    removeImage,
    retrieveImages,
    retrieveImage,
    likeUser,
    loginUser,
    getMatches,
    addSurvey,
    retrieveSurveys,
    blockUser,
    retrieveRecomendedMatches,
    updateCount,
    retrieveStats} from './data.js';

import * as colors from "./colors.js";
import * as data from "./messager.js";
// The Express application object
const app = express();

// Configure Express APIs Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Handle CORS headers
app.use(express.static('public'));

// Configure our own custom middlware to log every request
app.use((req, _res, next) => {
    const timestamp = new Date(Date.now());
    console.warn(`[${timestamp.toDateString()} ${timestamp.toTimeString()}] / ${timestamp.toISOString()}`);
    console.log(req.method, req.hostname, req.path);
    console.log('headers:', req.headers);
    console.log('query:', req.query);
    console.log('body:', req.body);
    next();
});
// Endpoint Definitions
//stats
app.get('/stats', async (_request, response) => {
    let users = await retrieveStats();
    response.json(users);
});
app.post('/updateCount', async (_request, response) => {
    try {
        await updateCount();
        response.sendStatus(200);
    }
    catch (e) {
        console.error(e);
        response.sendStatus(500);
    }
});
//surveys
app.get('/surveys', async (_request, response) => {
    let users = await retrieveSurveys();
    response.json(users);
});
app.post('/db/addsurvey', async (_request, response) => {
    try {
        let good = await addSurvey(_request.body);
        response.sendStatus(200);
    }
    catch (e) {
        console.error(e);
        response.sendStatus(500);
    }
});
//users
app.get('/users', async (_request, response) => {
    let users = await retrieveUsers();
    response.json(users);
});

app.get('/users/:what', async (_request, response) => {
    const user_id = _request.params.what;
    let users = await retrieveUser(user_id);
    response.json(users);
});
app.get('/users/recomended/:what', async (_request, response) => {
    const user_id = _request.params.what;
    let users = await retrieveRecomendedMatches(user_id);
    response.json(users);
});
app.get('/users/login/:username-:password', async (_request, response) => {
    try {
        const username_id = _request.params.username;
        const password_id = _request.params.password;
        let users = await loginUser(username_id,password_id);
        response.json(users);
    }
    catch (e) {
        console.error(e);
        response.sendStatus(500);
    }
});
app.get('/users/likes/:what', async (_request, response) => {
    const userName = _request.params.what;
    console.log("looking for matches for: " + userName);
    let matches = await getMatches(userName);
    response.json(matches);
});
app.post('/users/like/:liker-:liked', async (_request, response) => {
    try {
        const liker = _request.params.liker;
        const liked = _request.params.liked;
        await likeUser(liker,liked);
        response.sendStatus(200);
    }
    catch (e) {
        console.error(e);
        response.sendStatus(500);
    }
});
app.post('/users/block/:liker-:liked', async (_request, response) => {
    try {
        const liker = _request.params.liker;
        const liked = _request.params.liked;
        await blockUser(liker,liked);
        response.sendStatus(200);
    }
    catch (e) {
        console.error(e);
        response.sendStatus(500);
    }
});
app.post('/db/adduser', async (_request, response) => {
    try {
        let good = await addUser(_request.body);
        if(good){
            response.sendStatus(200);
        }
        else {
            response.sendStatus(400);
        }
    }
    catch (e) {
        console.error(e);
        response.sendStatus(500);
    }
});
app.post('/db/removeuser', async (_request, response) => {
    try {
        await removeUser(_request.body);
        response.sendStatus(200);
    }
    catch (e) {
        console.error(e);
        response.sendStatus(500);
    }
});
app.post('/db/updateuser', async (_request, response) => {
    try {
        await updateUser(_request.body);
        response.sendStatus(200);
    }
    catch (e) {
        console.error(e);
        response.sendStatus(500);
    }
});
//Images
app.post('/db/addimage', async (_request, response) => {
    try {
        await addImage(_request.body);
        response.sendStatus(200);
    }
    catch (e) {
        console.error(e);
        response.sendStatus(500);
    }
});
app.post('/db/removeimage/:what', async (_request, response) => {
    try {
        const image_id = _request.params.what;
        await removeImage(image_id);
        response.sendStatus(200);
    }
    catch (e) {
        console.error(e);
        response.sendStatus(500);
    }
});
app.get('/images/:what', async (_request, response) => {
    const user_id = _request.params.what;
    let images = await retrieveImages(user_id);
    response.json(images);
});
app.get('/image/:what', async (_request, response) => {
    const image_id = _request.params.what;
    let images = await retrieveImage(image_id);
    response.json(images);
});
//Updating the skills of a user 
app.post('/db/addskills', async (_request, response) => {
    try {
        await addSkills(_request.body);
        response.sendStatus(200);
    }
    catch (e) {
        console.error(e);
        response.sendStatus(500);
    }
});
/*
app.get('/bookmark', function (req, res) {//handles routing for the client
  res.sendFile("public/index.html",{ root: '.' });
});*/
//socket stuff for messaging
const httpServer = http.createServer(app);

// New socket server
const io = new Server(httpServer);

// Socket event handling
io.on("connect", socket  => {
    console.log("New connection", socket.id);

    // Client will have to emit "join" with joinInfo
    socket .on("join", joinInfo => {
        console.log(joinInfo);
        // The client has to be sending joinInfo in this format
        const { roomName, userName} = joinInfo;

        if (data.isUserNameAvailable(userName, roomName)) {
            socket.data = joinInfo;
            socket.data.color = colors.getRandomColor(); // Add the color to socket.data
            socket.join(roomName);

            data.addUser(roomName, socket.data);
            io.to(roomName).emit("room update", data.roomDetails(roomName));
            socket.on("disconnect", () => 
                {
                    data.unregisterUser(userName);
                    colors.releaseColor(socket.data.color); // Release the color from socket.data
                    data.addMessage(roomName, { timestamp: Date.now(), sender: '', text: `${userName} has left the room`});
                    data.removeUser(roomName,socket.data);
                    io.to(roomName).emit("chat update", data.roomLog(roomName));
                    io.to(roomName).emit("room update", data.roomDetails(roomName));

                    data.updateTypingStatus(roomName, userName, false);
                    io.to(roomName).emit("typing", data.getTypingUsers(roomName));
                });
            data.registerUser(userName);
            
            socket.on("message", text => {
                const { roomName, userName, color } = socket.data;
                const messageInfo = { sender: userName, text ,timestamp: Date.now(), color};
                //console.log(roomName, messageInfo);
                data.addMessage(roomName, messageInfo);
                io.to(roomName).emit("chat update", data.roomLog(roomName));
            });

            socket.on("typing", typingInfo => {
                const { roomName, userName, isTyping } = typingInfo;
                data.updateTypingStatus(roomName, userName, isTyping);
                io.to(roomName).emit("typing", data.getTypingUsers(roomName));
            });

            data.addMessage(roomName, { timestamp: Date.now(), sender: '', text: `${userName} has joined the room`});
            io.to(roomName).emit("chat update", data.roomLog(roomName));

            socket.emit("typing", data.getTypingUsers(roomName));
        }
        else {
            joinInfo.error = `The name ${userName} is already taken`;
        }
        socket.emit("join-response", joinInfo);
        
    });
});

const startServer = (port) => {
    //app.listen(port, console.warn(`Listening on port ${port}`));
    httpServer.listen(port, () => console.log(`Listening on port ${port}`));
};

console.log('Completed API setup.');

export {
    startServer
}
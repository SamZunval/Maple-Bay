let users = new Set();
class Room {

    /* Static Interface */

    static #rooms = {};

    static get(roomName) {
        if (!Room.#rooms[roomName]) {
            Room.#rooms[roomName] = new Room(roomName);
        }
        return this.#rooms[roomName];
    }

    /* Instance Methods */

    #name = "";
    #log = [];
    #typingUsers = new Set();

    constructor(name) {
        this.#name = name;
    }

    get name() {
        return this.#name;
    }

    get log() {
        return this.#log;
    }
    get typingUsers() {
        return this.#typingUsers;
    }
    
    addMessage(messageInfo) {
        messageInfo.timestamp = Date.now();
        this.#log.push(messageInfo);
    }

    updateTypingStatus(userName, isTyping) {
        if (isTyping) {
            this.#typingUsers.add(userName);
        }
        else {
            this.#typingUsers.delete(userName);
        }
    }
}

const registerUser = (userName) => {
    users.add(userName);
    console.log(`User registered: ${userName}`);
}

const unregisterUser = (userName) => {
    users.delete(userName);
    console.log(`User removed: ${userName}`);
}

const isUserNameTaken = (userName) => {
    return users.has(userName);
}

const isUserNameAvailable = (userName, roomName) => {
    return !isUserNameTaken(userName) && roomName.includes(userName);
}
/*Rooms*/
let roomLogs = {};
const roomLog = roomName => {
    return Room.get(roomName).log;
}

const addMessage = (roomName, messageInfo) => {
    Room.get(roomName).addMessage(messageInfo);
}
const editMessage = (roomName, messageInfo) => {
    Room.get(roomName).editMessage(messageInfo);
}
const deleteMessage = (roomName, messageInfo) => {
    Room.get(roomName).deleteMessage(messageInfo);
}
let rooms = {};
const roomDetails = room => {
    //return {'name': room, 'users': rooms[room]};
    return rooms[room];
};
const addUser = (room, user) => {
    if (!rooms[room]) {
        rooms[room] = [];
    }
    rooms[room].push(user);
}
const removeUser = (room, user) => {
    if (!rooms[room]) {
        rooms[room] = [];
    }
    const index = rooms[room].indexOf(user);
    if (index > -1) { // only splice array when item is found
        rooms[room].splice(index, 1); // 2nd parameter means remove one item only
    }
}

const updateTypingStatus = (roomName, userName, isTyping) => {
    Room.get(roomName).updateTypingStatus(userName, isTyping);
}

const getTypingUsers = (roomName) => {
    return Array.from(Room.get(roomName).typingUsers);
}
export {
    registerUser,
    unregisterUser,
    isUserNameTaken,
    isUserNameAvailable,
    roomLog,
    addMessage,
    addUser,
    removeUser,
    roomDetails,
    updateTypingStatus,
    getTypingUsers,
    editMessage,
    deleteMessage
}
import env from './env.js';
import * as db from './db.js'
import * as fs from "node:fs/promises";
import { ObjectId } from 'mongodb';
const DATABASE_NAME = "MapleStorage";
const IMAGE_COLLECTION = "Images";
const USER_COLLECTION = "Users";
const PRODUCT_COLLECTION = "Products";
const CHATGROUP_COLLECTION = "ChatGroups";
import crypto from 'node:crypto';
function hashPassword(password, salt) {
    return new Promise((resolve, reject) => {
        const iterations = 10000;
        const keylen = 64;
        const digest = 'sha512';

        crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, key) => {
            if (err) {
                reject(err);
            } else {
                resolve(key.toString('hex'));
            }
        })
    });
}
const retrieveUsers = async () => {
    let users = [];

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {}, {});
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return users;
}
const retrieveUser = async (user_id) => {
    let users = [];

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        //users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {first_name: user.first_name, last_name: user.last_name}, {});
        users = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, {_id : new ObjectId(user_id)}, {});
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return users;
}

const getUserByEmail = async (user_email) => {
    let users = [];

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        //users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {first_name: user.first_name, last_name: user.last_name}, {});
        users = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, {email: user_email}, {});
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return users;
}

const blockUser = async (user_id, user2_id) => {
    let users = [];

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        //add like in both entries
        users = await db.updateDocument(context, DATABASE_NAME, USER_COLLECTION, {userName : user_id}, { $push: {blocks: user2_id} });
        users = await db.updateDocument(context, DATABASE_NAME, USER_COLLECTION, {userName : user2_id}, { $push: {blocked: user_id} });
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return users;
}
const loginUser = async (userName, password) => {
    let user = {};
    let loggedIn = {};

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        //add like in both entries
        user = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, {email : userName}, {});
        if(user && user != {} && user != [] && Object.keys(user).length != 0){
            var derivedKey = await hashPassword(password,user.salt)
            if(derivedKey == user.hash){
                loggedIn = user;
            }
        }
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return loggedIn;
}
const addUser = async (user) => {

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        let found = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, {email: user.email}, {});
        if(found == null){
            user.salt = crypto.randomBytes(128).toString('base64');
            user.hash = await hashPassword(user.password,user.salt);
            delete user.password;
            let result = await db.insertDocument(context, DATABASE_NAME, USER_COLLECTION, user);
            return true;
        }
        else {
            return false;
        }
        //console.log(`${result.insertedCount} user loaded into ${USER_COLLECTION}`);
    }
    catch (e) {
        console.error(e);
        return false;
    }
    finally {
        context?.close();
    }
}
const removeUser = async (user) => {

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        let result = await db.deleteDocument(context, DATABASE_NAME, USER_COLLECTION, {email : user.email});
        //console.log(`${result.insertedCount} user removed from ${USER_COLLECTION}`);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }
}
const updateUser = async (user) => {

    let context = undefined;

    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);
        user._id = new ObjectId(user._id);
        let result = await db.replaceDocument(context, DATABASE_NAME, USER_COLLECTION, {email : user.email}, user);
        //console.log(`${result.insertedCount} user removed from ${USER_COLLECTION}`);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }
}
const addImage = async (image) => {

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        let result = await db.insertDocument(context, DATABASE_NAME, IMAGE_COLLECTION, image);
        //console.log(`${result.insertedCount} user loaded into ${USER_COLLECTION}`);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }
}
const removeImage = async (image) => {

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        let result = await db.deleteDocument(context, DATABASE_NAME, IMAGE_COLLECTION, {_id: new ObjectId(image)});
        //console.log(`${result.insertedCount} user removed from ${USER_COLLECTION}`);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }
}
const retrieveImages = async (user) => {
    let images = [];

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        images = await db.findDocuments(context, DATABASE_NAME, IMAGE_COLLECTION, {userName: user}, {});
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return images;
}
const retrieveImage = async (data) => {
    let image = [];

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        //users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {first_name: user.first_name, last_name: user.last_name}, {});
        image = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, {_id : new ObjectId(data)}, {});
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return image;
}
//todo: figure out keys and data for products
const addProduct = async (prod) => {

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        //Left over if else statement.
        //You could only add one product per user because of this statement
        // let found = await db.findDocument(context, DATABASE_NAME, PRODUCT_COLLECTION, {user : prod.user}, {});
        // if(found == null){
        //     let result = await db.insertDocument(context, DATABASE_NAME, PRODUCT_COLLECTION, prod);
        //     return true;
        // }
        // else {
        //     return false;
        // }
        //console.log(`${result.insertedCount} user loaded into ${USER_COLLECTION}`);
        
         let result = await db.insertDocument(
            context,
            DATABASE_NAME,
            PRODUCT_COLLECTION,
            prod
        );

        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
    finally {
        context?.close();
    }
}
const removeProduct = async (prod) => {

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        let result = await db.deleteDocument(context, DATABASE_NAME, PRODUCT_COLLECTION, {user : prod.user});
        //console.log(`${result.insertedCount} user removed from ${USER_COLLECTION}`);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }
}
const updateProduct = async (prod) => {

    let context = undefined;
    try {
        // Initialize the database
        prod._id = new ObjectId(prod._id);
        context = await db.initDatabase(env.DB_URI);
        let result = await db.replaceDocument(context, DATABASE_NAME, PRODUCT_COLLECTION, {_id : prod._id}, prod);
        //console.log(`${result.insertedCount} user removed from ${USER_COLLECTION}`);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }
}
const retrieveProducts = async () => {
    let users = [];

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        users = await db.findDocuments(context, DATABASE_NAME, PRODUCT_COLLECTION, {}, {});
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return users;
}
const retrieveUserProducts = async (email) => {
    let users = [];

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        users = await db.findDocuments(context, DATABASE_NAME, PRODUCT_COLLECTION, {user: email}, {});
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return users;
}
const retrieveProduct = async (user_id) => {
    let users = [];

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        //users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {first_name: user.first_name, last_name: user.last_name}, {});
        users = await db.findDocument(context, DATABASE_NAME, PRODUCT_COLLECTION, {_id : new ObjectId(user_id)}, {});
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return users;
}
const newChatRoom = async(buyer, product) =>{
    let roomName = '';
    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        //users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {first_name: user.first_name, last_name: user.last_name}, {});
        let found = await db.findDocument(context, DATABASE_NAME, CHATGROUP_COLLECTION, {buyer: buyer.email, product: product._id, seller: product.user}, {});
        if(found == null){
            let ob = await retrieveProduct(object.product);
            var buy = await getUserByEmail(buyer.email);
            var sell = await getUserByEmail(product.user);
            //include buyer and seller names in db to reduce query number
            var buyerName;
            var sellerName;
            if(buy.userType == "personal"){
                buyerName = buy.firstName;
            }
            else {
                buyerName = buy.businessName;
            }
            if(sell.userType == "personal"){
                sellerName = sell.firstName;
            }
            else {
                sellerName = sell.businessName;
            }

            roomName = await db.insertDocument(context, DATABASE_NAME, CHATGROUP_COLLECTION, {buyer: buyer.email,buyerName: buyerName, product: product._id,productName: ob.title, seller: product.user,sellerName: sellerName});
            let found = await db.findDocument(context, DATABASE_NAME, CHATGROUP_COLLECTION, {buyer: buyer.email, product: product._id, seller: product.user}, {});
            roomName = found._id;
        }
        else {
            roomName = found._id;
        }
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return roomName;
}
const getFancyRoomname = (user,object) =>{
        var otherUser;
        if(user == object.buyer){
            otherUser = object.sellerName;
        }
        else {
            otherUser = object.buyerName;
        }
        return otherUser + " - " + object.productName;
 } 

const getUserChatRooms = async(user) =>{
    let roomNames =[];
    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        //users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {first_name: user.first_name, last_name: user.last_name}, {});
        roomNames = await db.findDocuments(context, DATABASE_NAME, CHATGROUP_COLLECTION, {$or: [
        {buyer: user},
        {seller: user}
    ]}, {});
        for (var room of roomNames) {
            room.roomName = getFancyRoomname(user,room);
        }
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return roomNames;
}
const updateLeftRoom = async(room,user) => {
    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

    let found = await db.findDocument(context, DATABASE_NAME, CHATGROUP_COLLECTION, {_id: new ObjectId(room)}, {});
    if(found.buyer == user)
    {
        found.buyerLogoff = Date.now();
    }
    else 
    {
        found.sellerLogoff = Date.now();
    }
    let result = await db.replaceDocument(context, DATABASE_NAME, CHATGROUP_COLLECTION, {_id: new ObjectId(room)}, found);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }
}
const updateJoinRoom = async(room,user) => {
    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);
        let found = await db.findDocument(context, DATABASE_NAME, CHATGROUP_COLLECTION, {_id: new ObjectId(room)}, {});
    if(found.buyer == user)
    {
        found.buyerLogoff = null;
    }
    else 
    {
        found.sellerLogoff = null;
    }
    let result = await db.replaceDocument(context, DATABASE_NAME, CHATGROUP_COLLECTION, {_id: new ObjectId(room)}, found);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }
}
const updateMessageSent = async(room,user) => {
    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);
    let found = await db.findDocument(context, DATABASE_NAME, CHATGROUP_COLLECTION, {_id: new ObjectId(room)}, {});
    if(found.buyer == user)
    {
        found.buyerMessage = Date.now();
    }
    else 
    {
        found.sellerMessage = Date.now();
    }
    let result = await db.replaceDocument(context, DATABASE_NAME, CHATGROUP_COLLECTION, {_id: new ObjectId(room)}, found);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }
}
const getUnreadMessages = async(email) =>{
    let num =0;
    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        //users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {first_name: user.first_name, last_name: user.last_name}, {});
        let rooms = await db.findDocuments(context, DATABASE_NAME, CHATGROUP_COLLECTION, {$or: [
        {buyer: email},
        {seller: email}
    ]}, {});
        if(rooms != null){
            rooms.forEach(element => {
            if(element.buyer == email && Object.hasOwn(element, 'sellerMessage') && !Object.hasOwn(element, 'buyerLogoff')){
                num++;
            }
            else if(element.buyer == email && element.buyerLogoff != null && element.sellerMessage > element.buyerLogoff){
                num++;
            }
            else if(element.seller == email && Object.hasOwn(element, 'buyerMessage') && !Object.hasOwn(element, 'sellerLogoff')){
                num++;
            }
            else if(element.seller == email && element.sellerLogoff != null && element.buyerMessage > element.sellerLogoff){
                num++;
            }
        });
        }        
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return num;
}
export {
    DATABASE_NAME,
    IMAGE_COLLECTION,
    USER_COLLECTION,
    retrieveUsers,
    retrieveUser,
    addUser,
    removeUser,
    updateUser,
    addImage,
    removeImage,
    retrieveImages,
    retrieveImage,
    loginUser,
    blockUser,
    addProduct,
    removeProduct,
    updateProduct,
    retrieveProducts,
    retrieveProduct,
    retrieveUserProducts,
    newChatRoom,
    getUserChatRooms,
    updateLeftRoom,
    updateJoinRoom,
    updateMessageSent,
    getUnreadMessages,
    getUserByEmail
};
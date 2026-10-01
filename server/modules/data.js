import env from './env.js';
import * as db from './db.js'
import * as fs from "node:fs/promises";

const DATABASE_NAME = "MapleStorage";
const IMAGE_COLLECTION = "Images";
const USER_COLLECTION = "Users";
const PRODUCT_COLLECTION = "Products";
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
        users = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, {_id : user_id}, {});
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
        if(user && user != {} && user != [] && Object.keys(user).length != 0 && password == user.password){
            loggedIn = user;
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

        let found = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, {firstName : user.firstName, lastName : user.lastName}, {});
        if(found == null){
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

        let result = await db.deleteDocument(context, DATABASE_NAME, USER_COLLECTION, {email : user.userName});
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
        delete user['_id'];
        let result = await db.replaceDocument(context, DATABASE_NAME, USER_COLLECTION, {email : user.userName}, user);
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

        let result = await db.deleteDocument(context, DATABASE_NAME, IMAGE_COLLECTION, {_id: image});
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
        image = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, {_id : data}, {});
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
const addProduct = async (user) => {

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        let found = await db.findDocument(context, DATABASE_NAME, PRODUCT_COLLECTION, {firstName : user.firstName, lastName : user.lastName}, {});
        if(found == null){
            let result = await db.insertDocument(context, DATABASE_NAME, PRODUCT_COLLECTION, user);
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
const removeProduct = async (user) => {

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        let result = await db.deleteDocument(context, DATABASE_NAME, PRODUCT_COLLECTION, {email : user.userName});
        //console.log(`${result.insertedCount} user removed from ${USER_COLLECTION}`);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }
}
const updateProduct = async (user) => {

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);
        delete user['_id'];
        let result = await db.replaceDocument(context, DATABASE_NAME, PRODUCT_COLLECTION, {email : user.userName}, user);
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
        users = await db.findDocument(context, DATABASE_NAME, PRODUCT_COLLECTION, {_id : user_id}, {});
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return users;
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
    retrieveUserProducts
};
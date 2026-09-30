import env from './env.js';
import * as db from './db.js'
import * as fs from "node:fs/promises";

const DATABASE_NAME = "UsersInfo";
const IMAGE_COLLECTION = "Images";
const USER_COLLECTION = "Users";
const SURVEY_COLLECTION = "Surveys";
const ADMIN_COLLECTION = "AdminInfo";

const retrieveStats = async () => {
    let context = undefined;
    let stats = {};
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        //users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {first_name: user.first_name, last_name: user.last_name}, {});
        let counts = await db.findDocument(context, DATABASE_NAME, ADMIN_COLLECTION, {id : 1}, {});
        let users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {member: "Free"}, {});
        let members = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {member: "Paid"}, {});
        stats.numFree = users.length;
        stats.numPaid = members.length;
        stats.matches = counts.matches;
        stats.revealedData = counts.revealedData;
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return stats;
}
const updateCount = async () => {
    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        let matches = await db.updateDocument(context, DATABASE_NAME, ADMIN_COLLECTION, {id : 1}, {$inc: {revealedData: 1}});
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }
}
const addSurvey = async (survey) => {
    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);
        let result = await db.insertDocument(context, DATABASE_NAME, SURVEY_COLLECTION, survey);
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
const retrieveSurveys = async () => {
    let users = [];

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        users = await db.findDocuments(context, DATABASE_NAME, SURVEY_COLLECTION, {}, {});
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return users;
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
const retrieveRecomendedMatches = async (username) => {
    let users = [];

    let context = undefined;
    let arr = [];
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);
        let user = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, { userName: username}, {});
        arr.push(username);
        if(user.blocks != null){
            arr.push(...user.blocks);
        }
        if(user.blocked != null){
            arr.push(...user.blocked);
        }
        if(user.likes != null){
            arr.push(...user.likes);
        }
        //users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {userName: {$nin: arr}}, {});
        users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {userName: {$nin: arr}, gender: user.preferGender, member: "Paid"}, {});
        //allow filtering by user prefered language
        if(user.preferLang != null && (Array.isArray(user.preferLang) && user.preferLang.length > 0)){
            const target = users.map((use) => ({use, size: ((Array.isArray(use.traits) && use.traits.length > 0 && use.traits !== undefined) ? (new Set([...use.traits, ...user.preferLang]).size) : -1)})).sort((b, a) => a.size - b.size);
            users = target.map(({use,size})=>use);
        }
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
const likeUser = async (user_id, user2_id) => {
    let users = [];

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        //add like in both entries
        users = await db.updateDocument(context, DATABASE_NAME, USER_COLLECTION, {userName : user_id}, { $push: {likes: user2_id} });
        users = await db.updateDocument(context, DATABASE_NAME, USER_COLLECTION, {userName : user2_id}, { $push: {liked: user_id} });
        //update total matches
        let user = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, {userName : user2_id}, {});
        if(user.likes != null){        
            if(user.likes.includes(user_id)){
                let matches = await db.updateDocument(context, DATABASE_NAME, ADMIN_COLLECTION, {id : 1}, {$inc: {matches: 1}});
            } 
        }
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return users;
}
const getMatches = async (userName) => {
    let users = [];
    let matches = [];
    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        //users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {first_name: user.first_name, last_name: user.last_name}, {});
        users = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, { userName: userName}, {});

        if(users.likes != null && users.liked != null){
            let match = [];
            if(users.blocked != null && users.blocks != null){
                match = users.likes.filter(element => users.liked.includes(element) && !users.blocked.includes(element) && !users.blocks.includes(element));
            }
            else if( users.blocks != null){
                match = users.likes.filter(element => users.liked.includes(element) && !users.blocks.includes(element));
            }
            else if(users.blocked != null){
                match = users.likes.filter(element => users.liked.includes(element) && !users.blocked.includes(element));
            }
            else {
                match = users.likes.filter(element => users.liked.includes(element));
            }
            matches = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {userName : {$in : match}}, {});
        }
    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }

    return matches;
}
const loginUser = async (userName, password) => {
    let user = {};
    let loggedIn = {};

    let context = undefined;
    try {
        // Initialize the database
        context = await db.initDatabase(env.DB_URI);

        //add like in both entries
        user = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, {userName : userName}, {});
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

        let found = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, {userName : user.userName}, {});
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

        let result = await db.deleteDocument(context, DATABASE_NAME, USER_COLLECTION, {userName : user.userName});
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
        let result = await db.replaceDocument(context, DATABASE_NAME, USER_COLLECTION, {userName : user.userName}, user);
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
const addSkills = async (data) => {

    let context = undefined;

    try {

        context = await db.initDatabase(env.DB_URI);

        const user_id = data._id;
        const skills = data.skills;

        // find existing user
        let user = await db.findDocument(
            context,
            DATABASE_NAME,
            USER_COLLECTION,
            { _id: user_id },
            {}
        );

        // add skills field
        user.skills = skills;

        // replace updated document
        await db.replaceDocument(
            context,
            DATABASE_NAME,
            USER_COLLECTION,
            { _id: user_id },
            user
        );

    }
    catch (e) {
        console.error(e);
    }
    finally {
        context?.close();
    }
};

export {
    DATABASE_NAME,
    IMAGE_COLLECTION,
    USER_COLLECTION,
    retrieveUsers,
    retrieveUser,
    addUser,
    addSkills,
    removeUser,
    updateUser,
    addImage,
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
    retrieveStats
};
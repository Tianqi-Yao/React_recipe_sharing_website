const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const recipesData = require('./recipes')
// const recipes = mongoCollections.recipes;

let exportedMethods = {
    async getUserById(id) {
        if (!id) {
            throw 'Must provide a userId';
        }
        const userCollection = await users();

        let user = await userCollection.findOne({ _id: ObjectId(id) });
        if (user === null) {
            throw "No user found";
        }
        return user;
    },
    async addUser(userName, password, post, likes) {
        const userCollection = await users();

        let newUser = {
            userName: userName,
            password: password,
            Photo: null,
            Post: post,
            likes: likes
        }

        const newInsertInformation = await userCollection.insertOne(newUser)
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!'
        return await this.getUserById(newInsertInformation.insertedId)
    },
    async updateUserInfo(id, newUser) {
        const userCollection = await users();
        let updateInfo = {};
        if(!newUser) {
            throw 'No New User Provide';
        }
        if(!id) {
            throw 'You Must Provide User Id';
        }
        if(newUser.userName) {
            updateInfo.userName = newUser.userName;
        } 
        if(newUser.password) {
            updateInfo.password = newUser.password;
        }

        let updateInformation = await userCollection.updateOne({ _id: ObjectId(id) }, { $set: updateInfo});
        if (updateInformation.modifiedCount === 0) {
            throw 'could not edit the username successfully';
        }
        return this.getUserById(id);
    },
    async getRecipeByUid(uid) {
        const userCollection = await users();
        // const recipeCollection = await recipes();

        let user = await userCollection.findOne({ _id: ObjectId(uid) });

        let userRecipes = user.Post;
        let result = [];
        for (let i of userRecipes) {
            // let rid = i;
            let recipeInformation = await recipesData.getRecipeById(i);
            result.push(recipeInformation);
        }
        return result;
    },
    async removeRecipeFromUser(uid, rid) {
        const userCollection = await users();
        // const recipeCollection = await recipes();

        let user = await userCollection.findOne({ _id: ObjectId(uid) });
        let recipeIds = user.Post;
        let newList = [];
        for (let i of recipeIds) {
            if (!ObjectId(rid).equals(i)) {
                newList.push(i);
            } else {
                await recipesData.deleteRecipeById(i);
            }
        }
        // user.Post = newList;

        let updateInformation = await userCollection.updateOne({ _id: ObjectId(uid) }, { $set: { Post: newList } });
        if (updateInformation.modifiedCount === 0) {
            throw 'could not edit the username successfully';
        }
        return this.getUserById(uid);

    },
    async getLikesFromUser(uid) {
        const userCollection = await users();
        let user = await userCollection.findOne({ _id: ObjectId(uid) });

        let userLikes = user.likes;
        let result = [];
        for (let i of userLikes) {
            let recipeInformation = await recipesData.getRecipeById(i);
            result.push(recipeInformation);
        }
        return result;
    },
    async removeLikesFromUser(uid, rid) {
        const userCollection = await users();
        let user = await userCollection.findOne({ _id: ObjectId(uid) });

        let userLikes = user.likes;
        let newList = [];
        for (let i of userLikes) {
            if (!ObjectId(rid).equals(i)) {
                newList.push(i);
            }
        }

        let updateInformation = await userCollection.updateOne({ _id: ObjectId(uid) }, { $set: { likes: newList } });
        if (updateInformation.modifiedCount === 0) {
            throw 'could not edit the username successfully';
        }
        return this.getUserById(uid);

    }


}

module.exports = exportedMethods;
const {ObjectId} = require('mongodb')
const mongoCollections = require('../config/mongoCollections')
const users = mongoCollections.users
const recipesData = require('./recipes')
const uuid = require('uuid').v4
// const recipes = mongoCollections.recipes;

let exportedMethods = {
    async getUserById(id) {
        if (!id) {
            throw 'Must provide a userId'
        }
        const userCollection = await users()

        let user = await userCollection.findOne({_id: id})
        if (user === null) {
            throw "No user found"
        }
        return user
    }, async addUser(userName, password, post, likes, todos) {
        const userCollection = await users()

        if (!Array.isArray(todos)) {
            todos = []
        }
        let newUser = {
            userName: userName,
            password: password,
            Photo: null,
            Post: post,
            likes: likes,
            todos: todos  // Array
        }

        const newInsertInformation = await userCollection.insertOne(newUser)
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!'
        return await this.getUserById(newInsertInformation.insertedId)
    },
    async updateUserInfo(id, newUser) {
        const userCollection = await users()
        let updateInfo = {}
        if (!newUser) {
            throw 'No New User Provide'
        }
        if (!id) {
            throw 'You Must Provide User Id'
        }
        if (newUser.userName) {
            updateInfo.userName = newUser.userName
        }
        if (newUser.password) {
            updateInfo.password = newUser.password
        }
        if (newUser.Post) {
            updateInfo.Post = newUser.Post
        }

        let updateInformation = await userCollection.updateOne({_id: id}, {$set: updateInfo})
        if (updateInformation.modifiedCount === 0) {
            throw 'could not edit the username successfully'
        }
        return this.getUserById(id)
    },
    async getRecipeByUid(uid) {
        if (!uid || typeof uid !== 'string') {
            throw 'You must provide a valid uid'
        }

        const userCollection = await users()
        let user = await userCollection.findOne({_id: uid})

        let userRecipes = user.Post
        let result = []
        for (let i of userRecipes) {
            let recipeInformation = await recipesData.getRecipeById(i)
            result.push(recipeInformation)
        }
        return result
    },
    async removeRecipeFromUser(uid, rid) {
        if (!uid || typeof uid !== 'string') {
            throw 'You must provide a valid uid'
        }
        if (!rid || typeof rid !== 'string') {
            throw 'You must provide a valid postId'
        }

        const userCollection = await users()
        let user = await userCollection.findOne({_id: uid})
        let recipeIds = user.Post
        let newList = []
        for (let i of recipeIds) {
            if (rid !== i) {
                newList.push(i)
            } else {
                await recipesData.deleteRecipeById(i)
            }
        }
        // user.Post = newList;

        let updateInformation = await userCollection.updateOne({_id: uid}, {$set: {Post: newList}})
        if (updateInformation.modifiedCount === 0) {
            throw 'could not edit the username successfully'
        }
        return this.getUserById(uid)

    },
    async getLikesFromUser(uid) {
        if (!uid || typeof uid !== 'string') {
            throw 'You must provide a valid uid'
        }
        const userCollection = await users()
        let user = await userCollection.findOne({_id: uid})

        let userLikes = user.likes
        let result = []
        for (let i of userLikes) {
            let recipeInformation = null;
            try {
                recipeInformation = await recipesData.getRecipeById(i)
            } catch (error) {
                await this.removeLikesFromUser(uid, i);
            }
            if(recipeInformation !== null){
                result.push(recipeInformation)
            }
        }
        return result
    },
    async removeLikesFromUser(uid, rid) {
        if (!uid || typeof uid !== 'string') {
            throw 'You must provide a valid uid'
        }
        if (!rid || typeof rid !== 'string') {
            throw 'You must provide a valid postId'
        }
        const userCollection = await users()
        let user = await userCollection.findOne({_id: uid})

        let userLikes = user.likes
        let newList = []
        for (let i of userLikes) {
            if (rid !== i) {
                newList.push(i)
            }
        }

        let updateInformation = await userCollection.updateOne({_id: uid}, {$set: {likes: newList}})
        if (updateInformation.modifiedCount === 0) {
            throw 'could not edit the username successfully'
        }
        return this.getUserById(uid)

    },
    async uploadUserImg(uid, img) {
        const userCollection = await users()
        // let user = await userCollection.findOne({ _id: ObjectId(uid) });

        let updateInformation = await userCollection.updateOne({_id: uid}, {$set: {Photo: img}})
        if (updateInformation.modifiedCount === 0) {
            throw 'could not edit the username successfully'
        }
        return this.getUserById(uid)
    },
    async addNewUser(uid, userName) {
        const userCollection = await users()
        let newUserScheme = {
            _id: uid,
            userName: userName,
            Photo: "",
            todos: [],
            likes: [],
            Post: []
        }
        const newInsertInformation = await userCollection.insertOne(newUserScheme)
        return await this.getUserById(newInsertInformation.insertedId)
    },
    async addUserByUidAndUsername(uid, userName) {
        const userCollection = await users()
        const newInsertInformation = await userCollection.insertOne({_id: uid, userName: userName})
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!'
        return await this.getUserById(newInsertInformation.insertedId)
    },

    async removeUser(id) {
        const userCollection = await users()
        const deletionInfo = await userCollection.deleteOne({_id: id})
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete user with id of ${id}`
        }
        return true
    },
    async updateUser(id, firstName, lastName) {
        const user = await this.getUserById(id)
        console.log(user)

        const userUpdateInfo = {
            firstName: firstName, lastName: lastName
        }

        const userCollection = await users()
        const updateInfo = await userCollection.updateOne({_id: id}, {$set: userUpdateInfo})
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed'

        return await this.getUserById(id)
    }
}

module.exports = exportedMethods
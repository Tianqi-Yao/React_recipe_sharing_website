const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const recipes = mongoCollections.recipes;
// const posts = mongoCollections.posts;
const uuid = require('uuid').v4;
// const data = require('../data');
// const userData = data.users;

let exportedMethods = {
    async addPost(title, postContent) {
        const postCollection = await recipes();

        let newPost = {
            title: title,
            postContent: postContent,
            _id: uuid()
        }

        const newInsertInformation = await postCollection.insertOne(newPost)
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!'
        return await this.getRecipeById(newInsertInformation.insertedId)
    },
    async getPostById(id) {
        const postCollection = await recipes();
        const post = await postCollection.findOne({ _id: id });

        if (!post) throw 'Post not found';
        return post;
    },
    async getRecipeById(id) {
        // if(!ObjectId.isValid(id)) {
        //     id = ObjectId(id);
        // }
        const recipeCollection = await recipes();
        let recipe = await recipeCollection.findOne({ _id: id });
        console.log(recipe);
        if (recipe === null) {
            throw "No recipe found";
        }
        return recipe;
    },
    async deleteRecipeById(id) {
        if (!id) throw 'You must supply an ID';
        const recipeCollection = await recipes();
        const deletionInfo = await recipeCollection.deleteOne({ _id: id });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete post with id of ${id}`;
        }
        return { deleted: true };
    },


    //============yao================//
    async addPost(title, image, cookingMinutes, instructionsReadOnly, ingredients, userThatPosted) {
        if (typeof title !== 'string') throw 'No title provided';
        if (typeof instructionsReadOnly !== 'string') throw 'I aint got nobody!';

        if (!Array.isArray(ingredients)) {
            ingredients = [];
        }

        // const userThatPosted = await userData.getUserById(authorId);
        console.log(userThatPosted);

        const postCollection = await recipes();

        const newPost = {
            title: title,
            cookingMinutes: cookingMinutes,
            image: image,
            author: {
                id: userThatPosted._id,
                name: userThatPosted.userName   //todo 根据用户数据库key修改
            },
            instructionsReadOnly,
            ingredients: ingredients,
            _id: uuid()
        };

        const newInsertInformation = await postCollection.insertOne(newPost);
        const newId = newInsertInformation.insertedId;


        return await this.getPostById(newId);
    },
    async updatePost(id, title, image, cookingMinutes, instructionsReadOnly, ingredients, authorId) {
        const postCollection = await recipes();

        const updatedPostData = {};

        if (title) {
            updatedPostData.title = title;
        }
        if (image) {
            updatedPostData.image = image;
        }

        if (cookingMinutes) {
            updatedPostData.cookingMinutes = cookingMinutes;
        }
        if (instructionsReadOnly) {
            updatedPostData.instructionsReadOnly = instructionsReadOnly;
        }
        if (ingredients) {
            updatedPostData.ingredients = ingredients;
        }

        if (authorId) {
            updatedPostData.authorId = authorId;
        }

        await postCollection.updateOne({ _id: id }, { $set: updatedPostData });

        return await this.getPostById(id);
    }
}

module.exports = exportedMethods;
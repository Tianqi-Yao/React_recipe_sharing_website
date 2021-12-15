const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const recipes = mongoCollections.recipes;

let exportedMethods = {
    async addPost(title, postContent) {
        const postCollection = await recipes();

        let newPost = {
            title: title,
            postContent: postContent
        }

        const newInsertInformation = await postCollection.insertOne(newPost)
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!'
        return await this.getRecipeById(newInsertInformation.insertedId)
    },
    async getRecipeById(id) {
        if(!ObjectId.isValid(id)) {
            id = ObjectId(id);
        }
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
        if(!ObjectId.isValid(id)) {
            id = ObjectId(id);
        }
        const recipeCollection = await recipes();
        const deletionInfo = await recipeCollection.deleteOne({ _id: id });

        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete post with id of ${id}`;
        }
        return { deleted: true };
    }
}

module.exports = exportedMethods;
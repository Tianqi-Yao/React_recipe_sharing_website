const mongoCollections = require('../config/mongoCollections');
const posts = mongoCollections.posts;
const users = require('./users');
const uuid = require('uuid').v4;

const exportedMethods = {
  async getAllPosts() {
    const postCollection = await posts();
    return await postCollection.find({}).toArray();
  },
  async getPostById(id) {
    const postCollection = await posts();
    const post = await postCollection.findOne({ _id: id });

    if (!post) throw 'Post not found';
    return post;
  },


  async addPost(title,image, cookingMinutes,instructionsReadOnly, ingredients, authorId) {
    if (typeof title !== 'string') throw 'No title provided';
    if (typeof instructionsReadOnly !== 'string') throw 'I aint got nobody!';

    if (!Array.isArray(ingredients)) {
      ingredients = [];
    }

    const postCollection = await posts();

    const userThatPosted = await users.getUserById(authorId); 

    const newPost = {
      title: title,
      cookingMinutes: cookingMinutes,
      image:image,
      author: {
        id: authorId,
        name: `${userThatPosted.name} `   //todo 根据用户数据库key修改
      },
      instructionsReadOnly,
      ingredients: ingredients,
      _id: uuid()
    };

    const newInsertInformation = await postCollection.insertOne(newPost);
    const newId = newInsertInformation.insertedId;

    //await users.addPostToUser(authorId, newId, title);      //todo 这个菜谱的id添加到对应的user里

    return await this.getPostById(newId);
  },
  async removePost(id) {
    const postCollection = await posts();
    let post = null;
    try {
      post = await this.getPostById(id);
    } catch (e) {
      console.log(e);
      return;
    }
    const deletionInfo = await postCollection.removeOne({ _id: id });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete post with id of ${id}`;
    }
    await users.removePostFromUser(post.poster.id, id);
    return true;
  },
  async updatePost(id, title, image, cookingMinutes,instructionsReadOnly, ingredients, authorId) {
    const postCollection = await posts();

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
};

module.exports = exportedMethods;

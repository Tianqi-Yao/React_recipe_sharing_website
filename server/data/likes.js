const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let usersJS = require('./users');  // we need use async method of users ❤add like to user

let { ObjectId } = require('mongodb');


module.exports = {

  getAllLikesOfUser: async function(userId) {
    if (!userId) throw 'You must provide an userId to get';
    if (typeof userId !== 'string' || userId.length === 0) throw "userId must be string type and not an empty string";
    let parsedUserId = userId;
    const userCollection = await users();

    const currentUser = await userCollection.findOne({ _id: parsedUserId });
    return currentUser.likes;
  },

  getLikeByLikeId: async function(likeId) {
    if (!likeId) throw 'You must provide an likeId to get';
    if (typeof likeId !== 'string' || likeId.length === 0) throw "the likeId must be string type and not an empty string";
    const userCollection = await users();

    let retLike =  {};
    let tarUserObj = await userCollection.findOne({ 'likes': likeId });  // https://stackoverflow.com/questions/14040562/how-to-search-in-array-of-object-in-mongodb
    console.log(typeof tarUserObj);
    console.log(tarUserObj);
    let likeList = tarUserObj['likes'];
    
    for (let like of likeList) {
      if (like.toString() === likeId.toString())
        retLike = like;
    }
    if (!retLike) throw "Cannot find like with that likeId"

    return retLike;  // https://stackoverflow.com/questions/49508700/convert-mongodb-object-to-javascript-object
  },

  addReceipeToLike: async function(userId, likedReceipeId) {  //userId is string.  //! add receipe to wishList
    console.log(typeof userId);
    console.log(userId);
    console.log(likedReceipeId);
    const userCollection = await users();

    const currentUser = await userCollection.updateOne({ _id: userId }, { $addToSet: { likes: likedReceipeId}});  //! add like to user
    return usersJS.getUserById(userId);
  },

  deleteReceipeFromLike: async function(deletedReceipeId) {
    if (!deletedReceipeId) throw 'You must provide an todoId for removing';
    console.log(`type: ${typeof deletedReceipeId} likedReceipeId: ${deletedReceipeId}`);

    const userCollection = await users();

    // find target User Obj, get userId
    let tarUserObj = await userCollection.findOne({ 'likes': deletedReceipeId });
    userId = tarUserObj._id;  // userId is not ObjectId. It's currentUser.uid in firebase. I get it with 'const {currentUser}  = useAuth()' in react client side

    let delUserObj = await userCollection.updateOne({ '_id': userId }, { $pull: { likes: deletedReceipeId }})

    return delUserObj;
  },
};


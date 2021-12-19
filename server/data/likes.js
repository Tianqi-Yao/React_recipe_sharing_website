const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let usersJS = require('./users');  // we need use async method of users ❤add todo to user

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

  addReceipeToLike: async function(userId, likedReceipeId) {  //userId is string.  //! add receipe to wishList
    console.log(typeof userId);
    console.log(userId);
    console.log(likedReceipeId);
    const userCollection = await users();

    const currentUser = await userCollection.updateOne({ _id: userId }, { $addToSet: { likes: likedReceipeId}});  //! add todo to user
    return usersJS.getUserById(userId);
  },

  // deleteReceipeFromLike: async function(likedReceipeId) {
  //   console.log(`type: ${typeof likedReceipeId} likedReceipeId: ${likedReceipeId}`);
  //   if (!likedReceipeId) throw 'You must provide an likedReceipeId for removing';
  //   if (typeof likedReceipeId !== 'string' || likedReceipeId.length === 0) throw "The likedReceipeId must be string type and not an empty string";
  //   const userCollection = await users();

  //   // find target Book Obj, get userId
  //   let tarUserObj = await userCollection.findOne({ 'likes._id': likedReceipeId });
  //   userId = tarUserObj._id;  // userId is not ObjectId. It's currentUser.uid in firebase. I get it with 'const {currentUser}  = useAuth()' in react client side

  //   let delUserObj = await userCollection.updateOne({ '_id': userId }, { $pull: { likes: { _id : likedReceipeId }}})

  //   return delUserObj;
  // },
};


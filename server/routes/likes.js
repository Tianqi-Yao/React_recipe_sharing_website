const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;  // ../data/books
const likeData = data.likes;  // ../data/reviews


router.get('/:id', async (req, res) => {  // :id is userId. return likes for this userId
  try {
      const likesOfUser = await likeData.getAllLikesOfUser(req.params.id);  // req.params.id is userId
      res.status(200).json(likesOfUser);
    } catch (e) {
      // console.log(e);
      res.status(404).json({ error: 'Likes with userId not found' });
      return;
    }
});


router.post('/:id', async (req, res) => {  // :id is userId
  // const aReceipeNumber = req.body.params.receipeIdNeedToBeAdded; 
  
  try {  // check userId is valid
    const user = await userData.getUserById(req.params.id);  // req.params.id is userId
  } catch (e) {
    res.status(400).json({ error: 'User not found' });
    return;
  }
  
  // Json is valid and Like can be created successful
  try {
    const userThatLike = await likeData.addReceipeToLike(req.params.id, req.body.params.receipeIdNeedToBeAdded)  //! req.params.id is "userId", userId is a string, thus we can add likes to correspnding user  
    res.status(200).json(userThatLike);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});


// router.delete('/likes/:id', async (req, res) => {  // :id is receipeId
//   if (!req.params.id) throw 'You must specify an receipeId to delete';
//   try {
//     const aLike = await likeData.getLikeByLikeId(req.params.id);
//   } catch (e) {
//     res.status(404).json({ error: 'Like not found' });
//     return;
//   }

//   try {
//     const deleteLike = await likeData.deleteReceipeFromLike(req.params.id);
//     res.json({"receipeId": req.params.id, "deleted": true});
//   } catch (e) {
//     // console.log(e);
//     res.status(500).json( {error: e });
//   }
// });

module.exports = router;
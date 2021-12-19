const express = require('express');
const router = express.Router();

const data = require('../data');
const receipeData = data.receipes;  // "../data/pokemons" through ../data/index.js
const postData = data.recipes;
const userData = data.users;
const base64ToImage = require('base64-to-image');
const imageCmp = require("imagecmp");
var fs = require('fs');
var gm = require('gm');

// connect to redis
const redis = require('redis');
const client = redis.createClient();
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


router.get('/page/:page', async (req, res) => {
  if (!req.params.page) throw 'You must specify a page number to get';

  try {
    let cacheOfReceipePage = await client.getAsync(`receipePage${req.params.page}`);
    if (cacheOfReceipePage) {
      res.send(JSON.parse(cacheOfReceipePage));
    } else {
      let offset = 0;
      let limit = 30;

      if (req.params.page) {
        offset = parseInt(req.params.page) * limit;
      }

      if (parseInt(offset) < 0 || parseInt(limit) < 0) throw "Page parameters for offset and limit must be positive number"

      const receipePage = await receipeData.getReceipesPageList(parseInt(offset), parseInt(limit));
      res.json(receipePage);
      let cacheReceipePage = await client.setAsync(`receipePage${req.params.page}`, JSON.stringify(receipePage));  // store receipePage in cache
    }
  } catch (e) {
    res.status(404).json({ message: 'Server /page/:page Error. Receipe Page not found' });
  }
})


router.get('/:id', async (req, res) => {
  try {
    if (!req.params.id) throw 'You must specify a receipeId to get';

    let cacheOfReceipe = await client.getAsync(`recepieId${req.params.id}`);
    if (cacheOfReceipe) {
      res.send(JSON.parse(cacheOfReceipe));
    } else {  // receipe not in cache
      const singleReceipe = await receipeData.getRecipesById(req.params.id);
      res.json(singleReceipe);
      let cacheReceipe = await client.setAsync(`recepieId${req.params.id}`, JSON.stringify(singleReceipe));  // store pokemonPage in cache
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: 'Server /receipe/:id Error. Receipe not found with id' });
  }
});

router.get('/mongodb/:id', async (req, res) => {
  try {
    if (!req.params.id) throw 'You must specify a receipeId to get';

    const singleReceipe = await postData.getPostById(req.params.id);
    console.log("singleReceipe", singleReceipe);
    res.json(singleReceipe);
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: 'Server /receipe/:id Error. Receipe not found with id' });
  }
});

router.post('/create', async (req, res) => {
  try {
    // check input
    let title = req.body.title;
    if (!title || title == ' ') {  //give a response status code of 400 on the page, and render an HTML page with a paragraph class called error
      res.status(400);
      throw '"You should input title.';
    }
    let instructionsReadOnly = req.body.instructionsReadOnly;
    if (!instructionsReadOnly || instructionsReadOnly == ' ') {  //give a response status code of 400 on the page, and render an HTML page with a paragraph class called error
      res.status(400);
      throw '"You should input instructions.';
    }

    let image = req.body.image;
    if (image) {
      //save image to public
      let base64Str = image;
      let path = 'public/';
      let optionalObj = { 'fileName': 'uploadImage', 'type': 'png' };
      let imageInfo = base64ToImage(base64Str, path, optionalObj);
      console.log("imageInfo", imageInfo);

      //add Watermark
      let readStream = fs.createReadStream('public/uploadImage.png');
      gm(readStream, 'uploadImage.png')
        .fontSize(40)
        .fill('#95a5a6')
        .drawText(0, 50, "Fall2021WEB_Team_Watermark", 'Center')
        .write("./public/uploadImage_new.png", function (err) {
          if (err) {
            console.log("write error");
            reject(err);
          } else {
            console.log("write success");
            let bitmap = fs.readFileSync('./public/uploadImage_new.png');
            imageData = new Buffer(bitmap).toString('base64');
            image = 'data:image/png;base64,' + imageData;
            fs.unlinkSync('./public/uploadImage_new.png');
          }
        });

      // let bitmap = fs.readFileSync('./public/uploadImage_new.png');
      // // console.log("bitmap", bitmap);
      // imageData = new Buffer(bitmap).toString('base64');
      // image = 'data:image/png;base64,' + imageData;


      imageCmp.dataURLtoImage(image).then(res => {
        imageCmp.compressAccurately(res, 50).then(res => {
          console.log(res);
          imageCmp.filetoDataURL(res).then(res => {
            console.log("dataURL", res);
            image = res;
          })
        })
      })


      fs.unlinkSync('./public/uploadImage.png');
      // fs.unlinkSync('./public/uploadImage_new.png');
    }
    //get userInfo
    const userThatPosted = await userData.getUserById(req.body.userID);
    //add post
    const searchedReceipe = await postData.addPost(title, image, req.body.cookingMinutes, instructionsReadOnly, req.body.ingredients, userThatPosted);  // --title, cookingMinutes, instructionsReadOnly,ingredients, authorId
    console.log(searchedReceipe);
    //update user post list
    const postList = userThatPosted.Post;
    postList.push(searchedReceipe._id)
    const newUser = { Post: postList }


    await userData.updateUserInfo(req.body.userID, newUser);      //todo 这个菜谱的id添加到对应的user里

    res.json(searchedReceipe);
  } catch (e) {
    res.status(404).json({ error: `Server /create Error.` });
  }
})

router.patch('/update', async (req, res) => {
  try {
    // check input
    let title = req.body.title;
    if (!title || title == ' ') {  //give a response status code of 400 on the page, and render an HTML page with a paragraph class called error
      res.status(400);
      throw '"You should input title.';
    }
    let instructionsReadOnly = req.body.instructionsReadOnly;
    if (!instructionsReadOnly || instructionsReadOnly == ' ') {  //give a response status code of 400 on the page, and render an HTML page with a paragraph class called error
      res.status(400);
      throw '"You should input instructions.';
    }

    let image = req.body.image;
    console.log("image", image);
    if (image) {
      //save image to public
      let base64Str = image;
      let path = 'public/';
      let optionalObj = { 'fileName': 'uploadImage', 'type': 'png' };
      let imageInfo = base64ToImage(base64Str, path, optionalObj);
      console.log("imageInfo", imageInfo);

      //add Watermark
      let readStream = fs.createReadStream('public/uploadImage.png');
      gm(readStream, 'uploadImage.png')
        .fontSize(40)
        .fill('#95a5a6')
        .drawText(0, 50, "Fall2021WEB_Team_Watermark", 'Center')
        .write("./public/uploadImage_new.png", function (err) {
          if (err) {
            console.log("write error");
            reject(err);
          } else {
            console.log("write success");
            let bitmap = fs.readFileSync('./public/uploadImage_new.png');
            imageData = new Buffer(bitmap).toString('base64');
            image = 'data:image/png;base64,' + imageData;
            fs.unlinkSync('./public/uploadImage_new.png');
          }
        });
      // let bitmap = fs.readFileSync('./public/uploadImage_new.png');
      // imageData = new Buffer(bitmap).toString('base64');
      // image = 'data:image/png;base64,' + imageData;

      imageCmp.dataURLtoImage(image).then(res => {
        imageCmp.compressAccurately(res, 50).then(res => {
          console.log(res);
          imageCmp.filetoDataURL(res).then(res => {
            console.log("dataURL", res);
            image = res;
          })
        })
      })

      fs.unlinkSync('./public/uploadImage.png');
      
    }

    const searchedReceipe = await postData.updatePost(req.body.id, title, image, req.body.cookingMinutes, instructionsReadOnly, req.body.ingredients, req.body.userID);  // --title, cookingMinutes, instructionsReadOnly,ingredients, authorId
    res.json(searchedReceipe);
  } catch (e) {
    res.status(404).json({ error: `Server /create Error.` });
  }
})

router.post('/search', async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;

    if (!searchTerm || searchTerm == ' ') {  //give a response status code of 400 on the page, and render an HTML page with a paragraph class called error
      res.status(400);
      throw '"You should input text into form for searching and the text cannot just be spaces.';
    }

    // Check the cache to see if it has search results for that search term. If it does you will send those cached results to the client.
    let doesTermExist = await client.existsAsync(`${searchTerm}`);
    if (doesTermExist) {  // Exist. you will increment the search term counter in the sorted set.
      const existReceipe = await client.getAsync(`${searchTerm}`);
      await client.zincrbyAsync('receipeSortedSet', 1, `${searchTerm}`);
      // console.log(existReceipe);
      res.json(JSON.parse(existReceipe));
    }
    else {
      // If the term is not in the set, you will add it to the set and set the initial value to 1. 
      // query the API endpoint for the search term
      const searchedReceipe = await receipeData.getRecipesByTerm(searchTerm);
      let setReceipe = await client.setAsync(`${searchTerm}`, JSON.stringify(searchedReceipe));
      let newCacheSearchedReceipe = await client.getAsync(`${searchTerm}`);

      let addToSortedSort = await client.zaddAsync('receipeSortedSet', 1, `${searchTerm}`);
      res.json(searchedReceipe);
    }
  } catch (e) {
    res.status(404).json({ error: `Server /receipe/search Error. No results were found with search term: ${searchTerm}` });
  }
})


router.get('/popularSearches', async (req, res) => {
  try {
    let topPopularTerm = await client.zrevrangeAsync('receipeSortedSet', 0, 9);
    // res.render('others/popularSearch', {popularTerms: topPopularTerm, title: `Top 10 Popular Term`}); 
    res.json(topPopularTerm);
  } catch (e) {
    res.status(404).json({ error: 'Server /receipe/popularsearches Error.' });
  }
});


router.get('/randomSearch', async (req, res) => {
  try {
    const randomReceipe = await receipeData.getRandomRecipes();
    res.json(randomReceipe);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
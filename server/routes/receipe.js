const express = require('express');
const router = express.Router();

const data = require('../data');
const receipeData = data.receipes;  // "../data/pokemons" through ../data/index.js

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
      let setReceipe = await client.setAsync(`${searchTerm}`,  JSON.stringify(searchedReceipe));
      let newCacheSearchedReceipe  = await client.getAsync(`${searchTerm}`);

      let addToSortedSort = await client.zaddAsync('receipeSortedSet', 1, `${searchTerm}`);

      res.json(JSON.parse(searchedReceipe));
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
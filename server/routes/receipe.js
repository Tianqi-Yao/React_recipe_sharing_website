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
      res.json(existReceipe);
    }
    else {
    // If the term is not in the set, you will add it to the set and set the initial value to 1. 
    // query the API endpoint for the search term
      const searchedReceipe = await receipeData.getRecipesBySearch(searchTerm);  
      let setReceipe = await client.setAsync(`${searchTerm}`,  JSON.stringify(searchedReceipe));
      let newCacheSearchedReceipe  = await client.getAsync(`${searchTerm}`);

      let addToSortedSort = await client.zaddAsync('receipeSortedSet', 1, `${searchTerm}`);

      res.json(searchedReceipe);
    }
  } catch (e) {
    res.status(404).json({ error: `Server /receipe/search Error. No results were found with search term: ${searchTerm}` });
  }
})


router.get('/popularsearches', async (req, res) => {
  try {
    let topPopularTerm = await client.zrevrangeAsync('receipeSortedSet', 0, 9);
    // res.render('others/popularSearch', {popularTerms: topPopularTerm, title: `Top 10 Popular Term`}); 
    res.json(topPopularTerm);
  } catch (e) {
    res.status(404).json({ error: 'Server /receipe/popularsearches Error.' });
  }
});

module.exports = router;
const axios = require('axios');
// const apiKey = 'a2f86f878dad4601946b9e165e361de7';  // receipe API key  https://spoonacular.com/food-api/console#Profile
const apiKey = '01378051ff2c4d99846649b53b91835a'

let exportedMethods = {

  async getRecipeAPI() {
    const { data } = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}`);
    const parsedData = data;
    return parsedData
  },

  async getReceipesPageList(offset, number) {
    if (offset === undefined || number === undefined) throw "The offset or number parameter does not exit";
    const baseUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&offset=${offset}&number=${number}`;
    // console.log(baseUrl);
    const { data } = await axios.get(baseUrl);
    const parsedData = data;
    return parsedData;
  },

  async getRecipesById(id) {  https://api.spoonacular.com/recipes/complexSearch?apiKey=01378051ff2c4d99846649b53b91835a&offset=0&number=30
    try {
      if (id === undefined) throw "The id parameter does not exit";
      
      const baseUrl = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
      // console.log(baseUrl);
      const { data } = await axios.get(baseUrl); // id = b79327d05b8e5b838ad6cfd9576b30b6 
      const parsedData = data; // parse the data from JSON into a normal JS Object
      return parsedData; // this will be the single Pokemon object
    } catch (e) {
      console.log(e);
    }
  },

  async getRecipesByTerm(term) {
    if (term === undefined || term === null) throw "The query term is undefined";
    if (typeof term !== 'string') term = term.toString();

    try {
      const { data } = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${term}`);
      const parsedData = data;  // parse the data from JSON into a normal JS Object
      if (!parsedData) throw `We're sorry, but no results were found for ${term}.`;

      return parsedData;
    } catch (e) {
      throw `No results were found for search term: ${term}`;
    }
  },

  async getRandomRecipes() {
    try {
      const { data } = await axios.get(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`);
      const parsedData = data;  // parse the data from JSON into a normal JS Object
      // if (!parsedData) throw `We're sorry, but no results were found for ${term}.`;
      return parsedData;
    } catch (e) {
      console.log(e);
    }
  },
}

module.exports = exportedMethods;
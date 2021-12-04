const axios = require('axios');
// receipe API key
const app_id = '1b34c8e3';
const app_key = '881547ba769f1c613438da84da47eb64';

let exportedMethods = {

  async getRecipesById(id) {  // https://api.edamam.com/api/recipes/v2/b79327d05b8e5b838ad6cfd9576b30b6?type=public&app_id=1b34c8e3&app_key=881547ba769f1c613438da84da47eb64
    try {
      if (id === undefined) throw "The id parameter does not exit";

      const baseUrl = `https://api.edamam.com/api/recipes/v2/` + id + `?type=public&app_id=` + app_id + `&app_key=` + app_key;
      console.log(baseUrl);
      const { data } = await axios.get(baseUrl); // id = b79327d05b8e5b838ad6cfd9576b30b6 
      const parsedData = data; // parse the data from JSON into a normal JS Object
      return parsedData; // this will be the single Pokemon object
    } catch (e) {
      console.log(e);
    }
  },


  async getRecipesBySearchTerm(term) {
    if (term === undefined || term === null) throw "The query term is undefined";
    if (typeof term !== 'string') term = term.toString();

    try {
      const { data } = await axios.get(`https://api.edamam.com/api/recipes/v2?type=public&q=${term}&app_id=${app_id}&app_key=${app_key}`);
      const parsedData = data;  // parse the data from JSON into a normal JS Object
      if (!parsedData) throw `We're sorry, but no results were found for ${term}.`;

      return parsedData;
    } catch (e) {
      throw `No results were found for search term: ${term}`;
    }
  },


  async getRandomRecipesBySearchTerm(term) {
    if (term === undefined || term === null) throw "The query term is undefined";
    if (typeof term !== 'string') term = term.toString();

    try {
      const { data } = await axios.get(`https://api.edamam.com/api/recipes/v2?type=public&q=${term}&app_id=${app_id}&app_key=${app_key}&random=true`);
      const parsedData = data;  // parse the data from JSON into a normal JS Object
      if (!parsedData) throw `We're sorry, but no results were found for ${term}.`;

      return parsedData;
    } catch (e) {
      throw `No results were found for search term: ${term}`;
    }
  },
}

module.exports = exportedMethods;
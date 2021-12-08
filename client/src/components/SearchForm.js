import React from 'react'

const SearchReceipe = (props) => {

  const handleChange = (e) => {  // call handleChange() in onChange
    props.searchValue(e.target.value);
    console.log('e.target.value:', e.target.value);
  };

  return (
    <form method="POST" onSubmit={(e) => {e.preventDefault();}} className="center">
      <label>
        <span>Search Receipe By Keyword: </span>
        <input autoComplete="off" type="text" name="searchTerm" onChange={handleChange}/>
      </label>
    </form>
  );
}

export default SearchReceipe

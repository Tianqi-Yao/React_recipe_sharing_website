import React from 'react'

const SubmitSearchForm = (props) => {

  const handleSubmit = (e) => {  // call handleChange() in onChange
    props.searchValue(e.target.value);
    console.log('e.target.value:', e.target.value);
  };

  return (
    <form method="POST" action="/receipe/search" name="search-form" className="search-form center">
      Search Receipe:
      <input autoComplete="off" type="text" name="searchTerm" placeholder="Search Term" onSubmit={handleSubmit}/>
      <button type="submit">Submit search term</button>
    </form>
  );
}

export default SubmitSearchForm

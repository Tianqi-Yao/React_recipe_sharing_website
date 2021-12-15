import React from 'react'

const SubmitSearchForm = (props) => {

  const handleSubmit = (e) => {  // call handleChange() in onChange
    props.searchValue(e.target.value);
    console.log('e.target.value:', e.target.value);
  };

  return (
    <form method="POST" action="/receipe/search" onSubmit={(e) => {e.preventDefault();}} name="search-form" className="search-form center">
      Search Receipe:
      <input autoComplete="off" type="text" name="searchTerm" placeholder="Search Term" onChange={handleSubmit}/>
      {/* <button type="submit">Submit search term</button> */}
      <input type='submit' value='Search' className='btn' />
    </form>
  );
}

export default SubmitSearchForm

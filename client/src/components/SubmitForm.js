import React from 'react'

const SubmitSearchForm = (props) => {
  return (
    <form method="POST" action="/receipe/search" onSubmit={(e) => {e.preventDefault();}} name="search-form" className="search-form center">
      <label>
        Search Receipe:
        <input autoComplete="off" type="text" name="searchTerm" placeholder="Search Term"/>
      </label>
      <button type="submit">Submit search term</button>
    </form>
  );
}

export default SubmitSearchForm

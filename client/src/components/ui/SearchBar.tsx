import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TextField from '@mui/material/TextField';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { base64Encode } from '../../util/utilities';

function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const newQuery = e.target.value;
    setQuery(() => newQuery);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement | SVGSVGElement>) {
    e.preventDefault();
    const encodedQuery = base64Encode(JSON.stringify({ term: query }));
    navigate(`/events?q=${encodedQuery}`);
  }

  return (
    <form className="NavBar-search" onSubmit={(e) => handleSubmit(e)}>
      <TextField
        id="NavBar-search-box"
        color="primary"
        value={query}
        placeholder="search"
        onChange={(e) => handleChange(e)}
        InputProps={{
          startAdornment: (
            <FontAwesomeIcon
              icon={faSearch}
              cursor="pointer"
              onClick={(e: React.FormEvent<SVGSVGElement>) => handleSubmit(e)}
            />
          ),
        }}
      />
    </form>
  );
}

export default SearchBar;

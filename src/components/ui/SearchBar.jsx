import { useState } from "react";

const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
  const [searchText, setSearchText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchText);
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
    // Optional: For immediate search as typing
    // onSearch(e.target.value);
  };

  const handleClear = () => {
    setSearchText("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          value={searchText}
          onChange={handleChange}
          placeholder={placeholder}
        />
        {searchText && (
          <button type="button" onClick={handleClear}>
            Clear
          </button>
        )}
        <button type="submit">Search</button>
      </div>
    </form>
  );
};

export default SearchBar;

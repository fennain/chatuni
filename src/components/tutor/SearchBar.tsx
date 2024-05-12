import "./SearchBar.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function SearchBar() {
  const isMobile = /iPhone|iPod|Android/i.test(window.navigator.userAgent);
  return (
    <form className="search-form">
      <div className="searchContainer">
        <i className="search-icon bi bi-search"></i>
        <input className="search-input" placeholder="Search" />
        {!isMobile && <button className="searchButton">Search</button>}
      </div>
    </form>
  );
}

export default SearchBar;

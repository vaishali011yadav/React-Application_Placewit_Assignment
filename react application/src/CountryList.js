import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CountryList.css";

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        setCountries(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching countries.");
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (event) => {
    setSortBy(event.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCountries = filteredCountries.sort((a, b) => {
    if (sortBy === "name") {
      return a.name.common.localeCompare(b.name.common);
    } else if (sortBy === "population") {
      return b.population - a.population;
    }
    return 0;
  });

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <nav className="navbar">
        <h1 className="logo-text">Country Explorer</h1>
      </nav>
      <div className="country-list-container">
        <div className="controls">
          <input
            type="text"
            placeholder="Search countries"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select value={sortBy} onChange={handleSort}>
            <option value="name">Sort by Name</option>
            <option value="population">Sort by Population</option>
          </select>
        </div>
        {sortedCountries.length > 0 ? (
          <ul className="country-list">
            {sortedCountries.map((country) => (
              <li key={country.cca3} className="country-item">
                <img
                  src={country.flags.png}
                  alt={country.name.common}
                  className="country-flag"
                />
                <div>
                  <strong className="country-name">
                    {country.name.common}
                  </strong>
                  <span className="country-info">
                    Population: {country.population}
                  </span>
                  <span className="country-info">
                    Capital: {country.capital}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-results">No countries found.</div>
        )}
      </div>
    </div>
  );
};

export default CountryList;

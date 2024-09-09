import React, { useState } from 'react';
import './App.css';

const Buscador = () => {
  const [query, setQuery] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = async () => {
    const queries = query.split(',').map(q => q.trim()).filter(q => q);
    if (queries.length === 0) return;

    try {
      const requests = queries.map(q => fetch(`https://pokeapi.co/api/v2/pokemon/${q.toLowerCase()}`).then(res => res.json()));
      const results = await Promise.all(requests);
      setPokemonList(results);
      setError(null);
    } catch (err) {
      setPokemonList([]);
      setError('Pokémon no encontrado');
    }
  };

  return (
    <div className="buscador">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="¿Qué Pokémon buscas?"
        className="buscador-input"
      />
      <button onClick={handleSearch} className="buscador-button">
        Buscar
      </button>
      {error && <p className="error-message">{error}</p>}
      <div className="pokemon-list">
        {pokemonList.map(pokemon => (
          <div key={pokemon.id} className="pokemon-card">
            <div className="pokemon-image-container">
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                alt={pokemon.name}
                className="pokemon-image"
              />
            </div>
            <div className="pokemon-types">
              {pokemon.types.map(typeInfo => (
                <span key={typeInfo.type.name} className={`pokemon-type ${typeInfo.type.name}`}>
                  {typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)}
                </span>
              ))}
            </div>
            <div className="pokemon-details">
              <h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
              <div className="pokemon-stats">
                {pokemon.stats.map((stat, index) => (
                  <div key={index} className="stat">
                    <span className="stat-name">{stat.stat.name.charAt(0).toUpperCase() + stat.stat.name.slice(1)}</span>
                    <div className="stat-bar">
                      <div className="stat-bar-inner" style={{ width: `${stat.base_stat}%` }}>
                        <span className="stat-value">{stat.base_stat}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pokemon-metrics">
                <div className="metric metric-weight">
                  <span className="metric-icon"></span>
                  <span>{pokemon.weight / 10} kg</span>
                </div>
                <div className="metric metric-height">
                  <span className="metric-icon"></span>
                  <span>{pokemon.height / 10} m</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Buscador;

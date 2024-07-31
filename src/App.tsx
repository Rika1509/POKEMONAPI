import { useState, Children, useEffect, useCallback } from "react";
import axios from "axios";

const apiKey = "https://pokeapi.co/api/v2/";

interface Pokemon {
  id: number;
  types: Array<{
    type: {
      name: string;
    };
  }>
  weight: number;
  height: number;
  name: string;
  abilities: Array<{
    is_hidden: boolean;
    ability: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  sprites: string;
}
function App() {
  const [pokemon, setPokemon] = useState<string>("pikachu");
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [pokemonType, setPokemonType] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPokemon(event.target.value.toLowerCase())
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>   {
    event.preventDefault();
    getPokemon();
  };

  const getPokemon = useCallback(async () => {
    try {
      const result = await axios.get<Pokemon>(`${apiKey}pokemon/${pokemon}`);
      console.log("🚀 ~ getPokemon ~ result:", result);
      const data  = result.data;
      setPokemonType(data.types[0].type.name);
      setPokemonData([data]);
    } catch (error) {
      console.log("🚀 ~ getPokemon ~ error:", error);
    }
  }, [pokemon]);

  useEffect(() => {
    getPokemon();
  }, []);

  return (
    <>
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            onChange={handleChange}
            placeholder="enter pokémon name"
            value={pokemon}
          />
        </label>
      </form>
      {pokemonData.length > 0 && pokemonData.map((data) => (
      <div className="pokemon container" key={data.id}>
        <img src={data.sprites["front_default"]} />
        <div className="divTable">
          <div className="divTableBody">
            <div className="divTableRow">
              <div className="divTableCell">Type</div>
              <div className="divTableCell">{pokemonType}</div>
            </div>
            <div className="divTableRow">
              <div className="divTableCell">Height</div>
              <div className="divTableCell">{data.height}"</div>
            </div>
            <div className="divTableRow">
              <div className="divTableCell">Weight</div>
              <div className="divTableCell">{data.weight} lbs</div>
            </div>
            <div className="divTableRow">
              <div className="divTableCell">Abilities</div>
              <div className="divTableCell">
                <ul>
                  {Children.toArray(
                    data.abilities.map((ability) => (
                      <li key={ability.ability.name}>
                        {ability.is_hidden ? "hidden" : "normal"} : {ability?.ability.name}</li>
                    ))
                  )}
                </ul>
              </div>
            </div>
            <div className="divTableRow">
              <div className="divTableCell">Stats</div>
              <div className="divTableCell">
                <ul>
                  {Children.toArray(
                    data.stats.map((stat) => (
                      <li key={stat.stat.name}>
                        {stat?.stat.name} - base stat value: {stat?.base_stat}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      ))}
    </div>
    </>
  );
}

export default App;

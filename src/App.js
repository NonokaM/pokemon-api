import { useDeferredValue, useEffect, useState } from 'react';
import './App.css';
import {getAllPokemon, getPokemon} from "./utils/pokemon.js"
import Card from './components/Card/Card';
import Navber from './components/Navber/Navber';

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState("");

  useEffect(() => {
    const fetchPokemonData = async () => {
      // 全てのポケモンデータを取得
      let res = await getAllPokemon(initialURL);

      //各ポケモンの詳細なデータを取得
      loadPokemon(res.results);
      setNextURL(res.next);
      // console.log(res.results);

      // console.log(res);
      setLoading(false);
    };
    fetchPokemonData();
  }, []);

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map((pokemon) => {
        // console.log(pokemon)
        let pokemonRecord = getPokemon(pokemon.url)
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData)
  };


  const handleNextPage = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setLoading(false);
  };

  const handlePrevPage = () => {};

  return (
    <>
      <Navber />
      <div className="App">
        {loading ? (
          <h1>ロード中...</h1>
        ) : (
          <>
          <div className='pokemonCardContainer'>
            {pokemonData.map((pokemon, i) => {
              return <Card key={i} pokemon={pokemon} />
            })}
          </div>
          <div className='btn'>
            <button onClick={handlePrevPage}>Prev</button>
            <button onClick={handleNextPage}>Next</button>
          </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;

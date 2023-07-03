import { useState, useMemo, createContext, useContext, ReactNode } from "react";

interface Pokemon {
  id: number;
  name: string;
  image: string;
}

export async function getServerSideProps() {
  const resp = await fetch(
    "https://jherr-pokemon.s3.us-west-1.amazonaws.com/index.json"
  );
  return {
    props: {
      pokemon: await resp.json(),
    },
  };
}


const usePokemonController = (pokemon: Pokemon[]) => {

  const [filter, setFilter] = useState("");

  // pokemon.slice(0, 20);
  
//   pokemon = [
//     { id: 0, name: '',  image: ''}
// ]

  const filteredPokemon = useMemo(
    () =>
      pokemon?.slice(0,20).filter((p) =>
        p.name.toLowerCase().includes(filter.toLowerCase())
      ),
    [filter, pokemon]
  );

  return {
    filter,
    setFilter,
    pokemon: filteredPokemon,
  };
};

const PokemonContext = createContext<ReturnType<typeof usePokemonController>>({
  filter: "",
  setFilter: () => {},
  pokemon: [],
});

export const PokemonProvider = ({ 
    pokemon, 
    children }:{ 
    pokemon: any,
    children: React.ReactNode,   
    }) => (
  <PokemonContext.Provider value={usePokemonController(pokemon)}>
    {children}
  </PokemonContext.Provider>
);

export const usePokemon = () => useContext(PokemonContext);
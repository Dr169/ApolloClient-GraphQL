// Import everything needed to use the `useQuery` hook
import { useLazyQuery, NetworkStatus, useQuery, gql } from '@apollo/client';
import { useState } from 'react';

const GET_CHARACTERS = gql`
query {
  characters {
    results{
      id
      name
      image
    }
  }
}
`;

function DisplayCharacters() {
  const { loading, error, data } = useQuery(GET_CHARACTERS);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  
  return data.characters.results.map(({ id, name, image }) => (
    <div key={id}>
      <img width="400" height="250" alt="location-reference" src={`${image}`} />
      <h3>{name}</h3>
      <br/>
      <br/>
      <br/>
    </div>
  ));
};


function CharactersPhoto({ name }) {
  const { loading,
          error, 
          data, 
          refetch, 
          networkStatus
        } = useQuery(GET_CHARACTERS, {
                      variables: { name },
                      // pollInterval: 5000,
                      notifyOnNetworkStatusChange: true,
                      });

  let randomCharacter = Math.floor(Math.random() * 20);

  if (networkStatus === NetworkStatus.refetch) return <p>Refetching...</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      <img src={data.characters.results[randomCharacter].image} style={{ height: 100, width: 100 }} />
      <br/>
      <button onClick={() => refetch({ name: 'new_name' })}>
        Refetch new name!
      </button>
    </div>
  );
};

function DelayedQuery() {
  const { loading, error, data } = useQuery(GET_CHARACTERS);
  // const [getCharacters, { loading, error, data }] = useLazyQuery(GET_CHARACTERS);

  
  const [selectedName, setSelectedName] = useState('Rick Sanchez')

  let image_src = data?.characters?.results.filter((character) => {
    if (character.name === selectedName){
      return character.image
    }});
  
  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error : {error.message}</p>;
  
  return (
    <div>
      <select name='Characters' onChange={(e)=> setSelectedName(e.target.value)}>
        {data.characters.results.map((character) => (
          <option key={character.id} value={character.name}>
            {character.name}
          </option>
        ))}
      </select>
      <br/>
      <br/>
      <img src={image_src[0].image}/>
    </div>
  );
};

export default function App() {
  return (
    <div>
      <h2>My first Apollo app 🚀</h2>
      <br/>
      <DisplayCharacters />
      <CharactersPhoto />
      <DelayedQuery />
    </div>
  );
}
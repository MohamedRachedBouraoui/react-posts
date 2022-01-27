import Feed from "./Feed";
import React from 'react';
import { useContext } from "react";
import DataContext from "./context/DataContext";

const Home = () => {
  
  const { isLoading, fetchError, searchResults }=useContext(DataContext);

  return (
    <main className='Home'>
      {isLoading && <p className='statusMsg'>Loading posts ...</p>}
      {!isLoading && fetchError && <p className='statusMsg' style={{ color: 'red' }}>{fetchError}</p>}
      {!isLoading && !fetchError && (searchResults.length ? <Feed posts={searchResults} /> : <p className='statusMsg'>No Posts to display</p>)}

    </main>
  );
};

export default Home;

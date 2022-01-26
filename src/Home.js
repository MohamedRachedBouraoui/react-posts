import React from 'react';

import Feed from "./Feed";
const Home = ({ isLoading, fetchError, posts }) => {
  return (
    <main className='Home'>
      {isLoading && <p className='statusMsg'>Loading posts ...</p>}
      {!isLoading && fetchError && <p className='statusMsg' style={{ color: 'red' }}>{fetchError}</p>}
      {!isLoading && !fetchError && (posts.length ? <Feed posts={posts} /> : <p className='statusMsg'>No Posts to display</p>)}

    </main>
  );
};

export default Home;

import { format } from "date-fns";
import Header from "./Header";
import Nav from "./Nav";
import Footer from "./Footer";
import Home from "./Home";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import EditPost from "./EditPost";
import About from "./About";
import Missing from "./Missing";
import { Route, Switch, useHistory } from "react-router-dom";

import { useState, useEffect } from "react";

import api from "./api/posts";
import useWindowSize from "./hooks/useWindowSize";
import useAxiosFetch from "./hooks/useAxiosFetch";

function App() {

  const [posts, setPosts] = useState([]);

  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');

  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostBody, setEditPostBody] = useState('');

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const history = useHistory();
  const { width } = useWindowSize();
  const { data, fetchError, isLoading } = useAxiosFetch('http://localhost:3500/posts');

  useEffect(()=>{
    setPosts(data)
  },[data]);

  //useWindowSize();

  // useEffect(() => {

  //   const fetchPosts = async () => {

  //     try {
  //       const resp = await api.get('/posts');

  //       if (resp && resp.data)
  //         setPosts(resp.data);

  //     } catch (error) {
  //       if (error.repsponse) {//status > 200
  //         console.log(error.repsponse.data);
  //         console.log(error.repsponse.status);
  //         console.log(error.repsponse.headers);
  //       } else {
  //         console.log(`Error: ${error.message}`);
  //       }
  //     }
  //   }

  //   fetchPosts();
  // }, [])



  useEffect(() => {
    const filteredResult = posts.filter(post =>
      (post.body.toLowerCase().includes(search.toLowerCase()))
      || (post.title.toLowerCase().includes(search.toLowerCase()))
    );

    setSearchResults(filteredResult.reverse());

  }, [posts, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = posts.length ? (posts[posts.length - 1]).id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd yyyy pp');
    const newPost = { id, datetime, title: postTitle, body: postBody };

    try {
      const resp = await api.post('/posts', newPost)

      const allPosts = [...posts, resp.data];

      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      history.push('/');
    } catch (error) {
      console.log("🚀 ~ file: App.js ~  handleSubmit ~ error", error);
    }

  }

  const handleDelete = async (id) => {
    try {

      await api.delete(`/posts/${id}`);
      const postsList = posts.filter(post => post.id !== id);
      setPosts(postsList);
      history.push('/');

    } catch (error) {
      console.log("🚀 ~ file: App.js ~ line 91 ~ handleDelete ~ error", error)

    }
  }

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd yyyy pp');
    const updatedPost = { id, datetime, title: editPostTitle, body: editPostBody };
    try {

      const resp = await api.put(`posts/${id}`, updatedPost);
      setPosts(posts.map(post => post.id === id ? { ...resp.data } : post)); //get updated post + other posts
      setEditPostTitle('');
      setEditPostBody('');
      history.push('/');

    } catch (error) {
      console.log("🚀 ~ file: App.js ~ line 107 ~ handleEdit ~ error", error);

    }
  }

  return (
    <div className="App">
      <Header title="React JS Blog" width={width} />
      <Nav search={search} setSearch={setSearch} />

      <Switch>
        <Route exact path="/" >
          <Home 
          isLoading={isLoading}
          fetchError={fetchError}
          posts={searchResults} />
        </Route>
        <Route exact path="/post">
          <NewPost
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody}
            handleSubmit={handleSubmit}
          />
        </Route>
        <Route path="/edit/:id">
          <EditPost posts={posts}
            handleEdit={handleEdit}
            editPostTitle={editPostTitle}
            setEditPostTitle={setEditPostTitle}
            editPostBody={editPostBody}
            setEditPostBody={setEditPostBody}
          />
        </Route>
        <Route path="/post/:id">
          <PostPage posts={posts} handleDelete={handleDelete} />
        </Route>
        <Route path="/about" component={About} />
        <Route path="*" component={Missing} />
      </Switch>
      <Footer />
    </div>
  );
}

export default App;

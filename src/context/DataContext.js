import { createContext,useState,useEffect    } from "react";

import { useHistory } from "react-router-dom";


import api from "../api/posts";
import useWindowSize from "../hooks/useWindowSize";
import useAxiosFetch from "../hooks/useAxiosFetch";
import { format } from "date-fns";

const DataContext=createContext({} );

export const DataProvider=({children})=>{
    
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

  useEffect(() => {
    setPosts(data)
  }, [data]);

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
        <DataContext.Provider value={{
            width,
            isLoading, fetchError,
            search,setSearch,searchResults,
            postTitle, setPostTitle, postBody, setPostBody, handleSubmit

        }}>
            {children}

        </DataContext.Provider>
    )
};

export default DataContext;
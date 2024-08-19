import { createContext, useContext, useState } from 'react';

// Create the context
export const PostContext = createContext();

// Custom hook to use the PostContext
export const usePostContext = () => useContext(PostContext);

// Context provider component
export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const addNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <PostContext.Provider value={{ posts, setPosts, addNewPost }}>
      {children}
    </PostContext.Provider>
  );
};

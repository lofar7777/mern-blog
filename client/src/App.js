import {Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Post from './Post';
import Layout from "./Layout";
import Indexpage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import CreatePost from "./pages/CreatePost";
import PostPage from './pages/PostPage';

function App() {
  return (
    <UserContextProvider>
    <Routes>
          <Route path = "/" element={<Layout/>}>
            <Route index element={<Indexpage/>}/>
            <Route path='/login' element = {<LoginPage/>}/>
            <Route path = '/register' element={<RegisterPage />}/>
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element = {<PostPage />} />
          </Route>
        </Routes>
    </UserContextProvider>
    
  );
}


export default App;

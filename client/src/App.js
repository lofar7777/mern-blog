
import {Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Post from './Post';
import Layout from "./Layout";
import Indexpage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Routes>
      <Route path = "/" element={<Layout/>}>
      <Route index element={<Indexpage/>}/>
      <Route path='/login' element = {<LoginPage/>}/>
      <Route path = '/register' element={<RegisterPage />}/>
      </Route>
    </Routes>
  );
}


export default App;

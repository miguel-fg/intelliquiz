import InputComponent from '../components/InputComponent';
import QuizComponent from '../components/QuizComponent';
import Result from '../components/Result';
import { Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Divider from '../components/Divider';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const fetchNewToken = async () => {
    const apiURI = 'http://localhost:3000/pdf/auth';
    try {
      const response = await axios.get(apiURI);

      const { access_token, expires_in } = response.data;
      const currentTime = new Date().getTime();
      const expirationTime = currentTime + expires_in * 1000; // Expiration timestamp in milliseconds

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('tokenExpiration', expirationTime);

      setToken(access_token);
    } catch (error) {
      console.log('Failed to fetch token: ', error);
    }
  };

  const isTokenValid = () => {
    const storedExpiration = localStorage.getItem('tokenExpiration');

    if (!storedExpiration) return false;

    const currentTime = new Date().getTime();
    return currentTime < storedExpiration;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');

    if (storedToken && isTokenValid()) {
      setToken(storedToken);
      setLoading(false);
    } else {
      fetchNewToken().finally(() => setLoading(false));
    }
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className='px-10 py-2 font-oswald w-8/12 grid grid-cols-12'>
      <Navbar />
      <Divider />
      <Routes>
        <Route path='/*' element={<InputComponent />} />
        <Route path='/attempt' element={<QuizComponent />} />
        <Route path='/result' element={<Result />} />
      </Routes>
    </div>
  );
}

export default Home;

import InputComponent from '../components/InputComponent';
import QuizComponent from '../components/QuizComponent';
import Result from '../components/Result';
import { Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Divider from '../components/Divider';
import LoadingSpinner from '../components/LoadingSpinner';

import React, { useState, useEffect } from 'react';
import api from '../scripts/axiosInstance';

function Home() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const fetchNewToken = async () => {
    try {
      const response = await api.get('/pdf/auth');

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
    return (
      <div className='flex flex-col w-11/12 lg:w-8/12 h-screen justify-center items-center'>
        <LoadingSpinner />
        <h1 className='text-header font-oswald text-dPurple mb-5'>Loading...</h1>
        <h1 className='text-button font-oswald text-dPurple text-balance'>This might take some time while the server wakes up.</h1>
      </div>
    );
  }

  return (
    <div className='px-10 py-2 font-oswald w-11/12 lg:w-8/12 grid grid-cols-12'>
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

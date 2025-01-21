// LayoutWithHeaderFooter.jsx
import React from 'react';
import Header from '../components/Header';
import NewFooter from '../components/NewFooter';

const LayoutWithHeaderFooter = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <NewFooter />
    </>
  );
};

export default LayoutWithHeaderFooter;
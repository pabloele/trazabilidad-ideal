import React from 'react';
import { Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';

const BackButton = () => {
  const router = useRouter();
  if (router.pathname === '/home' || router.pathname === '/nueva-produccion') {
    return null;
  }
  return (
    <ArrowBackIcon
      sx={{
        fontSize: 40,
        position: 'fixed',
        top: 160,
        left: 20,
        color: 'gray',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: 8,
        cursor: 'pointer',
      }}
      onClick={() => router.back()}
    />
  );
};

export default BackButton;

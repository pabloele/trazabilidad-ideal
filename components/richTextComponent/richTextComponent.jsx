import { Grid } from '@mui/material';
import dynamic from 'next/dynamic';
import { useState } from 'react';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export const RichText = ({ toolbarOptions, value, setValue }) => {
  const modules = {
    toolbar: toolbarOptions,
  };

  return (
    <Grid bgcolor="white">
      <ReactQuill
        modules={modules}
        theme="snow"
        value={value}
        onChange={setValue}
        style={{ backgroundColor: 'whitesmoke', color: 'black' }}
      />
    </Grid>
  );
};

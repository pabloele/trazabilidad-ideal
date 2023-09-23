import { ThemeProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { idealTheme } from './idealTheme';
export const AppTheme = ({ children }) => {
  return (
    <ThemeProvider theme={idealTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

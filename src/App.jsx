import { useEffect } from 'react';
import { CssBaseline } from '@mui/joy';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter, useLocation } from 'react-router-dom';
import RoutesPage from './routes/routesPages';

const App = () => {

  return (
    <div className="App">
      <CssBaseline />
      <Toaster richColors closeButton position="top-center" />
      <BrowserRouter>
        <RoutesWithTransition />
      </BrowserRouter>
    </div>
  );
};

const RoutesWithTransition = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <RoutesPage location={location} key={location.pathname} />
    </AnimatePresence>
  );
};

export default App;

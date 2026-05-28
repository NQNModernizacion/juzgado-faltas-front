import ReactDOM from 'react-dom/client'

import "@nqnmodernizacion/muni-ui/tokens.css";
import "@nqnmodernizacion/muni-ui/styles.css";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './query/queryClient.js';

import { UserWrapper } from './context/UserWrapper.js'
import { ToastContainer } from 'react-toastify'
import RouteProvider from './routes/RouteProvider.js'

if (__DEV__) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
    <UserWrapper>
      <ToastContainer />
      <RouteProvider />
    </UserWrapper>
    </QueryClientProvider>
  )
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
    <UserWrapper>
      <ToastContainer />
      <RouteProvider />
    </UserWrapper>
    </QueryClientProvider>
  )
}

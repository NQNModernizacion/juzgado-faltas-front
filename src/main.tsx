import ReactDOM from 'react-dom/client'
import './index.css'

import 'react-toastify/dist/ReactToastify.css'

import { UserWrapper } from './context/UserWrapper.js'
import { ToastContainer } from 'react-toastify'
import RouteProvider from './routes/RouteProvider.js'

if (__DEV__) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <UserWrapper>
      <ToastContainer />
      <RouteProvider />
    </UserWrapper>
  )
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <UserWrapper>
      <ToastContainer />
      <RouteProvider />
    </UserWrapper>
  )
}

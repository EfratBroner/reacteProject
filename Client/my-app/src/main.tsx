import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import volunteerReducer from './redux/slices/volunteerSlice'
// שינוי: ייבוא הרדוסר החדש של הבקשות
import requestsReducer from './redux/slices/requestsSlice' 

const store = configureStore({
    reducer: {
        volunteer: volunteerReducer,
        // שינוי: הוספת רדוסר הבקשות לסטור כדי ששדות ה-useSelector בנב-בר יעבדו ללא שגיאות
        requests: requestsReducer 
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
import './App.scss'
import { Routes, Route } from 'react-router-dom'
import Main from './components/main/main' 
import HelpRequestDetailsPage from './components/HelpRequestDetails/HelpRequestDetailsPage'
import Profile from './components/Profile/Profile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />}>
        <Route path="profile" element={<Profile />} />
        <Route path="details/:id" element={<HelpRequestDetailsPage />} />
      </Route>
      <Route path="/login" element={<Main />} />
      <Route path="/register" element={<Main />} />
    </Routes>
  )
}

export default App;
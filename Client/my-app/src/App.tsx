import './App.scss'
import { Routes, Route } from 'react-router-dom'
import Main from './components/main/main'
import HelpRequestDetailsPage from './components/HelpRequestDetails/HelpRequestDetailsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Main />} />
      <Route path="/register" element={<Main />} />
      <Route path="/profile" element={<Main />} />
      <Route path="/details/:id" element={<HelpRequestDetailsPage />} />
    </Routes>
  )
}

export default App

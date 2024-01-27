import { BrowserRouter, Routes, Route ,useLocation} from 'react-router-dom';
import Login from './pages/Login';
import Word from './pages/Word';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path={'/login'} element={<Login/>} />
      <Route path={'/word'} element={<Word/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App

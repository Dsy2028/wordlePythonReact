import { BrowserRouter, Routes, Route ,useLocation} from 'react-router-dom';

import Word from './pages/Word';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path={'/word'} element={<Word/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App

import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import Agendamento from './pages/Agendamento/Agendamento';
import Confirmacao from './pages/Confirmacao/Confirmacao';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/confirmacao" element={<Confirmacao />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

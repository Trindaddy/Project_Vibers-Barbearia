import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import Agendamento from './pages/Agendamento/Agendamento';
import Confirmacao from './pages/Confirmacao/Confirmacao';
import AdminPainel from './pages/AdminPainel/AdminPainel.jsx';
import Agendamentos from './pages/AdminPainel/Agendamentos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/confirmacao" element={<Confirmacao />} />
        <Route path="/admin" element={<AdminPainel />} />
        <Route path="/admin/agendamentos" element={<Agendamentos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

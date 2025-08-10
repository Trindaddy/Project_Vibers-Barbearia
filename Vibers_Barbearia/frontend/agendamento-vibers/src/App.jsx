import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import Agendamento from './pages/Agendamento/Agendamento';
import Confirmacao from './pages/Confirmacao/Confirmacao';
import AdminPainel from './pages/AdminPainel/AdminPainel.jsx';
import Agendamentos from './pages/AdminPainel/Agendamentos';
import GerenciarLogos from './pages/AdminPainel/GerenciarLogos';
import Configuracoes from './pages/AdminPainel/Configuracoes';
import Login from './pages/Login/Login'; // Importa a página de login

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/confirmacao" element={<Confirmacao />} />
        <Route path="/login" element={<Login />} /> {/* Adiciona a rota */}
        
        <Route path="/admin" element={<AdminPainel />} />
        <Route path="/admin/agendamentos" element={<Agendamentos />} />
        <Route path="/admin/logos" element={<GerenciarLogos />} />
        <Route path="/admin/configuracoes" element={<Configuracoes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

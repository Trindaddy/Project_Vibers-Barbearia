import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componentes
import LandingPage from './pages/LandingPage/LandingPage';
import Agendamento from './pages/Agendamento/Agendamento';
import Confirmacao from './pages/Confirmacao/Confirmacao';
import Login from './pages/Login/Login';
import ProtectedRoute from './pages/ProtectedRoute/ProtectedRoute.jsx'; // 1. Importa o componente de proteção

// Páginas do Admin
import AdminPainel from './pages/AdminPainel/AdminPainel.jsx';
import Agendamentos from './pages/AdminPainel/Agendamentos';
import GerenciarLogos from './pages/AdminPainel/GerenciarLogos';
import Configuracoes from './pages/AdminPainel/Configuracoes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Rotas Públicas --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/confirmacao" element={<Confirmacao />} />
        <Route path="/login" element={<Login />} />
        
        {/* --- Rotas Protegidas --- */}
        {/* 2. Todas as rotas dentro deste grupo exigirão login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminPainel />} />
          <Route path="/admin/agendamentos" element={<Agendamentos />} />
          <Route path="/admin/logos" element={<GerenciarLogos />} />
          <Route path="/admin/configuracoes" element={<Configuracoes />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from './pages/Context/ConfigContext.jsx'; // 1. Importa o Provedor

// Componentes
import LandingPage from './pages/LandingPage/LandingPage';
import Agendamento from './pages/Agendamento/Agendamento';
import Confirmacao from './pages/Confirmacao/Confirmacao';
import Login from './pages/Login/Login';
import ProtectedRoute from './pages/ProtectedRoute/ProtectedRoute';

// Páginas do Admin
import AdminPainel from './pages/AdminPainel/AdminPainel.jsx';
import Agendamentos from './pages/AdminPainel/Agendamentos';
import GerenciarLogos from './pages/AdminPainel/GerenciarLogos';
import Configuracoes from './pages/AdminPainel/Configuracoes';

function App() {
  return (
    // 2. Envolve toda a aplicação com o ConfigProvider
    <ConfigProvider>
      <BrowserRouter>
        <Routes>
          {/* ... (suas rotas continuam aqui, inalteradas) ... */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/agendamento" element={<Agendamento />} />
          <Route path="/confirmacao" element={<Confirmacao />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminPainel />} />
            <Route path="/admin/agendamentos" element={<Agendamentos />} />
            <Route path="/admin/logos" element={<GerenciarLogos />} />
            <Route path="/admin/configuracoes" element={<Configuracoes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;

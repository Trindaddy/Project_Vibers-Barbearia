// src/pages/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const useAuth = () => {
  // A lógica de autenticação é simplesmente verificar se o token existe.
  const token = localStorage.getItem('authToken');
  return token ? true : false;
};

const ProtectedRoute = () => {
  const isAuth = useAuth();

  // Se o usuário estiver autenticado, o <Outlet> renderiza o componente da rota filha (ex: AdminPainel).
  // Se não, ele redireciona para a página de login.
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // para estilos adicionais se quiser

function LandingPage() {
  const navigate = useNavigate();

  const irParaAgendamento = () => {
    navigate('/agendamento');
  };

  return (
    <div
      style={{
        height: '100vh',
        backgroundImage: "url('/barber-pole.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Topo */}
      <div style={{ padding: '2rem' }}>
        <h3 style={{ color: '#fff', fontFamily: 'Poppins, sans-serif', fontWeight: '500' }}>
          Viber’s Barbearias
        </h3>
      </div>

      {/* Texto Central */}
      <div style={{ paddingLeft: '4rem', color: '#fff' }}>
        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '3.5rem', lineHeight: '1' }}>
          ESTILO<br />
          UNICO SEM
        </h1>
        <h1
          style={{
            fontFamily: "'Dancing Script', cursive",
            color: '#F2C12E',
            fontSize: '4rem',
            fontWeight: '700',
            marginTop: '-0.5rem',
          }}
        >
          Gastar
        </h1>
      </div>

      {/* Rodapé com botão */}
      <div
        style={{
          backgroundColor: '#fff',
          padding: '1rem 0',
          textAlign: 'center',
        }}
      >
        <button
          onClick={irParaAgendamento}
          style={{
            backgroundColor: '#F2C12E',
            border: 'none',
            padding: '0.8rem 2.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            fontFamily: 'Poppins, sans-serif',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          Agende seu horário → 
        </button>
      </div>
    </div>
  );
}

export default LandingPage;

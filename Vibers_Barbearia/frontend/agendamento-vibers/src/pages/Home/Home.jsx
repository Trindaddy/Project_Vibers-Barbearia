import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaStore, FaUser } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex align-items-center min-vh-100 bg-light">
      <Container>
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-dark">Bem-vindo ao BarberApp</h1>
          <p className="lead text-muted">A plataforma completa para o seu estilo.</p>
        </div>

        <Row className="justify-content-center g-4">
          {/* Card para Barbearias */}
          <Col md={5} lg={4}>
            <Card className="h-100 shadow-sm border-0 hover-scale">
              <Card.Body className="text-center p-5">
                <div className="display-1 text-warning mb-3"><FaStore /></div>
                <Card.Title as="h2">Para Barbearias</Card.Title>
                <Card.Text>
                  Gerencie seus agendamentos, filas e clientes em um só lugar.
                </Card.Text>
                <div className="d-grid gap-2 mt-4">
                    <Button variant="outline-dark" onClick={() => navigate('/auth/login?type=business')}>Entrar</Button>
                    <Button variant="warning" onClick={() => navigate('/auth/register-business')}>Cadastrar Barbearia</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Card para Clientes */}
          <Col md={5} lg={4}>
            <Card className="h-100 shadow-sm border-0 hover-scale">
              <Card.Body className="text-center p-5">
                <div className="display-1 text-primary mb-3"><FaUser /></div>
                <Card.Title as="h2">Para Clientes</Card.Title>
                <Card.Text>
                  Encontre sua barbearia favorita e agende seu horário sem complicações.
                </Card.Text>
                <div className="d-grid gap-2 mt-4">
                    <Button variant="outline-primary" onClick={() => navigate('/auth/login?type=client')}>Entrar como Cliente</Button>
                    <Button variant="primary" onClick={() => navigate('/auth/register-client')}>Criar Conta</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
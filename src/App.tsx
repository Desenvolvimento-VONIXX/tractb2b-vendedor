import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import TabelaPreco from "./pages/TabelaPreco";
import { AuthProvider, useAuth } from "./context/auth";
import Redefinicao from "./pages/Redefinicao";
// import DetalheCliente from "./pages/DetalheCliente";
import EsqueciMinhaSenha from "./pages/EsqueciMinhaSenha";
import Loading from "./pages/Loading";

const Private: React.FC<{ Item: React.ComponentType }> = ({ Item }) => {
  const { signed, needPasswordReset, loading } = useAuth();

  if (loading) {
    return <Loading />; // Ou um componente de carregamento
  }

  if (!signed) {
    return <Navigate to="/" />;
  }

  if (needPasswordReset) {
    return <Redefinicao />;
  }

  return <Item />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/EsqueciMinhaSenha" element={<EsqueciMinhaSenha />} />
          <Route path="/Redefinir" element={<Private Item={Redefinicao} />} />
          <Route path="/Tabela" element={<Private Item={TabelaPreco} />} />
          {/* <Route
            path="/DetalheCliente"
            element={<Private Item={DetalheCliente} />}
          /> */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

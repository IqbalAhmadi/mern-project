import './App.css';
import React from 'react';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Auth from './utils/auth';
import { Container } from 'react-bootstrap';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Medicines from './pages/Medicines';
import Medicine from './pages/Medicine';
import NotFound from './pages/NotFound';

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Navbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/medicines"
              element={Auth.loggedIn() ? <Medicines /> : <Navigate to="/" />}
            />
            <Route
              path="/medicine/:medicineId"
              element={Auth.loggedIn() ? <Medicine /> : <Navigate to="/" />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </Router>
    </ApolloProvider>
  );
}

export default App;

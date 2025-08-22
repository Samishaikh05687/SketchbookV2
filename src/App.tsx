import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Whiteboard from './Whiteboard';

const queryClient = new QueryClient();

function App() {
  return (
    <div className=''>
      <Router>
      
        <Routes>
          <Route path="/"  element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/canvas"
            element={
              <Whiteboard
                queryClient={queryClient}
                roomId={new URLSearchParams(window.location.search).get('room') || ''}
                handleRoomChange={(newRoomId) =>
                  window.history.pushState({}, '', `${window.location.origin}/canvas?room=${newRoomId}`)
                }
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
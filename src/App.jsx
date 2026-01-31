import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { BookingSuccess } from './pages/BookingSuccess';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/success" element={<BookingSuccess />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

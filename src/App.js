import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import Forecast from './components/forecast';

function App() {
  return (
    <div className="App">
      <Header></Header>
      <Forecast></Forecast>
    </div>
  );
}

export default App;

import Demo from './componets'
import './App.css';

function App() {
  return (
    <div className="App bg-green-50 h-screen flex flex-col">
      <div className="header h-8 border-2 border-gray-600 bg-gray-300 text-left font-mono font-extrabold bg-gradient-to-r from-indigo-100 to-gray-600 pl-2">
        <span>Draw your Video!</span>
      </div>
      <div className="demo-box">
        <Demo></Demo>
      </div>
      <div className="text-sm text-gray-300">producted by Dramalf 2021@R </div>
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';

async function fetchingBackend() {
  const url = 'http://localhost:3000/';
  await fetch(url).then((response) => response.text());

  // const response = fetch(url).then((response) => response.json());
  // const body = JSON.stringify(response);
  // console.log('body: ', body);
}

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={fetchingBackend}>Click here!</button>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

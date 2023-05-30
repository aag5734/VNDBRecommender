import rena from './assets/rena.jpg';
import React, {useState} from "react";
import './App.css';

function App() {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    console.log(username);
    // e.preventDefault();
    setUsername("");
  }

  return (
    <div className="vndb">
      <header className="vndbHeader">
        <img src={rena} className="funnyRena" alt="logo"/>
        <h1>
          Visual Novel Recommender
        </h1>
        <form className="userForm" onSubmit={handleSubmit}>
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            name='username'
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </form>
      </header>
    </div>
  );
}

export default App;

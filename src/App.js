import React, { Component } from 'react';
import './App.css';
import Hexagon from './Hexagon';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Hexagon></Hexagon>
        </header>
      </div>
    );
  }
}

export default App;

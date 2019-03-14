import React, { Component } from 'react';
import './App.css';
import Hexagon from './Hexagon';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hexGrid: new Array(10),
    };
    for(let i = 0; i < this.state.hexGrid.length; i++){
      this.state.hexGrid[i] = new Array(10);
      for(let j = 0; j < this.state.hexGrid[i].length; j++){
        this.state.hexGrid[i][j] = {
          name: "Number " + (i + j),
        };
      }
    }
  }

  render() {
    return (
      <div className="HexGrid">
        <div className="HexRow">{this.state.hexGrid.map((i) => {
          return <div className={"HexCol Even"}>{this.state.hexGrid.map(() => {
            return <Hexagon></Hexagon>
          })}</div>
        })}</div>
      </div>
    );
  }
}

export default App;

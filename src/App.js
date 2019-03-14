import React, { Component } from 'react';
import './App.css';
import Hexagon from './Hexagon';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hexGrid: new Array(10),
    };
    for(let i = 0; i < this.state.hexGrid.length; i++){//rows
      this.state.hexGrid[i] = new Array(10);
      for(let j = 0; j < this.state.hexGrid[i].length; j++){//cols
        this.state.hexGrid[i][j] = {
          name: "Number " + (i + j),
        };
      }
    }
  }

  render() {
    return (
      <div>
        <div class="grid-container">
        {this.state.hexGrid.map((value) => {//row
          return <div>{value.map(() => {//col
            return <Hexagon></Hexagon>
          })}</div>
        })}
        </div>
      </div>
    );
  }
}

export default App;

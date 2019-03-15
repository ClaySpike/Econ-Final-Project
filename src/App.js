import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hexGrid: new Array(6),
    };
    for(let i = 0; i < this.state.hexGrid.length; i++){
      if(i % 2 === 0){
        this.state.hexGrid[i] = new Array(10);
      }
      else{
        this.state.hexGrid[i] = new Array(9);
      }
      for(let j = 0; j < this.state.hexGrid[i].length; j++){
        this.state.hexGrid[i][j] = (<li className="hex">
                                      <div className="hexIn">
                                        <div className="hexLink">
                                          <h1>This is a title</h1>
                                          <p>Some sample text about the article this hexagon leads to</p>
                                        </div>
                                      </div>
                                    </li>)
      }
    }
  }

  giveHexes(){
    let newArr = [];
    for(var i = 0; i < this.state.hexGrid.length; i++){
        newArr = newArr.concat(this.state.hexGrid[i]);
    }
    console.log(newArr);
    return newArr;
  }

  render() {
    return (
      <ul id="hexGrid">{ this.giveHexes() }
        {/*<li class="hex">
          <div class="hexIn">
            <div class="hexLink">
              <h1>This is a title</h1>
              <p>Some sample text about the article this hexagon leads to</p>
            </div>
          </div>
        </li>*/}
      </ul>
    );
  }
}

export default App;

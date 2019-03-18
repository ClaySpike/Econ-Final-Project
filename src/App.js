import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hexGrid: new Array(9),
    };
    /* START GRID INITIALIZATION */
    for(let i = 0; i < this.state.hexGrid.length; i++){
      if(i % 2 === 0){
        this.state.hexGrid[i] = new Array(10)
      }
      else{
        this.state.hexGrid[i] = new Array(9)
      }
      for(let j = 0; j < this.state.hexGrid[i].length; j++){
        this.state.hexGrid[i][j] = {
          cropLevel: Math.random() * 10, 
          mineLevel: Math.random() * 10, 
          currentDiv: (<li className="hex" key={i + " " + j + " hex"}>
                        <div className="hexIn" key={i + " " + j + " hexIn"}>
                          <div className="hexLink" key={i + " " + j + " hexLink"}>
                            <h1 key={i + " " + j + " data"}>error has occoured</h1>
                            <p key={i + " " + j + "text"}>Some sample text about the article this hexagon leads to</p>
                          </div>
                        </div>
                      </li>),
        }
      }
    }

    for(let i = 0; i < this.state.hexGrid.length; i++){
      for(let d = 0; d < this.state.hexGrid[i].length; d++){
        if(this.state.hexGrid[i][d].cropLevel > this.state.hexGrid[i][d].mineLevel){
          this.state.hexGrid[i][d].currentDiv = (
            <li className="hex" key={i + " " + d + " hex"}>
              <div className="hexIn colorGreen" key={i + " " + d + " hexIn"}>
                <div className="hexLink" key={i + " " + d + " hexLink"}>
                  <h1 key={i + " " + d + " data"}>{this.state.hexGrid[i][d].cropLevel}</h1>
                  <p key={i + " " + d + "text"}>Some sample text about the article this hexagon leads to</p>
                </div>
              </div>
            </li>
          )
        }
        else if(this.state.hexGrid[i][d].cropLevel < this.state.hexGrid[i][d].mineLevel){
          this.state.hexGrid[i][d].currentDiv = (
            <li className="hex" key={i + " " + d + " hex"}>
              <div className="hexIn colorBrown" key={i + " " + d + " hexIn"}>
                <div className="hexLink" key={i + " " + d + " hexLink"}>
                  <h1 key={i + " " + d + " data"}>{this.state.hexGrid[i][d].mineLevel}</h1>
                  <p key={i + " " + d + "text"}>Some sample text about the article this hexagon leads to</p>
                </div>
              </div>
            </li>
          )
        }
        else {
          this.state.hexGrid[i][d].currentDiv = (
            <li className="hex" key={i + " " + d + " hex"}>
              <div className="hexIn" key={i + " " + d + " hexIn"}>
                <div className="hexLink" key={i + " " + d + " hexLink"}>
                  <h1 key={i + " " + d + " data"}>Error at this tile</h1>
                  <p key={i + " " + d + "text"}>Some sample text about the article this hexagon leads to</p>
                </div>
              </div>
            </li>
          )
        }
      }
    }
    /* INITIALIZATION OF ARRAY WITH RAND VALUES COMPLETE*/
  }

  giveHexes(){
    let arr = []
    for(let i = 0; i < this.state.hexGrid.length; i++){
      for(let d = 0; d < this.state.hexGrid[i].length; d++){
        arr.push(this.state.hexGrid[i][d].currentDiv)
      }
    }
    return arr;
  }

  render() {
    return (
      <div className="App">
        <ul id="hexGrid">{ this.giveHexes() }</ul>
        <div className="dataContainer">
          <h1 className="title">
            Mesothelioma:
          </h1>
          <h2 className="title">
            subheader:
          </h2>
          <p>
            Normal text goes here
          </p>
        </div>
      </div>
    );
  }
}

export default App;

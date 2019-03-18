import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hexGrid: new Array(9),
      nations: [{ ownedLocations: [] }],
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
          currentNation: -1,
          cropLevel: Math.random() * 10, 
          mineLevel: Math.random() * 10, 
          currentDiv: (<li className="hex" key={i + " " + j + " hex"}>
                        <div className="hexIn" key={i + " " + j + " hexIn"}>
                          <div className="hexLink" key={i + " " + j + " hexLink"}>
                            <img></img>
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
          this.setHexDiv(i, d, this.state.hexGrid[i][d].cropLevel, "Crop", "colorGreen")
        }
        else if(this.state.hexGrid[i][d].cropLevel < this.state.hexGrid[i][d].mineLevel){
          this.setHexDiv(i, d, this.state.hexGrid[i][d].mineLevel, "Mine", "colorBrown")
        }
        else {
          this.setHexDiv(i, d, "topText", "bottomText", "")
        }
      }
    }
    /* INITIALIZATION OF ARRAY WITH RAND VALUES COMPLETE*/
    /* START INITIALIZATION OF NATIONS*/
    for(let i = 0; i < 1; i++){
      let xLoc = Math.floor((Math.random() * this.state.hexGrid.length))
      let yLoc = Math.floor((Math.random() * this.state.hexGrid[xLoc].length))
      this.state.nations[i] = { ownedLocations:[[xLoc, yLoc]] }
      for(let j = 0; j < this.state.nations[i].ownedLocations.length; j++){
        let xCoord = this.state.nations[i].ownedLocations[j][0];
        let yCoord = this.state.nations[i].ownedLocations[j][1];
        if(this.state.hexGrid[xCoord][yCoord].cropLevel > 
          this.state.hexGrid[xCoord][yCoord].mineLevel){
          this.setHexDiv(
            xCoord, 
            yCoord, 
            this.state.hexGrid[xCoord][yCoord].cropLevel, 
            "Crop", 
            "colorGreenClaimed")
        }
        else if(this.state.hexGrid[xCoord][yCoord].cropLevel < 
          this.state.hexGrid[xCoord][yCoord].mineLevel){
          this.setHexDiv(
            xCoord, 
            yCoord, 
            this.state.hexGrid[xCoord][yCoord].mineLevel, 
            "Mine", 
            "colorBrownClaimed")
        }
        else {
          this.setHexDiv(
            xCoord, 
            yCoord, 
            "topText", 
            "bottomText", 
            "")
        }
      }
    }
  }

  setHexDiv(xLoc, yLoc, topText, bottomText, colorCSS){
    this.state.hexGrid[xLoc][yLoc].currentDiv = (
      <li className="hex" key={xLoc + " " + yLoc + " hex"}>
        <div className={"hexIn " + colorCSS} key={xLoc + " " + yLoc + " hexIn"}>
          <div className="hexLink" key={xLoc + " " + yLoc + " hexLink"}>
            <img src={new Image(100, 100)}></img>
            <h1 key={xLoc + " " + yLoc + " data"}>{topText}</h1>
            <p key={xLoc + " " + yLoc + "text"}>{bottomText}</p>
          </div>
        </div>
      </li>
    )
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

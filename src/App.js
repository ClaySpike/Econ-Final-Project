import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0, 
      height: 0,
      hexGrid: new Array(10),
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    for(let i = 0; i < this.state.hexGrid.length; i++){
      this.state.hexGrid[i] = new Array(this.state.hexGrid.length)
      for(let j = 0; j < this.state.hexGrid[i].length; j++){
        let w = this.generateWater(10)
        let c = this.generateOther(w)
        let m = this.generateOther(w)
        this.state.hexGrid[i][j] = {
          water: w,
          cropLevel: c,
          mineLevel: m,
          div: this.setHexDiv(w, c, m),
        }
      }
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  generateWater(chance){
    if(Math.floor(Math.random() * chance) == 0){
      return true
    }
    return false
  }

  generateOther(water){
    if(!water){
      return Math.random() * 10
    }
    return 0
  }

  setHexDiv(water, cropLevel, mineLevel){
    if(water){
      return  <svg className="hex" width="9.5%" viewBox={"0 0 " + this.getHexWidth() + " " + this.getHexHeight()}>
                <polygon points= {this.getHexPoints()} className="hexStyle hexColorBlue hexBackgroundStroke"/>
              </svg>
    }
    else if(cropLevel > mineLevel){
      return  <svg className="hex" width="9.5%" viewBox={"0 0 " + this.getHexWidth() + " " + this.getHexHeight()}>
                <polygon points= {this.getHexPoints()} className="hexStyle hexColorGreen hexBackgroundStroke"/>
              </svg>
    }
    else if(cropLevel < mineLevel){
      return  <svg className="hex" width="9.5%" viewBox={"0 0 " + this.getHexWidth() + " " + this.getHexHeight()}>
                <polygon points= {this.getHexPoints()} className="hexStyle hexColorBrown hexBackgroundStroke"/>
              </svg>
    }
    else{
      return  <svg className="hex" width="9.5%" viewBox={"0 0 " + this.getHexWidth() + " " + this.getHexHeight()}>
                <polygon points= {this.getHexPoints()} className="hexStyle hexBackgroundStroke"/>
              </svg>
    }
  }

  getHexWidth(){
    if(document.getElementById("grid") != null){
      return document.getElementById("grid").clientWidth / 10
    }
    return this.state.width / 10
  }

  getHexHeight(){
    return this.getHexWidth() * 2 * Math.tan(Math.PI / 6)
  }

  getHexPoints(){
    let halfWidth = this.getHexWidth()/2
    let topHalf = Math.tan(Math.PI/6)*this.getHexWidth()/2
    let bottomHalf = 3*Math.tan(Math.PI/6)*this.getHexWidth()/2
    return halfWidth + ", " + 0 + " " +
    this.getHexWidth() + ", " + topHalf + " " + 
    this.getHexWidth() + ", " + bottomHalf + " " + 
    halfWidth + ", " + this.getHexHeight() + " " +
    0 + ", " + bottomHalf + " " +
    0 + ", " + topHalf
  }

  getHexes(){
    let arr = []
    for(let i = 0; i < this.state.hexGrid.length; i++){
      for(let j = 0; j < this.state.hexGrid[i].length; j++){
        this.state.hexGrid[i][j].div = this.setHexDiv(
          this.state.hexGrid[i][j].water,
          this.state.hexGrid[i][j].cropLevel,
          this.state.hexGrid[i][j].mineLevel
        )
      }
    }
    for(let i = 0; i < this.state.hexGrid.length; i++){
      arr = arr.concat(this.state.hexGrid[i])
    }
    return arr
  }

  render() {
    return (
      <div className="App">
        <div id='grid'>
          {this.getHexes().map((value) => {
            return value.div
          })}
        </div>
      </div>
    );
  }
}

export default App;

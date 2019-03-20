import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0, 
      height: 0,
      hexGrid: new Array(15),
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    for(let i = 0; i < this.state.hexGrid.length; i++){
      this.state.hexGrid[i] = new Array(this.state.hexGrid.length)
      for(let j = 0; j < this.state.hexGrid[i].length; j++){
        let w = this.generateWater(2)
        this.state.hexGrid[i][j] = {
          water: w,
          cropLevel: this.generateOther(w),
          mineLevel: this.generateOther(w),
          div: this.setHexDiv(),
        }
        console.log(this.state.hexGrid[i][j])
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
    if(Math.floor(Math.random * chance) === 0){
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

  setHexDiv(){
    return <svg height={this.getHexHeight(this.getHexWidth())} width={this.getHexWidth()}>
            <polygon points= {this.getHexPoints()}
            style={{ fill: "lime", stroke: "purple", strokeWidth: "5" }} />
          </svg>
  }

  getHexWidth(){
    if(document.getElementById("grid") != null){
      return document.getElementById("grid").offsetWidth / 15
    }
    return this.state.width / 15
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
        this.state.hexGrid[i][j].div = this.setHexDiv()
      }
    }
    for(let i = 0; i < this.state.hexGrid.length; i++){
      arr = arr.concat(this.state.hexGrid[i])
    }
    console.log(arr)
    return arr
  }

  render() {
    return (
      <div className="App">
        <div id='grid'>
          <div>{this.getHexes().map((value) => {
            return value.div
          })}</div>
        </div>
      </div>
    );
  }
}

export default App;

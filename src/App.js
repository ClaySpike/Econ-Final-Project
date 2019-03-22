import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0, 
      height: 0,
      hexGrid: new Array(10),
      nations: new Array(1),
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    for(let i = 0; i < this.state.hexGrid.length; i++){
      this.state.hexGrid[i] = new Array(this.state.hexGrid.length)
      for(let j = 0; j < this.state.hexGrid[i].length; j++){
        let w = this.generateWater(6)
        let c = this.generateOther(w)
        let m = this.generateOther(w)
        let cb = -1
        
        this.state.hexGrid[i][j] = {
          x: i,
          y: j,
          water: w,
          cropLevel: c,
          mineLevel: m,
          claimedBy: cb,
        }
      }
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.findNationsStart()
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  
  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  findNationsStart(){
    for(let i = 0; i < this.state.nations.length; i++){
      let x = Math.floor(Math.random() * this.state.hexGrid.length)
      let y = Math.floor(Math.random() * this.state.hexGrid[x].length)
      if(this.state.hexGrid[x][y].water){
        this.findNationsStart()
      }
      else{
        this.setState((state) => {
          state.hexGrid[x][y].claimedBy = i
          state.nations[i] = {
            claims: [[x, y]],
          }
        })
      }
    }
  }

  generateWater(chance){
    return Math.floor(Math.random() * chance) === 0
  }

  generateOther(water){
    if(!water){
      return Math.random() * 10
    }
    return 0
  }

  handleClick(e) {
    e.preventDefault();
    console.log("clicky click click click")
    let coords = e.target.parentElement.getAttribute("data-position")
    console.log(coords)
    if(coords !== null){
      this.setState((state) => {
        state.hexGrid[coords[0]][coords[2]].claimedBy = 0
      })
      this.forceUpdate()
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
      arr = arr.concat(this.state.hexGrid[i])
    }
    return arr
  }

  render() {
    return (
      <div className="App">
        <div id='grid'>
          {this.getHexes().map((value) => {
            let strokeColor = ""
            let backColor= ""
            if(value.claimedBy === -1){
              strokeColor = "hexStrokeBackground"
            }
            else if(value.claimedBy === 0){
              strokeColor = "hexStrokeWhite"
            }

            if(value.water){
              backColor = "hexColorBlue"
            }
            else if(value.cropLevel > value.mineLevel){
              backColor = "hexColorGreen"
            }
            else if(value.cropLevel < value.mineLevel){
              backColor = "hexColorBrown"
            }

            return  <svg key={value.x + " " + value.y} data-position={[value.x,value.y]} onClick={(e) => {this.handleClick(e)}} className="hex" width="9.5%" viewBox={(-this.getHexWidth()*((13/12)-1)/2) + " " + (-this.getHexWidth()*((13/12)-1)/2) + " " + + (this.getHexWidth()*13/12) + " " + (this.getHexHeight()*13/12)}>
                      <polygon points= {this.getHexPoints()} className={"hexStyle " + backColor + " " + strokeColor}/>
                    </svg>
          })}
        </div>
      </div>
    );
  }
}

export default App;

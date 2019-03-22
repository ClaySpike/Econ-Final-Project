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
          water: w,
          cropLevel: c,
          mineLevel: m,
          claimedBy: cb,
          div: this.setHexDiv(
            i,
            j,
            w, 
            c, 
            m, 
            cb,
          ),
        }
      }
    }

    this.findNationsStart()
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.updateDiv()
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
        this.state.hexGrid[x][y].claimedBy = i
        this.state.nations[i] = {
          claims: [[x, y]],
        }
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

  setHexDiv(x, y, water, cropLevel, mineLevel, claimed){
    let strokeColor = ""
    if(claimed === -1){
      strokeColor = "hexStrokeBackground"
    }
    else if(claimed === 0){
      strokeColor = "hexStrokeWhite"
    }

    if(water){
      return  <svg key={x + " " + y} data-position={[x,y]} onClick={this.handleClick} className="hex" width="9.5%" viewBox={(-this.getHexWidth()*((13/12)-1)/2) + " " + (-this.getHexWidth()*((13/12)-1)/2) + " " + + (this.getHexWidth()*13/12) + " " + (this.getHexHeight()*13/12)}>
                <polygon points= {this.getHexPoints()} className={"hexStyle hexColorBlue " + strokeColor}/>
              </svg>
    }
    else if(cropLevel > mineLevel){
      return  <svg key={x + " " + y} data-position={[x,y]} onClick={this.handleClick} className="hex" width="9.5%" viewBox={(-this.getHexWidth()*((13/12)-1)/2) + " " + (-this.getHexWidth()*((13/12)-1)/2) + " " + + (this.getHexWidth()*13/12) + " " + (this.getHexHeight()*13/12)}>
                <polygon points= {this.getHexPoints()} className={"hexStyle hexColorGreen " + strokeColor}/>
              </svg>
    }
    else if(cropLevel < mineLevel){
      return  <svg key={x + " " + y} data-position={[x,y]} onClick={this.handleClick} className="hex" width="9.5%" viewBox={(-this.getHexWidth()*((13/12)-1)/2) + " " + (-this.getHexWidth()*((13/12)-1)/2) + " " + + (this.getHexWidth()*13/12) + " " + (this.getHexHeight()*13/12)}>
                <polygon points= {this.getHexPoints()} className={"hexStyle hexColorBrown " + strokeColor}/>
              </svg>
    }
    else{
      return  <svg key={x + " " + y} data-position={[x,y]} onClick={this.handleClick} className="hex" width="9.5%" viewBox={(-this.getHexWidth()*((13/12)-1)/2) + " " + (-this.getHexWidth()*((13/12)-1)/2) + " " + + (this.getHexWidth()*13/12) + " " + (this.getHexHeight()*13/12)}>
                <polygon points= {this.getHexPoints()} className={"hexStyle " + strokeColor}/>
              </svg>
    }
  }

  handleClick(e) {
    e.preventDefault();
    console.log(e.target.parentElement.getAttribute("data-position"))
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

  updateDiv(){
    for(let i = 0; i < this.state.hexGrid.length; i++){
      for(let j = 0; j < this.state.hexGrid[i].length; j++){
        this.setState((state)=>{
          state.hexGrid[i][j].div = this.setHexDiv(
            i,
            j,
            state.hexGrid[i][j].water,
            state.hexGrid[i][j].cropLevel,
            state.hexGrid[i][j].mineLevel,
            state.hexGrid[i][j].claimedBy,
          )
        })
      }
    }
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
            return value.div
          })}
        </div>
      </div>
    );
  }
}

export default App;

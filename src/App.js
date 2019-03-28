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
      currentCoords: [0,0],
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
    e.preventDefault()
    let coords = e.target.parentElement.getAttribute("data-position")
    let works = false
    if(coords !== null){
      for(let j = 0; j < this.state.nations[0].claims.length; j++){
        let x = this.state.nations[0].claims[j][0] - coords[0]
        let y = this.state.nations[0].claims[j][1] - coords[2]
        if(x === 0 && (y === -1 || y === 1)){//same row left or right
          works = true;
        }
        else if(coords[0] % 2 === 0){//even row
          if((x === 1 || x === -1) && (y === -1 || y === 0)){
            works = true;
          }
        }
        else{//odd row
          if((x === 1 || x === -1) && (y === 0 || y === 1)){
            works = true;
          }
        }
      }
      if(works){
        this.setState((state) => {
          state.hexGrid[coords[0]][coords[2]].claimedBy = 0
          state.nations[0].claims[state.nations[0].claims.length] = [coords[0], coords[2]]
        })
        this.forceUpdate()
      }
    }
  }

  handleMouseOver(e){
    e.preventDefault()
    let coords =  e.target.parentElement.getAttribute("data-position")
    if(coords !== null){
      console.log(coords)
      this.setState((state) => {
        state.currentCoords = [coords[0], coords[2]]
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

  getHexDiv(value, width, summary){
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

    if(!summary){
      return  <svg 
                key={value.x + " " + value.y} 
                data-position={[value.x,value.y]} 
                onClick={(e) => {this.handleClick(e)}} 
                onMouseOver={(e) => {this.handleMouseOver(e)}}
                className="hex" 
                width={width}
                viewBox={(-this.getHexWidth()*((13/12)-1)/2) + " " + (-this.getHexWidth()*((13/12)-1)/2) + " " + + (this.getHexWidth()*13/12) + " " + (this.getHexHeight()*13/12)}>
                <polygon points= {this.getHexPoints()} className={"hexStyle " + backColor + " " + strokeColor}/>
              </svg>
    }
    else{
      return  <svg 
                key={value.x + " " + value.y} 
                data-position={[value.x,value.y]} 
                className="hexSP" 
                width={width + "vw"}
                height={2 * width * Math.tan(Math.PI/6) + "vw"}
                viewBox={(-this.getHexWidth()*((13/12)-1)/2) + " " + (-this.getHexWidth()*((13/12)-1)/2) + " " + + (this.getHexWidth()*13/12) + " " + (this.getHexHeight()*13/12)}>
                <polygon points= {this.getHexPoints()} className={"hexStyle " + backColor + " " + strokeColor}/>
              </svg>
    }
  }

  displayPos(){
    let x = Number(this.state.currentCoords[0]) + 1;
    let y = Number(this.state.currentCoords[1]) + 1;
    return x + ", " + y 
  }

  render() {
    return (
      <div className="App">
        <div id='grid'>
          {this.getHexes().map((value) => {
            return this.getHexDiv(value, "9.5%", false)
          })}
        </div>
        <div>
          <div className="hexPosContainer">
            {this.getHexDiv(this.state.hexGrid[this.state.currentCoords[0]][this.state.currentCoords[1]], "10", true)}
            <h1 className="heading">
              {this.displayPos()}
            </h1>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

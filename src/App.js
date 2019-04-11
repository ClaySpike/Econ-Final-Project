import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      hexGrid: new Array(10),
      nations: new Array(4),
      currentCoords: [0, 0],
      summaryOpen: false,
      currentNation: 0
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    for (let i = 0; i < this.state.hexGrid.length; i++) {
      this.state.hexGrid[i] = new Array(this.state.hexGrid.length);
      for (let j = 0; j < this.state.hexGrid[i].length; j++) {
        let w = Math.floor(Math.random() * 6) === 0;
        let c = 0;
        let m = 0;
        if (!w) {
          c = Math.random() * 100;
          m = 100 - c;
        }
        let cb = -1;

        this.state.hexGrid[i][j] = {
          x: i,
          y: j,
          water: w,
          cropLevel: c,
          cropProduction: 0,
          cropProductionSelected: 0,
          mineLevel: m,
          mineProduction: 0,
          mineProductionSelected: 0,
          claimedBy: cb,
          maxPop: 100,
          curPop: 0
        };
      }
    }

    for (let i = 0; i < this.state.nations.length; i++) {
      this.state.nations[i] = {
        claims: [],
        population: 25,
        storedCrop: 25,
        storedMine: 25,
        takenTurn: false
      };
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    let unusable = [];
    for (let i = 0; i < this.state.nations.length; i++) {
      unusable = this.findNationsStart(i, unusable);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  findNationsStart(nation, unusable) {
    let x = Math.floor(Math.random() * this.state.hexGrid.length);
    let y = Math.floor(Math.random() * this.state.hexGrid[x].length);

    let bad = false;
    for (let i = 0; i < unusable.length; i++) {
      if (unusable[i][0] === x && unusable[i][1] === y) {
        bad = true;
      }
    }
    unusable.push([x, y]);
    if (this.state.hexGrid[x][y].water || bad) {
      this.findNationsStart(nation, unusable);
    } else {
      this.setState(state => {
        state.hexGrid[x][y].claimedBy = nation;
        state.hexGrid[x][y].population = 50;
        state.nations[nation].claims = [[x, y]];
      });
    }
    return unusable;
  }

  handleClick(e) {
    e.preventDefault();
    let coords = e.target.parentElement.getAttribute("data-position");
    if (coords != null) {
      this.setState({
        summaryOpen: true
      });
      this.setSummary(coords);
    }
  }

  cancelClick(e) {
    e.preventDefault();
    this.setState({
      summaryOpen: false
    });
  }

  handleClaim(e) {
    e.preventDefault();
    if (
      this.checkClaim(this.state.currentCoords, this.state.currentNation) &&
      this.state.nations[this.state.currentNation].storedMine >= 50
    ) {
      this.setState(state => {
        state.hexGrid[state.currentCoords[0]][
          state.currentCoords[1]
        ].claimedBy = state.currentNation;
        state.nations[state.currentNation].claims[
          state.nations[state.currentNation].claims.length
        ] = state.currentCoords;
        state.nations[state.currentNation].storedMine -= 50;
        state.nations[state.currentNation].takenTurn = true;
      });
      this.forceUpdate();
      this.cancelClick(e);
    }
  }

  changeNation(e, nation) {
    e.preventDefault();
    this.setState({
      currentNation: nation
    });
  }

  checkClaim(coords, nation) {
    let works = false;
    if (
      coords != null &&
      this.state.nations[nation] != null &&
      this.state.hexGrid[coords[0]][coords[1]].claimedBy === -1 &&
      this.state.nations[nation].storedCrop >= 50
    ) {
      for (let j = 0; j < this.state.nations[nation].claims.length; j++) {
        if (
          !(
            this.state.nations[nation].claims[j][0] === coords[0] &&
            this.state.nations[nation].claims[j][1] === coords[1]
          )
        ) {
          let x = this.state.nations[nation].claims[j][0] - coords[0];
          let y = this.state.nations[nation].claims[j][1] - coords[1];
          if (x === 0 && (y === -1 || y === 1)) {
            //same row left or right
            works = true;
          } else if (coords[0] % 2 === 0) {
            //even row
            if ((x === 1 || x === -1) && (y === -1 || y === 0)) {
              works = true;
            }
          } else {
            //odd row
            if ((x === 1 || x === -1) && (y === 0 || y === 1)) {
              works = true;
            }
          }
        } else {
          console.log("beep");
          return false;
        }
      }
    }
    return works;
  }

  claimCSS() {
    if (this.state.currentCoords != null) {
      if (this.checkClaim(this.state.currentCoords, this.state.currentNation)) {
        return "button confirmColor confirmColorH unselectable";
      }
    }
    return "button confirmColor disabled unselectable";
  }

  cancelCSS() {
    if (this.state.summaryOpen) {
      return "button cancelColor cancelColorH unselectable";
    }
    return "button cancelColor disabled unselectable";
  }

  borderCSS(nation) {
    if (nation === 0) {
      return "borderWhite";
    } else if (nation === 1) {
      return "borderCyan";
    } else if (nation === 2) {
      return "borderFucia";
    } else if (nation === 3) {
      return "borderCrimson";
    }
  }

  tileHiddenCSS() {
    let claimed = false;
    if (this.state.summaryOpen) {
      for (
        let i = 0;
        i < this.state.nations[this.state.currentNation].claims.length;
        i++
      ) {
        if (
          Number(this.state.nations[this.state.currentNation].claims[i][0]) ===
            Number(this.state.currentCoords[0]) &&
          Number(this.state.nations[this.state.currentNation].claims[i][1]) ===
            Number(this.state.currentCoords[1])
        ) {
          claimed = true;
        }
      }
    }

    if (this.state.summaryOpen && claimed) {
      return "";
    }
    return " hidden";
  }

  hideNation() {
    if (this.state.nations.length === 1) {
      return " hidden";
    }
    return "";
  }

  setSummary(coords) {
    if (coords !== null) {
      this.setState(state => {
        state.currentCoords = [coords[0], coords[2]];
      });
      this.forceUpdate();
    }
  }

  handleMouseOver(e) {
    e.preventDefault();
    if (!this.state.summaryOpen) {
      this.setSummary(e.target.parentElement.getAttribute("data-position"));
    }
  }

  handleTurn(e) {
    e.preventDefault();
    let bad = true;
    for (let i = 0; i < this.state.nations.length; i++) {
      if (!this.state.nations[i].takenTurn) {
        console.log("REEET");
        bad = false;
      }
    }

    if (bad) {
      for (let i = 0; i < this.state.nations.length; i++) {
        let pop = this.state.nations[i].population;
        if (this.getTotalCrop(i) < this.state.nations[i].population) {
          pop = this.state.nations[i].population * Math.random;
        }
        this.setState(state => {
          state.nations[i].population = pop;
          state.nations[i].storedCrop += Math.round(this.getTotalCrop(i) - pop);
          state.nations[i].storedMine += Math.round(this.getTotalMine(i));
          state.nations[i].takenTurn = false;
        });
      }
      this.forceUpdate();
    }
  }

  handleSlider(e, type) {
    e.preventDefault();
    let valC = 0;
    let valM = 0;
    console.log(e.target.value);

    if (type === "crop") {
      valC = e.target.value;
      valM = this.state.hexGrid[this.state.currentCoords[0]][
        this.state.currentCoords[1]
      ].mineProductionSelected;
    } else {
      valC = this.state.hexGrid[this.state.currentCoords[0]][
        this.state.currentCoords[1]
      ].cropProductionSelected;
      valM = e.target.value;
    }

    let valCS = valC;
    let valMS = valM;
    if (valM > 0 && valC > 0) {
      valM = Math.floor(valM / 2);
      valC = Math.floor(valC / 2);
    }

    this.setState(state => {
      state.hexGrid[state.currentCoords[0]][
        state.currentCoords[1]
      ].mineProduction = valM;
      state.hexGrid[state.currentCoords[0]][
        state.currentCoords[1]
      ].mineProductionSelected = valMS;
      state.hexGrid[state.currentCoords[0]][
        state.currentCoords[1]
      ].cropProduction = valC;
      state.hexGrid[state.currentCoords[0]][
        state.currentCoords[1]
      ].cropProductionSelected = valCS;
    });

    this.forceUpdate();
  }

  getTotalCrop(nation) {
    let total = 0;
    for (let i = 0; i < this.state.nations[nation].claims.length; i++) {
      total += this.state.hexGrid[this.state.nations[nation].claims[i][0]][
        this.state.nations[nation].claims[i][1]
      ].cropLevel;
    }
    return total;
  }

  getTotalCropProduction(nation) {
    let total = 0;
    for (let i = 0; i < this.state.nations[nation].claims.length; i++) {
      total += this.state.hexGrid[this.state.nations[nation].claims[i][0]][
        this.state.nations[nation].claims[i][1]
      ].cropProduction;
    }
    return total;
  }

  getTotalMine(nation) {
    let total = 0;
    for (let i = 0; i < this.state.nations[nation].claims.length; i++) {
      total += this.state.hexGrid[this.state.nations[nation].claims[i][0]][
        this.state.nations[nation].claims[i][1]
      ].mineLevel;
    }
    return total;
  }

  getTotalMineProduction(nation) {
    let total = 0;
    for (let i = 0; i < this.state.nations[nation].claims.length; i++) {
      total += this.state.hexGrid[this.state.nations[nation].claims[i][0]][
        this.state.nations[nation].claims[i][1]
      ].mineProduction;
    }
    return total;
  }

  getHexWidth() {
    if (document.getElementById("grid") != null) {
      return document.getElementById("grid").clientWidth / 10;
    }
    return this.state.width / 10;
  }

  getHexHeight() {
    return this.getHexWidth() * 2 * Math.tan(Math.PI / 6);
  }

  getHexPoints() {
    let halfWidth = this.getHexWidth() / 2;
    let topHalf = (Math.tan(Math.PI / 6) * this.getHexWidth()) / 2;
    let bottomHalf = (3 * Math.tan(Math.PI / 6) * this.getHexWidth()) / 2;
    return (
      halfWidth +
      ", " +
      0 +
      " " +
      this.getHexWidth() +
      ", " +
      topHalf +
      " " +
      this.getHexWidth() +
      ", " +
      bottomHalf +
      " " +
      halfWidth +
      ", " +
      this.getHexHeight() +
      " " +
      0 +
      ", " +
      bottomHalf +
      " " +
      0 +
      ", " +
      topHalf
    );
  }

  getHexes() {
    let arr = [];
    for (let i = 0; i < this.state.hexGrid.length; i++) {
      arr = arr.concat(this.state.hexGrid[i]);
    }
    return arr;
  }

  getHexDiv(value, width, summary) {
    let strokeColor = "";
    let backColor = "";
    if (value.claimedBy === -1) {
      strokeColor = "hexStrokeBackground";
    } else if (value.claimedBy === 0) {
      strokeColor = "hexStrokeWhite";
    } else if (value.claimedBy === 1) {
      strokeColor = "hexStrokeCyan";
    } else if (value.claimedBy === 2) {
      strokeColor = "hexStrokeFuscia";
    } else if (value.claimedBy === 3) {
      strokeColor = "hexStrokeCrimson";
    }

    if (value.water) {
      backColor = "hexColorBlue";
    } else if (value.cropLevel > value.mineLevel) {
      backColor = "hexColorGreen";
    } else if (value.cropLevel < value.mineLevel) {
      backColor = "hexColorBrown";
    }

    if (!summary) {
      return (
        <svg
          key={value.x + " " + value.y}
          data-position={[value.x, value.y]}
          onClick={e => {
            this.handleClick(e);
          }}
          onMouseOver={e => {
            this.handleMouseOver(e);
          }}
          className="hex"
          width={width}
          viewBox={
            (-this.getHexWidth() * (13 / 12 - 1)) / 2 +
            " " +
            (-this.getHexWidth() * (13 / 12 - 1)) / 2 +
            " " +
            +((this.getHexWidth() * 13) / 12) +
            " " +
            (this.getHexHeight() * 13) / 12
          }
        >
          <polygon
            points={this.getHexPoints()}
            className={"hexStyle " + backColor + " " + strokeColor}
          />
        </svg>
      );
    } else {
      return (
        <svg
          key={value.x + " " + value.y}
          data-position={[value.x, value.y]}
          className="hexSP"
          width={width + "vw"}
          height={2 * width * Math.tan(Math.PI / 6) + "vw"}
          viewBox={
            (-this.getHexWidth() * (13 / 12 - 1)) / 2 +
            " " +
            (-this.getHexWidth() * (13 / 12 - 1)) / 2 +
            " " +
            +((this.getHexWidth() * 13) / 12) +
            " " +
            (this.getHexHeight() * 13) / 12
          }
        >
          <polygon
            points={this.getHexPoints()}
            className={"hexStyle " + backColor + " " + strokeColor}
          />
        </svg>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <div id="grid">
          {this.getHexes().map(value => {
            return this.getHexDiv(value, "9.5%", false);
          })}
        </div>
        <div className="sidePanel white">
          <div className="summary">
            <div className="hexSummaryContainer">
              <div>
                {this.getHexDiv(
                  this.state.hexGrid[this.state.currentCoords[0]][
                    this.state.currentCoords[1]
                  ],
                  "10",
                  true
                )}
              </div>
              <h1 className="unselectable">
                {Number(this.state.currentCoords[1]) +
                  1 +
                  ", " +
                  Number(Number(this.state.currentCoords[0]) + 1)}
              </h1>
            </div>
            <div className="dataPadding">
              <h1>
                {"Water: " +
                  this.state.hexGrid[this.state.currentCoords[0]][
                    this.state.currentCoords[1]
                  ].water}
              </h1>
              <h1>
                {"Crop Level: " +
                  Math.round(
                    this.state.hexGrid[this.state.currentCoords[0]][
                      this.state.currentCoords[1]
                    ].cropLevel
                  )}
              </h1>
              <h1>
                {"Mine Level: " +
                  Math.round(
                    this.state.hexGrid[this.state.currentCoords[0]][
                      this.state.currentCoords[1]
                    ].mineLevel
                  )}
              </h1>
              <h1>
                {"Current Owner: " +
                  Number(
                    this.state.hexGrid[this.state.currentCoords[0]][
                      this.state.currentCoords[1]
                    ].claimedBy + 1
                  )}
              </h1>
            </div>
          </div>
          <div
            className={
              "nationInfoContainer " +
              this.borderCSS(this.state.currentNation) +
              this.tileHiddenCSS()
            }
          >
            <h1>
              {"Crop Production: " +
                this.state.hexGrid[this.state.currentCoords[0]][
                  this.state.currentCoords[1]
                ].cropProduction}
            </h1>
            <input
              type="range"
              min="0"
              max={Math.round(
                this.state.hexGrid[this.state.currentCoords[0]][
                  this.state.currentCoords[1]
                ].cropLevel
              )}
              defaultValue={
                this.state.hexGrid[this.state.currentCoords[0]][
                  this.state.currentCoords[1]
                ].cropProduction
              }
              onChange={e => {
                this.handleSlider(e, "crop");
              }}
            />
            <h1>
              {"Mine Production: " +
                this.state.hexGrid[this.state.currentCoords[0]][
                  this.state.currentCoords[1]
                ].mineProduction}
            </h1>
            <input
              type="range"
              min="0"
              max={Math.round(
                this.state.hexGrid[this.state.currentCoords[0]][
                  this.state.currentCoords[1]
                ].mineLevel
              )}
              defaultValue={
                this.state.hexGrid[this.state.currentCoords[0]][
                  this.state.currentCoords[1]
                ].mineProduction
              }
              onChange={e => {
                this.handleSlider(e, "mine");
              }}
            />
          </div>
          <div className="buttonContainer">
            <div className={this.claimCSS()} onClick={e => this.handleClaim(e)}>
              <h1>Claim</h1>
            </div>
            <div
              className={this.cancelCSS()}
              onClick={e => this.cancelClick(e)}
            >
              <h1>Cancel</h1>
            </div>
          </div>
          <div className={"buttonContainer" + this.hideNation()}>
            {this.state.nations.map((value, index) => {
              return (
                <div
                  key={"Nation Button" + index}
                  className={
                    "button unselectable nationButton " + this.borderCSS(index)
                  }
                  onClick={e => {
                    this.changeNation(e, index);
                  }}
                >
                  <h1>{index + 1}</h1>
                </div>
              );
            })}
          </div>
          <div
            className={
              "nationInfoContainer " + this.borderCSS(this.state.currentNation)
            }
          >
            <h1>
              {"Population: " +
                Math.round(
                  this.state.nations[this.state.currentNation].population
                )}
            </h1>
            <h1>
              {"Crop Production: " +
                Math.round(
                  this.getTotalCropProduction(this.state.currentNation)
                ) +
                "/" +
                Math.round(this.getTotalCrop(this.state.currentNation))}
            </h1>
            <h1>
              {"Crop Stored: " +
                this.state.nations[this.state.currentNation].storedCrop}
            </h1>
            <h1>
              {"Mine Production: " +
                Math.round(
                  this.getTotalMineProduction(this.state.currentNation)
                ) +
                "/" +
                Math.round(this.getTotalMine(this.state.currentNation))}
            </h1>
            <h1>
              {"Mine Stored: " +
                this.state.nations[this.state.currentNation].storedMine}
            </h1>
          </div>
          <div className="buttonContainer">
            <div
              className="button confirmColor confirmColorH unselectable"
              onClick={e => this.handleTurn(e)}
            >
              <h1>Next Turn</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

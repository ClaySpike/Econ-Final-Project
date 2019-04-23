import React, { Component } from "react";
import "./settlers.svg"
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      hexGrid: new Array(10),
      nations: new Array(1),
      currentCoords: [0, 0],
      summaryOpen: false,
      currentNation: 0
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

    for (let i = 0; i < this.state.hexGrid.length; i++) {
      this.state.hexGrid[i] = new Array(this.state.hexGrid.length);
      for (let j = 0; j < this.state.hexGrid[i].length; j++) {
        let typeRand = Math.floor(Math.random() * 100);
        let typeNum = 0;
        let typeName = "";
        let foodNum = 0;
        let prodNum = 0;
        let goldNum = 0;

        if (typeRand >= 0 && typeRand < 40) {
          typeName = "plains";
          typeNum = 0;
          foodNum = 2;
          prodNum = 0;
        } else if (typeRand >= 40 && typeRand < 60) {
          typeName = "hills";
          typeNum = 1;
          foodNum = 0;
          prodNum = 2;
        } else if (typeRand >= 60 && typeRand < 70) {
          typeName = "forest";
          typeNum = 2;
          foodNum = 1;
          prodNum = 1;
        } else if (typeRand >= 70 && typeRand < 85) {
          typeName = "lake";
          typeNum = 3;
          foodNum = 2;
          prodNum = 0;
        } else if (typeRand >= 85 && typeRand < 90) {
          typeName = "desert";
          typeNum = 4;
          foodNum = 0;
          prodNum = 1;
        } else if (typeRand >= 90 && typeRand < 100) {
          typeName = "wetlands";
          typeNum = 5;
          foodNum = 1;
          prodNum = 1;
        } else {
          typeName = "plains";
          typeNum = 0;
          foodNum = 2;
          prodNum = 0;
        }

        const resourcesArr = [
          ["none", 0, 0, 0, 0, 0, 0],
          ["wheat", 20, 5, 0, 0, 0, 0],
          ["cow", 10, 2.5, 7.5, 0, 0, 0],
          ["fish", 0, 0, 0, 25, 0, 5],
          ["stone", 10, 15, 2.5, 0, 1, 0],
          ["coal", 1, 15, 2, 0, 5, 0],
          ["iron", 1, 10, 2, 0, 3.5, 0],
          ["horse", 10, 2.5, 10, 0, 0, 0],
          ["gold", 0.5, 5, 2, 0, 3.5, 5],
          ["cotton", 2.5, 1.5, 0, 0, 0, 0],
          ["sugar", 2.5, 1.5, 0, 0, 0, 0],
          ["gems", 0.25, 1, 1, 0, 5, 0.25],
          ["pearls", 0, 0, 0, 10, 0, 0],
          ["wine", 1.5, 1.5, 0, 0, 0, 0],
          ["marble", 1, 5, 0, 0, 0, 0]
        ];

        const resourcesData = [
          {
            name: "none",
            type: "none",
            production: 0,
            food: 0
          },
          {
            name: "wheat",
            type: "basic",
            production: 0,
            food: 1
          },
          {
            name: "cow",
            type: "basic",
            production: 0,
            food: 1
          },
          {
            name: "fish",
            type: "basic",
            production: 0,
            food: 1
          },
          {
            name: "stone",
            type: "basic",
            production: 1,
            food: 0
          },
          {
            name: "coal",
            type: "strategic",
            production: 1,
            food: 0
          },
          {
            name: "iron",
            type: "strategic",
            production: 1,
            food: 0
          },
          {
            name: "horse",
            type: "strategic",
            production: 1,
            food: 0
          },
          {
            name: "gold",
            type: "luxary",
            gold: 2
          },
          {
            name: "cotton",
            type: "luxary",
            gold: 2
          },
          {
            name: "sugar",
            type: "luxary",
            gold: 2
          },
          {
            name: "gems",
            type: "luxary",
            gold: 3
          },
          {
            name: "pearls",
            type: "luxary",
            gold: 2
          },
          {
            name: "wine",
            type: "luxary",
            gold: 2
          },
          {
            name: "marble",
            type: "luxary",
            gold: 2
          }
        ];

        let res = [];

        for (let q = 0; q < resourcesArr.length; q++) {
          let chance = Math.random() * 100;
          if (resourcesArr[q][1 + typeNum] >= chance) {
            res.push(q);
          }
        }

        let resour = 0;

        if (res.length > 0) {
          resour = res[Math.floor(Math.random() * res.length)];
          if (
            resourcesData[resour].type === "basic" ||
            resourcesData[resour].type === "strategic"
          ) {
            foodNum += resourcesData[resour].food;
            prodNum += resourcesData[resour].production;
          } else {
            goldNum += resourcesData[resour].gold;
          }
        }

        this.state.hexGrid[i][j] = {
          x: i,
          y: j,
          claimedBy: -1,
          type: typeName,
          resource: resourcesData[resour],
          food: foodNum,
          production: prodNum,
          gold: goldNum
        };
      }
    }

    for (let i = 0; i < this.state.nations.length; i++) {
      this.state.nations[i] = {
        claims: []
      };
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
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

  /*-----------------START HEXAGON CODE-----------------*/

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

    switch (value.type) {
      case "plains":
        backColor = "hexColorPlains";
        break;
      case "hills":
        backColor = "hexColorHills";
        break;
      case "forest":
        backColor = "hexColorForest";
        break;
      case "lake":
        backColor = "hexColorLake";
        break;
      case "desert":
        backColor = "hexColorDesert";
        break;
      case "wetlands":
        backColor = "hexColorWetlands";
        break;
      default:
        backColor = "";
        break;
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

  /*------------------END HEXAGON CODE------------------*/
  /*--------------------START HANDLE--------------------*/

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

  changeNation(e, nation) {
    e.preventDefault();
    this.setState({
      currentNation: nation
    });
  }

  handleMouseOver(e) {
    e.preventDefault();
    if (!this.state.summaryOpen) {
      this.setSummary(e.target.parentElement.getAttribute("data-position"));
    }
  }

  handleClaim(e) {
    e.preventDefault();
    if (
      this.checkClaim(this.state.currentCoords, this.state.currentNation) &&
      this.state.nations[this.state.currentNation].storedMine >= 100
    ) {
      this.setState(state => {
        state.hexGrid[state.currentCoords[0]][
          state.currentCoords[1]
        ].claimedBy = Number(state.currentNation);
        state.nations[state.currentNation].claims[
          state.nations[state.currentNation].claims.length
        ] = state.currentCoords;
        state.nations[state.currentNation].storedMine -= 100;
      });
      this.forceUpdate();
      this.cancelClick(e);
    }
  }

  handleTurn(e) {
    e.preventDefault();
    document.getElementById("cropProductionInput").value = 0;
    document.getElementById("mineProductionInput").value = 0;
    this.setState(state => {
      if (
        state.nations[state.currentNation].storedCrop -
          state.nations[state.currentNation].population +
          this.getTotalCropProduction(state.currentNation) >
        0
      ) {
        state.nations[state.currentNation].storedCrop +=
          -state.nations[state.currentNation].population +
          this.getTotalCropProduction(state.currentNation);
      } else {
        state.nations[state.currentNation].storedCrop = 0;
      }

      if (
        state.nations[state.currentNation].storedMine +
          this.getTotalMineProduction(state.currentNation) >
        0
      ) {
        state.nations[
          state.currentNation
        ].storedMine += this.getTotalMineProduction(state.currentNation);
      } else {
        state.nations[state.currentNation].storedMine = 0;
      }

      state.nations[state.currentNation].takenTurn = false;
      if (state.currentNation < state.nations.length - 1) {
        state.currentNation += 1;
      } else {
        state.currentNation = 0;
      }
    });
    this.forceUpdate();
  }

  productionChange(e) {
    e.preventDefault();
    if (Number(e.target.value) > Number(e.target.max)) {
      e.target.value = e.target.max;
    } else if (Number(e.target.value) < Number(e.target.min)) {
      e.target.value = e.target.min;
    }
    this.forceUpdate();
  }

  productionAccept(e, type) {
    e.preventDefault();
    if (e.keyCode === 13 || e.keyCode === undefined) {
      if (type === "crop") {
        let jim = Number(document.getElementById("cropProductionInput").value);
        this.setState(state => {
          state.hexGrid[state.currentCoords[0]][
            state.currentCoords[1]
          ].cropProduction += jim;
          state.nations[state.currentNation].storedCrop -= Math.ceil(
            Math.abs(jim)
          );
        });
        document.getElementById("cropProductionInput").value = 0;
      } else {
        let jim = Number(document.getElementById("mineProductionInput").value);
        this.setState(state => {
          state.hexGrid[state.currentCoords[0]][
            state.currentCoords[1]
          ].mineProduction += jim;
          state.nations[state.currentNation].storedCrop -= Math.ceil(
            Math.abs(jim)
          );
        });
        document.getElementById("mineProductionInput").value = 0;
      }
      this.forceUpdate();
    }
  }

  /*---------------------END HANDLE---------------------*/
  /*----------------------START CSS---------------------*/

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

  /*-----------------------END CSS----------------------*/
  /*---------------------START CLAIM--------------------*/

  checkClaim(coords, nation) {
    let works = false;
    if (
      coords != null &&
      this.state.nations[nation] != null &&
      this.state.hexGrid[coords[0]][coords[1]].claimedBy === -1 &&
      this.state.nations[nation].storedMine >= 100
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

  /*---------------------END CLAIM--------------------*/
  /*--------------------START DATA--------------------*/

  setSummary(coords) {
    if (coords !== null) {
      this.setState(state => {
        state.currentCoords = [Number(coords[0]), Number(coords[2])];
      });
      this.forceUpdate();
    }
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

  getTotalMine(nation) {
    let total = 0;
    for (let i = 0; i < this.state.nations[nation].claims.length; i++) {
      total += this.state.hexGrid[this.state.nations[nation].claims[i][0]][
        this.state.nations[nation].claims[i][1]
      ].mineLevel;
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

  getTotalMineProduction(nation) {
    let total = 0;
    for (let i = 0; i < this.state.nations[nation].claims.length; i++) {
      total += this.state.hexGrid[this.state.nations[nation].claims[i][0]][
        this.state.nations[nation].claims[i][1]
      ].mineProduction;
    }
    return total;
  }

  getProductionCost() {
    if (
      document.getElementById("cropProductionInput") !== null &&
      document.getElementById("mineProductionInput") !== null
    ) {
      if (
        Number(document.getElementById("cropProductionInput").value) !== 0 ||
        Number(document.getElementById("mineProductionInput").value) !== 0
      ) {
        return -Math.ceil(
          Math.abs(
            Number(document.getElementById("cropProductionInput").value)
          ) +
            Math.abs(
              Number(document.getElementById("mineProductionInput").value)
            )
        );
      }
    }
    return "";
  }

  getMaximumInput(type) {
    if (type === "crop") {
      if (document.getElementById("mineProductionInput") !== null) {
        if (
          Math.round(
            this.state.hexGrid[this.state.currentCoords[0]][
              this.state.currentCoords[1]
            ].cropLevel
          ) -
            this.state.hexGrid[this.state.currentCoords[0]][
              this.state.currentCoords[1]
            ].cropProduction +
            Math.abs(
              Number(document.getElementById("mineProductionInput").value)
            ) >
          this.state.nations[this.state.currentNation].storedCrop
        ) {
          return (
            this.state.nations[this.state.currentNation].storedCrop -
            Math.abs(
              Number(document.getElementById("mineProductionInput").value)
            )
          );
        }
      }
      return (
        Math.round(
          this.state.hexGrid[this.state.currentCoords[0]][
            this.state.currentCoords[1]
          ].cropLevel
        ) -
        this.state.hexGrid[this.state.currentCoords[0]][
          this.state.currentCoords[1]
        ].cropProduction
      );
    } else {
      if (document.getElementById("cropProductionInput") !== null) {
        if (
          Math.round(
            this.state.hexGrid[this.state.currentCoords[0]][
              this.state.currentCoords[1]
            ].mineLevel
          ) -
            this.state.hexGrid[this.state.currentCoords[0]][
              this.state.currentCoords[1]
            ].mineProduction +
            Math.abs(
              Number(document.getElementById("cropProductionInput").value)
            ) >
          this.state.nations[this.state.currentNation].storedCrop
        ) {
          return (
            this.state.nations[this.state.currentNation].storedCrop -
            Math.abs(
              Number(document.getElementById("cropProductionInput").value)
            )
          );
        }
      }
      return (
        Math.round(
          this.state.hexGrid[this.state.currentCoords[0]][
            this.state.currentCoords[1]
          ].mineLevel
        ) -
        this.state.hexGrid[this.state.currentCoords[0]][
          this.state.currentCoords[1]
        ].mineProduction
      );
    }
  }

  /*---------------------END DATA-------------------*/

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
                {"Type: " +
                  this.state.hexGrid[this.state.currentCoords[0]][
                    this.state.currentCoords[1]
                  ].type}
              </h1>
              <h1>
                {"Food: " +
                  Math.round(
                    this.state.hexGrid[this.state.currentCoords[0]][
                      this.state.currentCoords[1]
                    ].food
                  )}
              </h1>
              <h1>
                {"Production: " +
                  Math.round(
                    this.state.hexGrid[this.state.currentCoords[0]][
                      this.state.currentCoords[1]
                    ].production
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
          <h1>
            {"Resource: " +
              this.state.hexGrid[this.state.currentCoords[0]][
                this.state.currentCoords[1]
              ].resource.name}
          </h1>
          <div
            className={
              "nationInfoContainer " +
              this.borderCSS(this.state.currentNation) +
              this.tileHiddenCSS()
            }
          >
            <h1>
              {"Crop Production: " +
                Math.round(
                  this.state.hexGrid[this.state.currentCoords[0]][
                    this.state.currentCoords[1]
                  ].cropProduction
                ) +
                "/" +
                Math.round(
                  this.state.hexGrid[this.state.currentCoords[0]][
                    this.state.currentCoords[1]
                  ].cropLevel
                )}
            </h1>
            <div className="productionContainer">
              <h1>Change by:</h1>
              <input
                id="cropProductionInput"
                onKeyUp={e => {
                  this.productionAccept(e, "crop");
                }}
                onChange={e => {
                  this.productionChange(e, "crop");
                }}
                className="inputNumber"
                defaultValue="0"
                type="number"
                min={
                  -(this.state.hexGrid[this.state.currentCoords[0]][
                    this.state.currentCoords[1]
                  ].cropProduction >
                  this.state.nations[this.state.currentNation].storedCrop * 2
                    ? this.state.nations[this.state.currentNation].storedCrop *
                      2
                    : this.state.hexGrid[this.state.currentCoords[0]][
                        this.state.currentCoords[1]
                      ].cropProduction)
                }
                max={this.getMaximumInput("crop")}
              />
              <div
                className="button acceptButton unselectable"
                onClick={e => {
                  this.productionAccept(e, "crop");
                }}
              >
                <h1>Apply</h1>
              </div>
            </div>
            <h1>
              {"Mine Production: " +
                Math.round(
                  this.state.hexGrid[this.state.currentCoords[0]][
                    this.state.currentCoords[1]
                  ].mineProduction
                ) +
                "/" +
                Math.round(
                  this.state.hexGrid[this.state.currentCoords[0]][
                    this.state.currentCoords[1]
                  ].mineLevel
                )}
            </h1>
            <div className="productionContainer">
              <h1>Change by:</h1>
              <input
                id="mineProductionInput"
                onKeyUp={e => {
                  this.productionAccept(e, "mine");
                }}
                onChange={e => {
                  this.productionChange(e, "mine");
                }}
                className="inputNumber"
                defaultValue="0"
                type="number"
                min={
                  -(this.state.hexGrid[this.state.currentCoords[0]][
                    this.state.currentCoords[1]
                  ].mineProduction >
                  this.state.nations[this.state.currentNation].storedCrop * 2
                    ? this.state.nations[this.state.currentNation].storedCrop *
                      2
                    : this.state.hexGrid[this.state.currentCoords[0]][
                        this.state.currentCoords[1]
                      ].mineProduction)
                }
                max={this.getMaximumInput("mine")}
              />
              <div
                className="button acceptButton unselectable"
                onClick={e => {
                  this.productionAccept(e, "mine");
                }}
              >
                <h1>Apply</h1>
              </div>
            </div>
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
          {/*<div className={"buttonContainer" + this.hideNation()}>
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
          </div>*/}
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
                this.state.nations[this.state.currentNation].storedCrop +
                " " +
                this.getProductionCost()}
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

import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      height: 0,
      hexGrid: new Array(16),
      nations: new Array(4),
      currentCoords: [0, 0],
      currentNation: 0,
      selected: undefined,
      claimedBy: -1
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
        let moveCost = 0;

        if (typeRand >= 0 && typeRand < 40) {
          typeName = "plains";
          typeNum = 0;
          foodNum = 2;
          prodNum = 0;
          moveCost = 1;
        } else if (typeRand >= 40 && typeRand < 60) {
          typeName = "hills";
          typeNum = 1;
          foodNum = 0;
          prodNum = 2;
          moveCost = 2;
        } else if (typeRand >= 60 && typeRand < 70) {
          typeName = "forest";
          typeNum = 2;
          foodNum = 1;
          prodNum = 1;
          moveCost = 2;
        } else if (typeRand >= 70 && typeRand < 85) {
          typeName = "lake";
          typeNum = 3;
          foodNum = 2;
          prodNum = 0;
          moveCost = 1;
        } else if (typeRand >= 85 && typeRand < 90) {
          typeName = "desert";
          typeNum = 4;
          foodNum = 0;
          prodNum = 1;
          moveCost = 1;
        } else if (typeRand >= 90 && typeRand < 100) {
          typeName = "wetlands";
          typeNum = 5;
          foodNum = 1;
          prodNum = 1;
          moveCost = 2;
        } else {
          typeName = "plains";
          typeNum = 0;
          foodNum = 2;
          prodNum = 0;
          moveCost = 1;
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
          gold: goldNum,
          movementCost: moveCost,
          ableMovement: undefined,
          plannedMovement: false,
          piece: undefined
        };
      }
    }

    for (let i = 0; i < this.state.nations.length; i++) {
      let colors = ["blue", "yellow", "fuchsia", "red"];

      let randomString = "";
      for (let j = 0; j < 10; j++) {
        randomString += String.fromCharCode(
          Math.floor(Math.random() * 25 + 97)
        );
      }

      this.state.nations[i] = {
        name: randomString,
        color: i < colors.length ? colors[i] : "black",
        cities: [],
        pieces: []
      };
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    let unusable = [[], []];
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
    let xNum = Math.floor(Math.random() * this.state.hexGrid.length);
    let yNum = Math.floor(Math.random() * this.state.hexGrid[xNum].length);

    let bad = false;
    for (let i = 0; i < unusable[0].length; i++) {
      if (unusable[0][i][0] === xNum && unusable[0][i][1] === yNum) {
        bad = true;
      }
    }

    for (let i = 0; i < unusable[1].length; i++) {
      if (
        Math.abs(unusable[1][i][0] - xNum) <= 3 &&
        Math.abs(unusable[1][i][1] - yNum) <= 3
      ) {
        bad = true;
      }
    }

    unusable[0].push([xNum, yNum]);
    if (this.state.hexGrid[xNum][yNum].type === "lake" || bad) {
      this.findNationsStart(nation, unusable);
    } else {
      this.setState(state => {
        state.hexGrid[xNum][yNum].piece = {
          ownedBy: nation,
          type: "settler",
          piece: 0
        };
        state.nations[nation].pieces = [
          {
            type: "settler",
            movement: 2,
            movementLeft: 2,
            x: xNum,
            y: yNum,
            targetHex: undefined
          }
        ];
      });
      unusable[1].push([xNum, yNum]);
    }
    return unusable;
  }

  /*-----------------START HEXAGON CODE-----------------*/

  getHexes() {
    let arr = [];
    for (let i = 0; i < this.state.hexGrid.length; i++) {
      for (let j = 0; j < this.state.hexGrid.length; j++) {
        arr.push(this.state.hexGrid[i][j]);
      }
    }
    return arr;
  }

  getHexDistance(hex1, hex2) {
    let dx = hex1[1] - hex2[1];
    let dy = hex1[0] - hex2[0];
    let penalty =
      (hex1[0] % 2 === 0 && hex2[0] % 2 === 1 && hex1[1] < hex2[1]) ||
      (hex2[0] % 2 === 0 && hex1[0] % 2 === 1 && hex2[1] < hex1[1])
        ? 1
        : 0;
    return Math.max(
      Math.abs(dy),
      Math.abs(dx) + Math.floor(Math.abs(dy) / 2) + penalty
    );
  }

  clearPath() {
    for (let i = 0; i < this.state.hexGrid.length; i++) {
      for (let j = 0; j < this.state.hexGrid[i].length; j++) {
        this.setState(state => {
          state.hexGrid[i][j].ableMovement = undefined;
        });
      }
    }
    this.forceUpdate();
  }

  clearPathPlanned() {
    for (let i = 0; i < this.state.hexGrid.length; i++) {
      for (let j = 0; j < this.state.hexGrid[i].length; j++) {
        this.setState(state => {
          state.hexGrid[i][j].plannedMovement = false;
        });
      }
    }
    this.forceUpdate();
  }

  pathfind(startHex, endHex) {
    if (
      this.state.hexGrid[endHex[0]][endHex[1]].type !== "lake" &&
      this.state.hexGrid[endHex[0]][endHex[1]].piece === undefined
    ) {
      let frontier = [startHex];
      let cameFrom = new Array(this.state.hexGrid.length);
      let costFrom = new Array(this.state.hexGrid.length);
      for (let i = 0; i < cameFrom.length; i++) {
        cameFrom[i] = new Array(this.state.hexGrid[i].length);
        costFrom[i] = new Array(this.state.hexGrid[i].length);
        for (let j = 0; j < cameFrom[i].length; j++) {
          cameFrom[i][j] = undefined;
          costFrom[i][j] = undefined;
        }
      }
      cameFrom[startHex[0]][startHex[1]] = startHex;
      costFrom[startHex[0]][startHex[1]] = 0;
      let contingency = 0;

      //Creating the path
      while (
        frontier.length !== 0 &&
        contingency < Math.pow(cameFrom.length, 2)
      ) {
        let currentIndex = 0;
        for (let i = 1; i < frontier.length; i++) {
          if (
            costFrom[frontier[i][0]][frontier[i][1]] +
              this.getHexDistance(endHex, frontier[i]) <
            costFrom[frontier[currentIndex][0]][frontier[currentIndex][1]] +
              this.getHexDistance(endHex, frontier[currentIndex])
          ) {
            currentIndex = i;
          }
        }
        let current = frontier.splice(currentIndex, 1)[0];
        if (current[0] === endHex[0] && current[1] === endHex[1]) {
          break;
        }

        let currentNeighbors = this.getSurroundingHexs(current);
        for (let i = 0; i < currentNeighbors.length; i++) {
          let newCost =
            costFrom[current[0]][current[1]] +
            this.state.hexGrid[currentNeighbors[i][0]][currentNeighbors[i][1]]
              .movementCost;
          if (
            costFrom[currentNeighbors[i][0]][currentNeighbors[i][1]] !==
            undefined
          ) {
            if (
              (costFrom[currentNeighbors[i][0]][currentNeighbors[i][1]] ===
                undefined ||
                newCost <
                  costFrom[currentNeighbors[i][0]][currentNeighbors[i][1]]) &&
              this.state.hexGrid[currentNeighbors[i][0]][currentNeighbors[i][1]]
                .type !== "lake" &&
              this.state.hexGrid[currentNeighbors[i][0]][currentNeighbors[i][1]]
                .piece === undefined
            ) {
              costFrom[currentNeighbors[i][0]][
                currentNeighbors[i][1]
              ] = newCost;
              cameFrom[currentNeighbors[i][0]][
                currentNeighbors[i][1]
              ] = current;
              frontier.push(currentNeighbors[i]);
            }
          } else if (
            costFrom[currentNeighbors[i][0]][currentNeighbors[i][1]] ===
              undefined &&
            this.state.hexGrid[currentNeighbors[i][0]][currentNeighbors[i][1]]
              .type !== "lake" &&
            this.state.hexGrid[currentNeighbors[i][0]][currentNeighbors[i][1]]
              .piece === undefined
          ) {
            costFrom[currentNeighbors[i][0]][currentNeighbors[i][1]] = newCost;
            cameFrom[currentNeighbors[i][0]][currentNeighbors[i][1]] = current;
            frontier.push(currentNeighbors[i]);
          }
        }
        contingency++;
      }

      //Setting the path
      let currentHex = endHex;
      let path = [];
      let contingency2 = 0;
      while (
        currentHex !== startHex &&
        contingency2 < Math.pow(cameFrom.length, 2)
      ) {
        path.push(currentHex);
        currentHex = cameFrom[currentHex[0]][currentHex[1]];
      }
      return path.reverse();
    }
  }

  getSurroundingHexs(hex) {
    let surrounding = [];
    if (hex[0] % 2 === 1) {
      if (hex[1] + 1 < this.state.hexGrid[hex[0]].length) {
        surrounding.push([hex[0], hex[1] + 1]);
        if (hex[0] - 1 >= 0) {
          surrounding.push([hex[0] - 1, hex[1] + 1]);
        }
        if (hex[0] + 1 < this.state.hexGrid.length) {
          surrounding.push([hex[0] + 1, hex[1] + 1]);
        }
      }
      if (hex[0] - 1 >= 0) {
        surrounding.push([hex[0] - 1, hex[1]]);
      }
      if (hex[1] - 1 >= 0) {
        surrounding.push([hex[0], hex[1] - 1]);
      }
      if (hex[0] + 1 < this.state.hexGrid.length) {
        surrounding.push([hex[0] + 1, hex[1]]);
      }
    } else {
      if (hex[1] - 1 >= 0) {
        surrounding.push([hex[0], hex[1] - 1]);
        if (hex[0] - 1 >= 0) {
          surrounding.push([hex[0] - 1, hex[1] - 1]);
        }
        if (hex[0] + 1 < this.state.hexGrid.length) {
          surrounding.push([hex[0] + 1, hex[1] - 1]);
        }
      }
      if (hex[1] + 1 < this.state.hexGrid[hex[0]].length) {
        surrounding.push([hex[0], hex[1] + 1]);
      }
      if (hex[0] - 1 >= 0) {
        surrounding.push([hex[0] - 1, hex[1]]);
      }
      if (hex[0] + 1 < this.state.hexGrid.length) {
        surrounding.push([hex[0] + 1, hex[1]]);
      }
    }
    return surrounding;
  }

  setPath(path, color) {
    console.log(path);
    console.log(color);
    if (path !== undefined) {
      for (let i = 0; i < path.length; i++) {
        this.setState(state => {
          state.hexGrid[path[i][0]][path[i][1]].ableMovement = color;
        });
      }
    }
    this.forceUpdate();
  }

  setPathPlanned(path) {
    if (path !== undefined) {
      for (let i = 0; i < path.length; i++) {
        this.setState(state => {
          state.hexGrid[path[i][0]][path[i][1]].plannedMovement = true;
        });
      }
    }
    this.forceUpdate();
  }

  movePiece(targetNation, targetPiece, hex) {
    this.setState(state => {
      state.nations[targetNation].pieces[targetPiece].movementLeft = 0;
      state.hexGrid[hex[0]][hex[1]].piece = {
        ownedBy: targetNation,
        type: "settler",
        piece: targetPiece
      };
      state.hexGrid[state.nations[targetNation].pieces[targetPiece].x][
        state.nations[targetNation].pieces[targetPiece].y
      ].piece = undefined;
      state.nations[targetNation].pieces[targetPiece].x = hex[0];
      state.nations[targetNation].pieces[targetPiece].y = hex[1];
      if (state.nations[targetNation].pieces[targetPiece].targetHex === hex) {
        state.nations[targetNation].pieces[targetPiece].targetHex = undefined;
      }
    });
  }

  getMovementPath(start, end, movement) {
    if (end !== undefined) {
      let path = this.pathfind(start, end);
      let pathMove = [];
      let costLeft = movement;
      let hex = [0, 0];
      if (costLeft > 0) {
        if (path !== undefined) {
          while (costLeft > 0 && path.length > 0) {
            hex = path.splice(0, 1)[0];
            pathMove.push(hex);
            costLeft -= this.state.hexGrid[hex[0]][hex[1]].movementCost;
          }
          return [hex, path, pathMove];
        }
      }
    }
  }

  /*------------------END HEXAGON CODE------------------*/
  /*--------------------START HANDLE--------------------*/

  cancelClick(e) {
    e.preventDefault();
    this.setState({
      summaryOpen: false
    });
  }

  handleHexClick(e) {
    e.preventDefault();
    this.clearPath();
    this.clearPathPlanned();
    let hex = JSON.parse(e.target.parentElement.getAttribute("hex-data"));
    if (this.state.selected === undefined) {
      if (
        this.state.hexGrid[hex.x][hex.y].piece !== undefined &&
        this.state.hexGrid[hex.x][hex.y].piece.ownedBy ===
          this.state.currentNation
      ) {
        //Nothing is selected and the hex that was clicked on has a piece on it that is owned by the currentNation
        this.setState(
          state => {
            state.selected = [hex.x, hex.y];
          },
          () => {
            if (
              this.state.hexGrid[this.state.selected[0]][this.state.selected[1]]
                .piece.type !== "city" &&
              this.state.nations[this.state.currentNation].pieces[
                this.state.hexGrid[this.state.selected[0]][
                  this.state.selected[1]
                ].piece.piece
              ].targetHex !== undefined
            ) {
              this.setPathPlanned(
                this.pathfind(
                  [hex.x, hex.y],
                  this.state.nations[this.state.currentNation].pieces[
                    this.state.hexGrid[this.state.selected[0]][
                      this.state.selected[1]
                    ].piece.piece
                  ].targetHex
                )
              );
            }
          }
        );
      }
    } else if (
      this.state.hexGrid[this.state.selected[0]][this.state.selected[1]].piece
        .type !== "city"
    ) {
      if (this.state.hexGrid[hex.x][hex.y].piece !== undefined) {
        if (
          this.state.hexGrid[hex.x][hex.y].piece.ownedBy ===
          this.state.currentNation
        ) {
          if ([hex.x, hex.y] === this.state.selected) {
            //Hex has a piece on it and that piece is the one that is selected
            this.setState(state => {
              state.selected = undefined;
            });
          } else {
            //Hex has a piece from the currentNation on it and has a different one selected
            this.setState(state => {
              state.selected = [hex.x, hex.y];
            });
          }
        } else {
          //Hex has a piece on it and it is owned by an enemy nation and a peice of currentNation is selected
          console.log("Feature to be created at a later date");
        }
      } else {
        //There is no piece on that hex and a piece from currentNation is selected
        this.setState(
          state => {
            state.nations[state.currentNation].pieces[
              state.hexGrid[state.selected[0]][state.selected[1]].piece.piece
            ].targetHex = [hex.x, hex.y];
          },
          () => {
            let data = this.getMovementPath(
              [
                this.state.nations[this.state.currentNation].pieces[
                  this.state.hexGrid[this.state.selected[0]][
                    this.state.selected[1]
                  ].piece.piece
                ].x,
                this.state.nations[this.state.currentNation].pieces[
                  this.state.hexGrid[this.state.selected[0]][
                    this.state.selected[1]
                  ].piece.piece
                ].y
              ],
              this.state.nations[this.state.currentNation].pieces[
                this.state.hexGrid[this.state.selected[0]][
                  this.state.selected[1]
                ].piece.piece
              ].targetHex,
              this.state.nations[this.state.currentNation].pieces[
                this.state.hexGrid[this.state.selected[0]][
                  this.state.selected[1]
                ].piece.piece
              ].movementLeft
            );
            if (data !== undefined) {
              this.movePiece(
                this.state.currentNation,
                this.state.hexGrid[this.state.selected[0]][
                  this.state.selected[1]
                ].piece.piece,
                data[0]
              );
              this.setState(state => {
                state.selected = data[0];
              });
              this.setPathPlanned(data[1]);
            } else {
              this.setPathPlanned(
                this.pathfind(
                  [
                    this.state.nations[this.state.currentNation].pieces[
                      this.state.hexGrid[this.state.selected[0]][
                        this.state.selected[1]
                      ].piece.piece
                    ].x,
                    this.state.nations[this.state.currentNation].pieces[
                      this.state.hexGrid[this.state.selected[0]][
                        this.state.selected[1]
                      ].piece.piece
                    ].y
                  ],
                  this.state.nations[this.state.currentNation].pieces[
                    this.state.hexGrid[this.state.selected[0]][
                      this.state.selected[1]
                    ].piece.piece
                  ].targetHex
                )
              );
            }
          }
        );
      }
    }
    this.forceUpdate();
  }

  handleHexHover(e) {
    e.preventDefault();
    let hex = JSON.parse(e.target.parentElement.getAttribute("hex-data"));
    this.setState(state => {
      state.currentCoords = [hex.x, hex.y];
    });
    if (
      hex !== undefined &&
      this.state.selected !== undefined &&
      this.state.hexGrid[this.state.selected[0]][this.state.selected[1]]
        .piece !== undefined &&
      this.state.hexGrid[this.state.selected[0]][this.state.selected[1]].piece
        .type !== "city"
    ) {
      this.clearPath();
      this.setPath(this.pathfind(this.state.selected, [hex.x, hex.y]), "black");
      let path = this.getMovementPath(
        this.state.selected,
        [hex.x, hex.y],
        this.state.nations[this.state.currentNation].pieces[
          this.state.hexGrid[this.state.selected[0]][this.state.selected[1]]
            .piece.piece
        ].movementLeft
      );
      if (path !== undefined) {
        this.setPath(path[2], "white");
      }
    } else {
      this.clearPath();
    }
    this.forceUpdate();
  }

  handleFoundCity(e) {
    e.preventDefault();
    this.clearPath();
    this.clearPathPlanned();
    if (this.state.selected !== undefined) {
      if (
        this.state.nations[this.state.currentNation].pieces[
          this.state.hexGrid[this.state.selected[0]][this.state.selected[1]]
            .piece.piece
        ].type === "settler"
      ) {
        let xCoord = this.state.nations[this.state.currentNation].pieces[
          this.state.hexGrid[this.state.selected[0]][this.state.selected[1]]
            .piece.piece
        ].x;
        let yCoord = this.state.nations[this.state.currentNation].pieces[
          this.state.hexGrid[this.state.selected[0]][this.state.selected[1]]
            .piece.piece
        ].y;
        let randomString = "";
        for (let j = 0; j < 5; j++) {
          randomString += String.fromCharCode(
            Math.floor(Math.random() * 25 + 97)
          );
        }

        let surroundTemp = this.getSurroundingHexs([xCoord, yCoord]);
        let surrounding = [];
        for (let k = 0; k < surroundTemp.length; k++) {
          if (
            this.state.hexGrid[surroundTemp[k][0]][surroundTemp[k][1]]
              .claimedBy === -1
          ) {
            surrounding.push(surroundTemp[k]);
          }
        }

        let city = this.state.nations[this.state.currentNation].cities.concat([
          {
            name: randomString,
            x: xCoord,
            y: yCoord,
            population: 2,
            claimedTiles: surrounding
          }
        ]);

        let cityNum = this.state.nations[this.state.currentNation].cities
          .length;

        this.setState(state => {
          state.hexGrid[xCoord][yCoord].piece = {
            ownedBy: state.currentNation,
            type: "city",
            piece: cityNum
          };
          state.hexGrid[xCoord][yCoord].claimedBy = state.currentNation;
          state.nations[state.currentNation].cities = city;
          for (let i = 0; i < surrounding.length; i++) {
            state.hexGrid[surrounding[i][0]][surrounding[i][1]].claimedBy =
              state.currentNation;
          }
          state.nations[state.currentNation].pieces.splice(
            state.hexGrid[state.selected[0]][state.selected[1]].piece.piece,
            1
          );
          state.selected = undefined;
        });
      }
      this.clearPath();
    }
  }

  handleTurn(e) {
    e.preventDefault();
    this.clearPath();
    this.clearPathPlanned();
    this.setState(
      state => {
        state.currentNation++;
        if (state.currentNation >= this.state.nations.length) {
          state.currentNation = 0;
        }
        state.selected = undefined;
      },
      () => {
        for (
          let i = 0;
          i < this.state.nations[this.state.currentNation].pieces.length;
          i++
        ) {
          if (
            this.state.nations[this.state.currentNation].pieces[i].targetHex !==
            undefined
          ) {
            this.movePiece(
              this.state.currentNation,
              i,
              this.getMovementPath(
                [
                  this.state.nations[this.state.currentNation].pieces[i].x,
                  this.state.nations[this.state.currentNation].pieces[i].y
                ],
                this.state.nations[this.state.currentNation].pieces[i]
                  .targetHex,
                this.state.nations[this.state.currentNation].pieces[i].movement
              )[0]
            );
          }
        }
        this.forceUpdate();
      }
    );
    this.forceUpdate();
  }

  /*---------------------END HANDLE---------------------*/
  /*-----------------START HANDLE DATA------------------*/

  getTotalFood(arr) {
    console.log(arr);
    let food = 0;
    for (let i = 0; i < arr.length; i++) {
      food += this.state.hexGrid[arr[i][0]][arr[i][1]].food;
    }
    return food;
  }

  getTotalProduction(arr) {
    let production = 0;
    for (let i = 0; i < arr.length; i++) {
      production += this.state.hexGrid[arr[i][0]][arr[i][1]].production;
    }
    return production;
  }

  getTotalGold(arr) {
    let gold = 0;
    for (let i = 0; i < arr.length; i++) {
      gold += this.state.hexGrid[arr[i][0]][arr[i][1]].gold;
    }
    return gold;
  }

  /*------------------END HANDLE DATA-------------------*/

  render() {
    return (
      <div className="App">
        <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
          <symbol
            id="hexagon"
            viewBox={
              "-10 " +
              -20 * Math.tan(Math.PI / 6) +
              " 220 " +
              440 * Math.tan(Math.PI / 6)
            }
          >
            <polygon
              points={
                "100 0 " +
                "200 " +
                Math.tan(Math.PI / 6) * 100 +
                " 200 " +
                Math.tan(Math.PI / 6) * 300 +
                " 100 " +
                400 * Math.tan(Math.PI / 6) +
                " 0 " +
                Math.tan(Math.PI / 6) * 300 +
                " 0 " +
                Math.tan(Math.PI / 6) * 100
              }
            />
          </symbol>
          <symbol
            id="outline"
            viewBox={
              "-10 " +
              -20 * Math.tan(Math.PI / 6) +
              " 220 " +
              440 * Math.tan(Math.PI / 6)
            }
          >
            <polygon
              points={
                "100 0 " +
                "200 " +
                Math.tan(Math.PI / 6) * 100 +
                " 200 " +
                Math.tan(Math.PI / 6) * 300 +
                " 100 " +
                400 * Math.tan(Math.PI / 6) +
                " 0 " +
                Math.tan(Math.PI / 6) * 300 +
                " 0 " +
                Math.tan(Math.PI / 6) * 100
              }
              fill="none"
            />
          </symbol>
          <symbol
            id="pathShow"
            viewBox={
              "-30 " +
              -40 * Math.tan(Math.PI / 6) +
              " 260 " +
              480 * Math.tan(Math.PI / 6)
            }
          >
            <polygon
              points={
                "100 0 " +
                "200 " +
                Math.tan(Math.PI / 6) * 100 +
                " 200 " +
                Math.tan(Math.PI / 6) * 300 +
                " 100 " +
                400 * Math.tan(Math.PI / 6) +
                " 0 " +
                Math.tan(Math.PI / 6) * 300 +
                " 0 " +
                Math.tan(Math.PI / 6) * 100
              }
              fill="none"
            />
          </symbol>
          <symbol id="settler" viewBox="-149.3095 -149.3095 750 750">
            <polygon points="171 327, 170 325, 170 331, 180 343, 180 338, 171 327" />
            <polygon points="219 185, 243 161, 219 136, 194 161, 219 185" />
            <polygon points="328 206, 358 176, 328 146, 299 176, 328 206" />
            <polygon points="255 158, 252 166, 244 182, 244 182, 244 182, 258 193, 274 229, 281 214, 298 201, 289 176, 298 151, 267 151, 255 158" />
            <polygon points="257 341, 257 343, 269 351, 282 338, 282 328, 257 341" />
            <polygon points="286 97, 262 122, 286 147, 311 122, 286 97" />
            <polygon points="171 212, 180 193, 193 183, 193 181, 186 163, 161 162, 164 176, 155 201, 171 212" />
            <polygon points="165 158, 188 136, 165 113, 143 136, 144 142, 159 157, 165 158" />
            <polygon points="203 339, 189 341, 189 377, 201 390, 214 377, 214 329, 203 339" />
            <polygon points="238 307, 249 285, 249 284, 249 245, 258 265, 269 239, 250 197, 238 190, 200 190, 188 197, 176 222, 188 248, 189 245, 189 250, 199 273, 214 306, 214 301, 223 301, 223 377, 236 390, 249 377, 249 339, 238 307" />
            <polygon points="125 146, 95 176, 125 206, 154 176, 125 146" />
            <polygon points="430 166, 424 147, 420 132, 383 4, 375 0, 371 8, 373 14, 67 18, 70 7, 65 0, 58 5, 22 166, 26 173, 33 169, 35 161, 54 206, 89 233, 89 436, 104 451, 119 436, 119 345, 130 345, 130 436, 146 451, 161 436, 161 278, 181 323, 198 329, 204 312, 162 219, 147 212, 103 212, 74 190, 52 137, 42 130, 49 100, 270 93, 297 90, 398 98, 407 131, 401 137, 379 190, 350 212, 306 212, 291 219, 249 312, 255 329, 272 323, 292 278, 292 436, 308 451, 323 436, 323 345, 334 345, 334 436, 349 451, 364 436, 364 233, 399 206, 417 164, 418 169, 426 173, 430 166" />
          </symbol>
          <symbol id="city" viewBox="-50 -40 200 200">
            <polygon points="15 100, 40 100, 40 70, 60 70, 60 100, 85 100, 85 60, 50 30, 15 60" />
            <polygon points="10 60, 50 25, 90 60, 100 50, 50 7.5, 0 50" />
          </symbol>
        </svg>
        <div className="gridContainer">
          {this.getHexes().map(value => {
            let color = "";
            let outlineColor =
              this.state.hexGrid[value.x][value.y].claimedBy > -1;

            if (value.piece !== undefined) {
              color = this.state.nations[value.piece.ownedBy].color;
            } else if (this.state.hexGrid[value.x][value.y].claimedBy > -1) {
              color = this.state.nations[value.claimedBy].color;
            }

            return (
              <svg
                width="4vw"
                height={4 * 2 * Math.tan(Math.PI / 6) + "vw"}
                className="hex"
                key={JSON.stringify(value)}
                hex-data={JSON.stringify(value)}
              >
                <use
                  xlinkHref="#hexagon"
                  className={
                    "hexColor" +
                    this.state.hexGrid[value.x][value.y].type
                      .charAt(0)
                      .toUpperCase() +
                    this.state.hexGrid[value.x][value.y].type.slice(1) +
                    " hexStrokeBackground"
                  }
                  onClick={e => {
                    this.handleHexClick(e);
                  }}
                  onMouseOver={e => {
                    this.handleHexHover(e);
                  }}
                />
                <use
                  xlinkHref="#outline"
                  stroke={outlineColor ? color : "black"}
                  strokeWidth=".75vw"
                  onClick={e => {
                    this.handleHexClick(e);
                  }}
                  onMouseOver={e => {
                    this.handleHexHover(e);
                  }}
                />
                {value.ableMovement !== undefined ? (
                  <use
                    xlinkHref="#pathShow"
                    stroke={value.ableMovement}
                    strokeWidth=".75vw"
                    onClick={e => {
                      this.handleHexClick(e);
                    }}
                    onMouseOver={e => {
                      this.handleHexHover(e);
                    }}
                  />
                ) : (
                  <use />
                )}
                {value.plannedMovement ? (
                  <use
                    xlinkHref="#pathShow"
                    stroke={this.state.nations[this.state.currentNation].color}
                    strokeWidth=".75vw"
                    onClick={e => {
                      this.handleHexClick(e);
                    }}
                    onMouseOver={e => {
                      this.handleHexHover(e);
                    }}
                  />
                ) : (
                  <use />
                )}

                {value.piece !== undefined ? (
                  <use
                    xlinkHref={"#" + value.piece.type}
                    fill={color}
                    onClick={e => {
                      this.handleHexClick(e);
                    }}
                    onMouseOver={e => {
                      this.handleHexHover(e);
                    }}
                  />
                ) : (
                  <use />
                )}
              </svg>
            );
          })}
        </div>
        <div className="sidePanelContainer">
          <div className="sectionContainer">
            <div className="hexSummaryContainer">
              <svg width={"7vw"} height={7 * 2 * Math.tan(Math.PI / 6) + "vw"}>
                <use
                  xlinkHref="#hexagon"
                  className={
                    "hexColor" +
                    this.state.hexGrid[this.state.currentCoords[0]][
                      this.state.currentCoords[1]
                    ].type
                      .charAt(0)
                      .toUpperCase() +
                    this.state.hexGrid[this.state.currentCoords[0]][
                      this.state.currentCoords[1]
                    ].type.slice(1) +
                    " hexStrokeBackground"
                  }
                />
                <use
                  xlinkHref="#outline"
                  stroke={
                    this.state.hexGrid[this.state.currentCoords[0]][
                      this.state.currentCoords[1]
                    ].claimedBy === -1
                      ? "black"
                      : this.state.nations[
                          this.state.hexGrid[this.state.currentCoords[0]][
                            this.state.currentCoords[1]
                          ].claimedBy
                        ].color
                  }
                  strokeWidth=".75vw"
                />
                {this.state.hexGrid[this.state.currentCoords[0]][
                  this.state.currentCoords[1]
                ].piece !== undefined ? (
                  <use
                    xlinkHref={
                      "#" +
                      this.state.hexGrid[this.state.currentCoords[0]][
                        this.state.currentCoords[1]
                      ].piece.type
                    }
                    fill={
                      this.state.nations[
                        this.state.hexGrid[this.state.currentCoords[0]][
                          this.state.currentCoords[1]
                        ].piece.ownedBy
                      ].color
                    }
                  />
                ) : (
                  <use />
                )}
              </svg>
              <div className="hexDataContainer">
                <h3>{"Location: " + this.state.currentCoords}</h3>
                <h3>
                  {"Food: " +
                    this.state.hexGrid[this.state.currentCoords[0]][
                      this.state.currentCoords[1]
                    ].food}
                </h3>
                <h3>
                  {"Production: " +
                    this.state.hexGrid[this.state.currentCoords[0]][
                      this.state.currentCoords[1]
                    ].production}
                </h3>
                <h3>
                  {"Gold: " +
                    this.state.hexGrid[this.state.currentCoords[0]][
                      this.state.currentCoords[1]
                    ].gold}
                </h3>
                <h3>
                  {"Resource: " +
                    this.state.hexGrid[this.state.currentCoords[0]][
                      this.state.currentCoords[1]
                    ].resource.name
                      .charAt(0)
                      .toUpperCase() +
                    this.state.hexGrid[this.state.currentCoords[0]][
                      this.state.currentCoords[1]
                    ].resource.name.slice(1)}
                </h3>
              </div>
              {this.state.hexGrid[this.state.currentCoords[0]][
                this.state.currentCoords[1]
              ].piece !== undefined ? (
                this.state.hexGrid[this.state.currentCoords[0]][
                  this.state.currentCoords[1]
                ].piece.type === "city" ? (
                  <div>
                    <h3>
                      {"Nation: " +
                        this.state.nations[
                          this.state.hexGrid[this.state.currentCoords[0]][
                            this.state.currentCoords[1]
                          ].piece.ownedBy
                        ].name
                          .charAt(0)
                          .toUpperCase() +
                        this.state.nations[
                          this.state.hexGrid[this.state.currentCoords[0]][
                            this.state.currentCoords[1]
                          ].piece.ownedBy
                        ].name.slice(1)}
                    </h3>
                    <h3>
                      {"City: " +
                        this.state.nations[
                          this.state.hexGrid[this.state.currentCoords[0]][
                            this.state.currentCoords[1]
                          ].piece.ownedBy
                        ].cities[
                          this.state.hexGrid[this.state.currentCoords[0]][
                            this.state.currentCoords[1]
                          ].piece.piece
                        ].name
                          .charAt(0)
                          .toUpperCase() +
                        this.state.nations[
                          this.state.hexGrid[this.state.currentCoords[0]][
                            this.state.currentCoords[1]
                          ].piece.ownedBy
                        ].cities[
                          this.state.hexGrid[this.state.currentCoords[0]][
                            this.state.currentCoords[1]
                          ].piece.piece
                        ].name.slice(1)}
                    </h3>
                    <h3>
                      {"Population: " +
                        this.state.nations[
                          this.state.hexGrid[this.state.currentCoords[0]][
                            this.state.currentCoords[1]
                          ].piece.ownedBy
                        ].cities[
                          this.state.hexGrid[this.state.currentCoords[0]][
                            this.state.currentCoords[1]
                          ].piece.piece
                        ].population}
                    </h3>
                  </div>
                ) : (
                  <div>
                    <h3>
                      {"Nation: " +
                        this.state.nations[
                          this.state.hexGrid[this.state.currentCoords[0]][
                            this.state.currentCoords[1]
                          ].piece.ownedBy
                        ].name
                          .charAt(0)
                          .toUpperCase() +
                        this.state.nations[
                          this.state.hexGrid[this.state.currentCoords[0]][
                            this.state.currentCoords[1]
                          ].piece.ownedBy
                        ].name.slice(1)}
                    </h3>
                    <h3>
                      {"Type: " +
                        this.state.hexGrid[this.state.currentCoords[0]][
                          this.state.currentCoords[1]
                        ].piece.type
                          .charAt(0)
                          .toUpperCase() +
                        this.state.hexGrid[this.state.currentCoords[0]][
                          this.state.currentCoords[1]
                        ].piece.type.slice(1)}
                    </h3>
                  </div>
                )
              ) : (
                <div />
              )}
            </div>
          </div>
          <div className="sectionContainer">
            <h1>
              {this.state.nations[this.state.currentNation].name
                .charAt(0)
                .toUpperCase() +
                this.state.nations[this.state.currentNation].name.slice(1)}
            </h1>
            <div className="summarySectionContainer">
              <h3>{"Food: " + 0}</h3>
              <h3>{"Production: " + 0}</h3>
              <h3>{"Gold: " + 0}</h3>
              <h3>{"Population: " + 0}</h3>
            </div>
            {this.state.nations[this.state.currentNation].cities.map(value => {
              return (
                <div className="summarySectionContainer">
                  <div className="sectionContainer">
                    <h2>
                      {value.name.charAt(0).toUpperCase() + value.name.slice(1)}
                    </h2>
                    <div className="summarySectionContainer">
                      <div>
                        <h4>{"Location: " + value.x + ", " + value.y}</h4>
                        <h4>{"Population: " + value.population}</h4>
                      </div>
                      <div>
                        <h4>
                          {"Food: " + this.getTotalFood(value.claimedTiles)}
                        </h4>
                        <h4>
                          {"Production: " +
                            this.getTotalProduction(value.claimedTiles)}
                        </h4>
                        <h4>
                          {"Gold: " + this.getTotalGold(value.claimedTiles)}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {this.state.selected !== undefined &&
            this.state.hexGrid[this.state.selected[0]][this.state.selected[1]]
              .piece !== undefined &&
            this.state.hexGrid[this.state.selected[0]][this.state.selected[1]]
              .piece.type !== "city" ? (
              <div className="summarySectionContainer">
                <div className="sectionContainer">
                  <h2>
                    {"Selected Piece: " +
                      this.state.hexGrid[this.state.selected[0]][
                        this.state.selected[1]
                      ].type}
                  </h2>
                  <div className="summarySectionContainer">
                    <h4>
                      {"Location: " +
                        this.state.selected[0] +
                        ", " +
                        this.state.selected[1]}
                    </h4>
                    <h4>
                      {this.state.nations[this.state.currentNation].pieces[
                        this.state.hexGrid[this.state.selected[0]][
                          this.state.selected[1]
                        ].piece.piece
                      ].targetHex !== undefined
                        ? "Moving to: " +
                          this.state.nations[this.state.currentNation].pieces[
                            this.state.hexGrid[this.state.selected[0]][
                              this.state.selected[1]
                            ].piece.piece
                          ].targetHex[0] +
                          ", " +
                          this.state.nations[this.state.currentNation].pieces[
                            this.state.hexGrid[this.state.selected[0]][
                              this.state.selected[1]
                            ].piece.piece
                          ].targetHex[1]
                        : "Currently not moving"}
                    </h4>
                  </div>
                  {this.state.nations[this.state.currentNation].pieces[
                    this.state.hexGrid[this.state.selected[0]][
                      this.state.selected[1]
                    ].piece.piece
                  ].type === "settler" ? (
                    <div className="summarySectionContainer">
                      <div
                        className="button unselectable borderWhite"
                        onClick={e => this.handleFoundCity(e)}
                      >
                        <h4>Found City</h4>
                      </div>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              </div>
            ) : (
              <div />
            )}
          </div>
          <div
            className="button unselectable borderWhite"
            onClick={e => {
              this.handleTurn(e);
            }}
          >
            <h1>Next Turn</h1>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

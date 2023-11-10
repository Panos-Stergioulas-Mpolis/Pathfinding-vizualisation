import React from "react";
import { useState } from "react";
import "./grid.css";
import { useEffect } from "react";

class Node {
  constructor(x, y, prev = null) {
    this.x = x;
    this.y = y;
    this.prev = prev;
  }
}

class Algos {
  BFS(sx, sy, tx, ty, visitedNodes) {
    let nodesVisited = 0;
    let endNode = null;
    let startNode = new Node(Number(sx), Number(sy));
    let queue = [];
    queue.push(startNode);
    let node = null;

    while (queue.length > 0) {
      node = queue.shift();
      visitedNodes[node.x][node.y] = true;
      nodesVisited++;
      if (Number(node.x) === Number(tx) && Number(node.y) === Number(ty)) {
        endNode = node;
        break;
      }

      function tryToPushNode(dx, dy) {
        if (
          Number(node.x + dx) <= 49 &&
          Number(node.x + dx) >= 0 &&
          Number(node.y + dy) <= 14 &&
          Number(node.y + dy) >= 0
        ) {
          if (
            document.getElementById(`${node.x + dx},${node.y + dy}`).style
              .backgroundColor !== "black"
          ) {
            if (visitedNodes[node.x + dx][node.y + dy] === false) {
              let nodeChild = new Node(node.x + dx, node.y + dy, node);
              queue.push(nodeChild);
              visitedNodes[node.x + dx][node.y + dy] = true;
            }
          }
        }
      }
      tryToPushNode(0, -1);
      tryToPushNode(1, -1);
      tryToPushNode(1, 0);
      tryToPushNode(1, 1);
      tryToPushNode(0, 1);
      tryToPushNode(-1, 1);
      tryToPushNode(-1, 0);
      tryToPushNode(-1, -1);
    }
    return [endNode, nodesVisited];
  }

  DFS(sx, sy, tx, ty, visitedNodes) {
    let endNode = null;
    let totalNodesVisited = 0;
    let node = new Node(sx, sy, null);

    function search(node) {
      // Check if endNode is already found
      if (endNode !== null) {
        return;
      }

      visitedNodes[node.x][node.y] = true;
      const list = [];
      totalNodesVisited++;
      document.getElementById(`${node.x},${node.y}`).style.backgroundColor =
        "#ff007f";
      if (node.x == Number(tx) && node.y == Number(ty)) {
        endNode = node;
        return; // Stop the search when the endNode is found
      }

      console.log(node.x + " ihi " + node.y);
      function tryToPushNode(dx, dy) {
        if (
          Number(node.x + dx) <= 49 &&
          Number(node.x + dx) >= 0 &&
          Number(node.y + dy) <= 14 &&
          Number(node.y + dy) >= 0
        ) {
          console.log(node.x + " oho " + node.y);
          if (
            document.getElementById(`${node.x + dx},${node.y + dy}`).style
              .backgroundColor !== "black"
          ) {
            if (!visitedNodes[node.x + dx][node.y + dy]) {
              list.push(new Node(node.x + dx, node.y + dy, node));
            }
          }
        }
      }

      tryToPushNode(0, -1);
      tryToPushNode(1, -1);
      tryToPushNode(1, 0);
      tryToPushNode(1, 1);
      tryToPushNode(0, 1);
      tryToPushNode(-1, 1);
      tryToPushNode(-1, 0);
      tryToPushNode(-1, -1);
      while (list.length > 0) {
        search(list.shift());
      }
    }

    search(node);
    return [endNode, totalNodesVisited];
  }
}

class AlgoVis {
  BFS(i, j, tx, ty, callback) {
    const graphArray = [];
    graphArray.push([Number(i), Number(j)]);

    function processNextStep() {
      if (graphArray.length > 0) {
        let node = graphArray.shift();
        let i = node[0];
        let j = node[1];
        if (i === Number(tx) && j === Number(ty)) {
          callback();
          return;
        }

        if (
          document.getElementById(`${i},${j}`).style.backgroundColor !== "blue"
        ) {
          document.getElementById(`${i},${j}`).style.backgroundColor =
            "lightgreen";
        }
        function changeColorAndPush(directionI, directionJ) {
          if (
            j + directionJ >= 0 &&
            j + directionJ <= 14 &&
            i + directionI >= 0 &&
            i + directionI <= 49
          ) {
            let element = document.getElementById(
              `${i + directionI},${j + directionJ}`
            );
            if (
              element &&
              element.style.backgroundColor !== "blue" &&
              element.style.backgroundColor !== "lightgreen" &&
              element.style.backgroundColor !== "black" &&
              element.style.backgroundColor !== "yellow"
            ) {
              if (element.style.backgroundColor !== "red") {
                element.style.backgroundColor = "yellow";
              }
              graphArray.push([i + directionI, j + directionJ]);
            }
          }
        }

        changeColorAndPush(0, -1);
        changeColorAndPush(1, -1);
        changeColorAndPush(1, 0);
        changeColorAndPush(1, 1);
        changeColorAndPush(0, 1);
        changeColorAndPush(-1, 1);
        changeColorAndPush(-1, 0);
        changeColorAndPush(-1, -1);

        setTimeout(processNextStep, 1); // Continue with the next step after a delay
      }
    }

    processNextStep();
  }
}

const Grid = (props) => {
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(15);

  const [startX, setStartX] = useState(props.sX);
  const [startY, setStartY] = useState(props.sY);
  const [targetX, setTargetX] = useState(props.tX);
  const [targetY, setTargetY] = useState(props.tY);

  const [draw, setDraw] = useState(false);
  const [erase, setErase] = useState(false);

  function block(i, j) {
    if (
      draw === true &&
      !(j === props.sY && i === props.sX) &&
      !(j === props.tY && i === props.tX)
    ) {
      document.getElementById(`${i},${j}`).style.backgroundColor = "black";
    }
    if (
      erase === true &&
      !(j === props.sY && i === props.sX) &&
      !(j === props.tY && i === props.tX)
    ) {
      document.getElementById(`${i},${j}`).style.backgroundColor = "white";
    }
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "d" || event.key === "D") {
        setDraw(!draw);
        setErase(false);
      }
      if (event.key === "e" || event.key === "E") {
        setErase(!erase);
        setDraw(false);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress); // Clean up the event listener
    };
  }, [draw, erase]);

  const arrayOfNodes = [];
  const visitedNodes = [];

  function setGrid() {
    for (let i = 0; i < height; i++) {
      let tempArr = [];
      for (let j = 0; j < width; j++) {
        tempArr.push(
          <div
            onMouseMove={() => block(j, i)}
            className={"node"}
            id={`${j},${i}`}
          ></div>
        );
      }
      arrayOfNodes.push(<div className="line">{tempArr}</div>);
    }
    for (let i = 0; i < width; i++) {
      visitedNodes[i] = [];
      for (let j = 0; j < height; j++) {
        visitedNodes[i][j] = false;
      }
    }
  }

  setGrid();

  useEffect(() => {}, [props.clearBoard]);

  useEffect(() => {
    async function change() {
      document.getElementById(`${startX},${startY}`).style.background = "white";
      document.getElementById(`${targetX},${targetY}`).style.background =
        "white";
    }

    change();
    setStartX(props.sX);
    setStartY(props.sY);
    setTargetX(props.tX);
    setTargetY(props.tY);
  }, [props.sX, props.sY, props.tX, props.tY]);

  useEffect(() => {
    async function change() {
      document.getElementById(`${startX},${startY}`).style.background =
        "linear-gradient(240deg, red, purple, green, yellow, blue, black, white, orange)";
      document.getElementById(`${targetX},${targetY}`).style.background =
        "linear-gradient(240deg,  red, purple, green, yellow, blue, black, white, magenta)";
    }

    change();
  }, [startX, startY, targetX, targetY]);

  useEffect(() => {
    let node = null;
    async function Visualize() {
      let g = new AlgoVis();
      let alg = new Algos();
      if (props.alg === "BFS") {
        g.BFS(startX, startY, targetX, targetY, () => {
          // This callback is called when BFS traversal is complete
          node = alg.BFS(startX, startY, targetX, targetY, visitedNodes);
          let pathArr = [];
          let currNode = node[0];
          pathArr.push(node);

          while (currNode.prev !== null) {
            pathArr.push(currNode.prev);
            currNode = currNode.prev;
          }
          props.Stats(node[1], pathArr.length);
          visualizePath(pathArr, true);
        });
      } else if (props.alg === "DFS") {
        node = alg.DFS(
          Number(startX),
          Number(startY),
          Number(targetX),
          Number(targetY),
          visitedNodes
        );
        let currNode = node[0];
        if (currNode) {
          let pathArr = [];
          pathArr.push(currNode);
          while (currNode.prev !== null) {
            pathArr.push(currNode.prev);
            currNode = currNode.prev;
          }
          props.Stats(node[1], pathArr.length);
          visualizePath(pathArr, false, true);
        } else {
          console.log("No path found.");
        }
      }
    }

    async function visualizePath(arr, purple = false, lblue = false) {
      while (arr.length > 0) {
        let node = arr.pop();
        if (node && node.x !== undefined && node.y !== undefined) {
          let i = Number(node.x);
          let j = Number(node.y);
          await new Promise((resolve) => {
            setTimeout(() => {
              if (
                document.getElementById(`${i},${j}`) &&
                document.getElementById(`${i},${j}`).style &&
                document.getElementById(`${i},${j}`).style.backgroundColor !==
                  "red" &&
                document.getElementById(`${i},${j}`).style.backgroundColor !==
                  "blue"
              ) {
                if (purple) {
                  if (
                    document.getElementById(`${i},${j}`).style
                      .backgroundColor === "#3399ff"
                  ) {
                    document.getElementById(`${i},${j}`).style.backgroundColor =
                      "red";
                  } else {
                    document.getElementById(`${i},${j}`).style.backgroundColor =
                      "rgb(153, 0, 255)";
                  }
                } else if (lblue) {
                  if (
                    document.getElementById(`${i},${j}`).style
                      .backgroundColor === "rgb(153, 0, 255)"
                  ) {
                    document.getElementById(`${i},${j}`).style.backgroundColor =
                      "red";
                  } else {
                    document.getElementById(`${i},${j}`).style.backgroundColor =
                      "#3399ff";
                  }
                }
              }
              resolve();
            }, 50);
          });
        }
      }
    }

    if (props.StastVis) {
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          if (
            document.getElementById(`${i},${j}`).style.backgroundColor !==
            "black"
          ) {
            document.getElementById(`${i},${j}`).style.backgroundColor =
              "white";
          }
        }
      }
      for (let i = 0; i < width; i++) {
        visitedNodes[i] = [];
        for (let j = 0; j < height; j++) {
          visitedNodes[i][j] = false;
        }
      }
      Visualize();
    }
  }, [props.StastVis]);

  return <div className="grid">{arrayOfNodes}</div>;
};

export default Grid;

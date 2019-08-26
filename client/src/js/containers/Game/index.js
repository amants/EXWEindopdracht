import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Home = () => {
  const [currentScore, setCurrentScore] = useState(0);
  const [isGameOver, setGameOver] = useState(false);
  const [focusedButton, setFocusedButton] = useState(1);
  console.log(setFocusedButton);
  let renderer, sun, scene;
  let sceneWidth;
  let sceneHeight;
  let camera;
  let dom;
  let rollingGroundSphere;
  let playerSphere;
  let rollingSpeed = 0.008;
  let playerRollingSpeed;
  let worldRadius = 26;
  let playerRadius = 0.2;
  let paused = false;
  let sphericalHelper;
  let pathAngleValues;
  let playerY = 2;
  let leftLane = -1;
  let rightLane = 1;
  let middleLane = 0;
  let currentLane;
  let clock;
  let treeReleaseInterval = 0.5;
  let treesInPath;
  let treesPool;

  const createScene = () => {
    treesInPath = [];
    treesPool = [];
    clock = new THREE.Clock();
    clock.start();
    playerRollingSpeed = (rollingSpeed * worldRadius) / playerRadius / 5;
    sphericalHelper = new THREE.Spherical();
    pathAngleValues = [1.52, 1.57, 1.62];
    sceneWidth = window.innerWidth;
    sceneHeight = window.innerHeight;
    scene = new THREE.Scene(); //the 3d scene
    scene.fog = new THREE.FogExp2(0x151515, 0.01);
    camera = new THREE.PerspectiveCamera(
      60,
      sceneWidth / sceneHeight,
      0.1,
      1000,
    ); //perspective camera
    renderer = new THREE.WebGLRenderer({ alpha: true }); //renderer with transparent backdrop
    renderer.setClearColor(0xfffafa, 1);
    renderer.shadowMap.enabled = true; //enable shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(sceneWidth, sceneHeight);
    dom = document.getElementById('gameContainer');
    dom.appendChild(renderer.domElement);
    //stats = new Stats();
    //dom.appendChild(stats.dom);
    createTreesPool();
    addSkyBox();
    addWorld();
    addPlayer();
    addLight();

    camera.position.z = 6.5;
    camera.position.y = 2.5;
    window.addEventListener('resize', onWindowResize, false); //resize callback

    document.onkeydown = handleKeyDown;
  };

  const createTreesPool = () => {
    let maxTreesInPool = 10;
    let newTree;
    for (let i = 0; i < maxTreesInPool; i++) {
      newTree = createTree();
      treesPool.push(newTree);
    }
  };

  const handleKeyDown = keyEvent => {
    if (keyEvent.keyCode === 37) {
      //left
      if (currentLane == middleLane) {
        currentLane = leftLane;
      } else if (currentLane == rightLane) {
        currentLane = middleLane;
      }
    } else if (keyEvent.keyCode === 39) {
      if (currentLane == middleLane) {
        currentLane = rightLane;
      } else if (currentLane == leftLane) {
        currentLane = middleLane;
      }
    }
  };

  const addPlayer = () => {
    let sphereGeometry = new THREE.DodecahedronGeometry(playerRadius, 1);
    let sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xffa500,
      shading: THREE.FlatShading,
    });
    playerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    playerSphere.receiveShadow = true;
    playerSphere.castShadow = true;
    scene.add(playerSphere);
    playerSphere.position.y = playerY;
    playerSphere.position.z = 4.6;
    currentLane = middleLane;
    playerSphere.position.x = currentLane;
  };

  const addSkyBox = () => {
    const geometry = new THREE.CubeGeometry(10000, 10000, 10000);
    const material = new THREE.MeshBasicMaterial({ color: 0xff4500 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  };

  const addWorld = () => {
    let sides = 100;
    let tiers = 100;
    let sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);
    let sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      shading: THREE.FlatShading,
    });

    let vertexIndex;
    let vertexVector = new THREE.Vector3();
    let nextVertexVector = new THREE.Vector3();
    let firstVertexVector = new THREE.Vector3();
    let offset = new THREE.Vector3();
    let currentTier = 1;
    let lerpValue = 0.5;
    let heightValue;
    let maxHeight = 0.07;
    for (let j = 1; j < tiers - 2; j++) {
      currentTier = j;
      for (let i = 0; i < sides; i++) {
        vertexIndex = currentTier * sides + 1;
        vertexVector = sphereGeometry.vertices[i + vertexIndex].clone();
        if (j % 2 !== 0) {
          if (i == 0) {
            firstVertexVector = vertexVector.clone();
          }
          nextVertexVector = sphereGeometry.vertices[
            i + vertexIndex + 1
          ].clone();
          if (i == sides - 1) {
            nextVertexVector = firstVertexVector;
          }
          lerpValue = Math.random() * (0.75 - 0.25) + 0.25;
          vertexVector.lerp(nextVertexVector, lerpValue);
        }
        heightValue = Math.random() * maxHeight - maxHeight / 2;
        offset = vertexVector
          .clone()
          .normalize()
          .multiplyScalar(heightValue);
        sphereGeometry.vertices[i + vertexIndex] = vertexVector.add(offset);
      }
    }
    rollingGroundSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    rollingGroundSphere.receiveShadow = true;
    rollingGroundSphere.castShadow = false;
    rollingGroundSphere.rotation.z = -Math.PI / 2;
    scene.add(rollingGroundSphere);
    rollingGroundSphere.position.y = -24;
    rollingGroundSphere.position.z = 2;
    addWorldTrees();
  };

  const addLight = () => {
    let hemisphereLight = new THREE.HemisphereLight(0xfffafa, 0x000000, 0.9);
    scene.add(hemisphereLight);
    sun = new THREE.DirectionalLight(0xcdc1c5, 0.9);
    sun.position.set(12, 6, -7);
    sun.castShadow = true;
    scene.add(sun);
    //Set up shadow properties for the sun light
    sun.shadow.mapSize.width = 256;
    sun.shadow.mapSize.height = 256;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 50;
  };

  const addPathTree = () => {
    let options = [0, 1, 2];
    let lane = Math.floor(Math.random() * 3);
    addTree(true, lane);
    options.splice(lane, 1);
    if (Math.random() > 0.5) {
      lane = Math.floor(Math.random() * 2);
      addTree(true, options[lane]);
    }
  };
  const addWorldTrees = () => {
    let numTrees = 36;
    let gap = 6.28 / 36;
    for (let i = 0; i < numTrees; i++) {
      addTree(false, i * gap, true);
      addTree(false, i * gap, false);
    }
  };
  const addTree = (inPath, row, isLeft) => {
    let newTree;
    if (inPath) {
      if (treesPool.length == 0) return;
      newTree = treesPool.pop();
      newTree.visible = true;
      //console.log("add tree");
      treesInPath.push(newTree);
      sphericalHelper.set(
        worldRadius - 0.3,
        pathAngleValues[row],
        -rollingGroundSphere.rotation.x + 4,
      );
    } else {
      newTree = createTree();
      let forestAreaAngle = 0; //[1.52,1.57,1.62];
      if (isLeft) {
        forestAreaAngle = 1.68 + Math.random() * 0.1;
      } else {
        forestAreaAngle = 1.46 - Math.random() * 0.1;
      }
      sphericalHelper.set(worldRadius - 0.3, forestAreaAngle, row);
    }
    newTree.position.setFromSpherical(sphericalHelper);
    let rollingGroundVector = rollingGroundSphere.position.clone().normalize();
    let treeVector = newTree.position.clone().normalize();
    newTree.quaternion.setFromUnitVectors(treeVector, rollingGroundVector);
    newTree.rotation.x += Math.random() * ((2 * Math.PI) / 10) + -Math.PI / 10;

    rollingGroundSphere.add(newTree);
  };
  const createTree = () => {
    let treeGeometry = new THREE.CubeGeometry(2, 2, 2);
    let treeMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4500,
      shading: THREE.FlatShading,
    });
    let treeTop = new THREE.Mesh(treeGeometry, treeMaterial);
    treeTop.receiveShadow = true;
    treeTop.position.y = 3;
    treeTop.rotation.y = Math.random() * Math.PI;
    let treeTrunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 5);
    let trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x886633,
      shading: THREE.FlatShading,
    });
    let treeTrunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);
    treeTrunk.position.y = 0;
    let tree = new THREE.Object3D();
    tree.add(treeTrunk);
    tree.add(treeTop);
    return tree;
  };

  const update = () => {
    //stats.update();
    //animate
    if (!paused) {
      rollingGroundSphere.rotation.x += rollingSpeed;
      playerSphere.rotation.x -= playerRollingSpeed;
      playerSphere.position.x = THREE.Math.lerp(
        playerSphere.position.x,
        currentLane,
        2 * clock.getDelta(),
      ); //clock.getElapsedTime());
      if (clock.getElapsedTime() > treeReleaseInterval) {
        clock.start();
        addPathTree();
      }
      doTreeLogic();
      render();
      requestAnimationFrame(update); //request next update
    }
  };

  const doTreeLogic = () => {
    let oneTree;
    let treePos = new THREE.Vector3();
    let treesToRemove = [];
    treesInPath.forEach((element, index) => {
      oneTree = treesInPath[index];
      treePos.setFromMatrixPosition(oneTree.matrixWorld);
      if (treePos.z > 6 && oneTree.visible) {
        //gone out of our view zone
        treesToRemove.push(oneTree);
      } else {
        //check collision
        if (treePos.distanceTo(playerSphere.position) <= 0.6) {
          gameOver();
        }
      }
    });
    let fromWhere;
    treesToRemove.forEach((element, index) => {
      oneTree = treesToRemove[index];
      fromWhere = treesInPath.indexOf(oneTree);
      treesInPath.splice(fromWhere, 1);
      treesPool.push(oneTree);
      oneTree.visible = false;
      if (currentScore === 20) {
        rollingSpeed *= 10;
      }
      if (currentScore === 40) {
        rollingSpeed *= 1.3;
      }
      if (currentScore === 60) {
        rollingSpeed *= 1.3;
      }
      setCurrentScore(prevCurrentScore => (prevCurrentScore += 1));
      console.log('remove tree');
    });
  };

  const render = () => {
    renderer.render(scene, camera); //draw
  };

  const gameOver = () => {
    paused = true;
    console.log('game over');
    setGameOver(true);
    // window.clearInterval(powerupSpawnIntervalID);
  };

  const onWindowResize = () => {
    //resize & align
    sceneHeight = window.innerHeight;
    sceneWidth = window.innerWidth;
    renderer.setSize(sceneWidth, sceneHeight);
    camera.aspect = sceneWidth / sceneHeight;
    camera.updateProjectionMatrix();
  };

  const init = () => {
    createScene();
    update();
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <Container>
      {isGameOver ? (
        <GameOverScreen>
          <TitleContainer>
            <Title>The Game</Title>
            <Username>Game over</Username>
          </TitleContainer>
          <ButtonContainer>
            <Button
              className={`${focusedButton === 1 ? `focused` : ``} start_game`}
              to="/game"
            >
              Play again
            </Button>
            <Button
              className={`${focusedButton === 3 ? `focused` : ``} namechange`}
              to="/hiscores"
            >
              Highscores
            </Button>
            <Button
              className={`${focusedButton === 2 ? `focused` : ``} highscores`}
              to="/menu"
            >
              Menu
            </Button>
          </ButtonContainer>
        </GameOverScreen>
      ) : null}
      <Score>
        <CurrentScore>{currentScore}</CurrentScore>
      </Score>
      <GameContainer id="gameContainer" />
    </Container>
  );
};

const TitleContainer = styled.div`
  position: absolute;
  top: 4rem;
  text-transform: uppercase;
  flex: 0 0 auto;
  max-width: 80rem;
  border-radius: 1rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.65);
`;

const Username = styled.h2`
  position: relative;
  margin-top: -1rem;
  font-size: 4rem;
  background-color: orange;
  padding: 1rem 3rem;
  border-radius: 0 0 1rem 1rem;
  display: 0 0 auto;
  flex-grow: 0;
  font-weight: 900;
  flex-shrink: 0;
`;

const Title = styled.h1`
  background: orangered;
  font-weight: 900;
  text-transform: uppercase;
  border-radius: 1rem;
  padding: 2rem 4rem;
  padding-top: 1rem;
  flex: 0 0 auto;
  max-width: 100%;
`;

const Button = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.65);
  height: 6rem;
  font-size: 3rem;
  border-radius: 1rem;
  margin: 2rem;
  text-transform: uppercase;
  text-decoration: none;
  color: white;
  font-weight: 900;
  width: 40rem;
  background-color: orangered;
  transition: all 0.2s ease;
  cursor: none;

  &.focused {
    border: 0.5rem solid orange;
    transform: scale(1.1);
  }
`;

const CurrentScore = styled.h3`
  font-size: 4rem;
  font-weight: 900;
  color: #151515;
`;

const GameOverScreen = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Score = styled.div`
  position: absolute;
  top: 4rem;
  right: 4rem;
  z-index: 100;
`;

const ButtonContainer = styled.div``;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  bottom: 0;
  background-color: #151515;
`;

const GameContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export default Home;

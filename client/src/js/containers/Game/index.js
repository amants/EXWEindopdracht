import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import { useFocus } from 'joystick-react';
import { Link } from 'react-router-dom';

// Store
import {
  buttonMapping,
  setHighscore,
  getLastHighScore,
} from '../../store/index';

// Components
import ButtonLegend from '../../components/ButtonLegend';

// Images
import earthImage from '../../../assets/img/earthmap.jpg';
import earthBumpImage from '../../../assets/img/earthbump.jpg';
import earthSpecImage from '../../../assets/img/earthspec.jpg';

const Home = () => {
  const [currentScore, setCurrentScore] = useState(0);
  const [isGameOver, setGameOver] = useState(false);
  const [isPaused, setPaused] = useState(false);
  const [focusedButton, setFocusedButton] = useState(1);
  const [lastHighScore, setLastHighScore] = useState(getLastHighScore());
  let renderer,
    sun,
    scene,
    sceneWidth,
    sceneHeight,
    isGameOverNoState,
    isPausedNoState,
    camera,
    dom,
    rollingGroundSphere,
    playerSphere,
    playerRollingSpeed,
    sphericalHelper,
    pathAngleValuesRocks,
    currentLane,
    clock,
    rocksInPath,
    rocksPool,
    rollingSpeed = 0.008,
    worldRadius = 26,
    playerRadius = 0.2,
    playerY = 4.35,
    leftLane = -1.6,
    rightLane = 1.6,
    middleLane = 0,
    rockReleaseInterval = 0.5,
    focusedFieldNoState = focusedButton;

  const { isFocused, ref } = useFocus(gamepadEvent => {
    const buttonss = isGameOverNoState
      ? [document.querySelector(`.menu`), document.querySelector(`.highscores`)]
      : [document.querySelector(`.resume`), document.querySelector(`.menu`)];
    if (buttonMapping[gamepadEvent.keyCode] === 'PAUSE') {
      if (!isGameOverNoState) {
        setPaused(prevPaused => {
          isPausedNoState = !prevPaused;
          return !prevPaused;
        });
      }
    }
    if (buttonMapping[gamepadEvent.keyCode] === 'O') {
      if (!isGameOverNoState && isPausedNoState) {
        setPaused(prevPaused => {
          isPausedNoState = !prevPaused;
          return !prevPaused;
        });
      }
    }
    if (buttonMapping[gamepadEvent.keyCode] === 'LEFT') {
      if (!isPausedNoState) {
        handleButtonPressed('LEFT');
      }
    }
    if (buttonMapping[gamepadEvent.keyCode] === 'RIGHT') {
      if (!isPausedNoState) {
        handleButtonPressed('RIGHT');
      }
    }
    if (buttonMapping[gamepadEvent.keyCode] === 'UP') {
      const tempFieldFocus = focusedFieldNoState;
      buttonss.map((key, i) => {
        if (i === focusedButton) {
          if (focusedFieldNoState <= 1) {
            focusedFieldNoState = buttonss.length;
            setFocusedButton(buttonss.length);
          } else {
            focusedFieldNoState = tempFieldFocus - 1;
            setFocusedButton(
              prevFocusedButton => parseInt(prevFocusedButton) - 1,
            );
          }
        }
      });
    }
    if (buttonMapping[gamepadEvent.keyCode] === 'DOWN') {
      const tempFieldFocus = focusedFieldNoState;
      buttonss.map((key, i) => {
        if (i === focusedButton) {
          if (focusedFieldNoState === buttonss.length) {
            focusedFieldNoState = 1;
            setFocusedButton(1);
          } else {
            focusedFieldNoState = tempFieldFocus + 1;
            setFocusedButton(
              prevFocusedButton => parseInt(prevFocusedButton) + 1,
            );
          }
        }
      });
    }
    if (buttonMapping[gamepadEvent.keyCode] === 'X') {
      const tempFieldFocus = focusedFieldNoState;
      if (buttonss[tempFieldFocus - 1].classList.contains('resume')) {
        setPaused(prevPaused => {
          isPausedNoState = !prevPaused;
          return !prevPaused;
        });
      } else {
        buttonss[tempFieldFocus - 1].click();
      }
    }
  });

  const createScene = () => {
    rocksInPath = [];
    rocksPool = [];
    clock = new THREE.Clock();
    clock.start();
    playerRollingSpeed = (rollingSpeed * worldRadius) / playerRadius / 5;
    sphericalHelper = new THREE.Spherical();
    pathAngleValuesRocks = [1.53, 1.57, 1.61];
    sceneWidth = window.innerWidth;
    sceneHeight = window.innerHeight;
    scene = new THREE.Scene(); //the 3d scene
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
    createrocksPool();
    addWorld();
    addPlayer();
    addLight();

    camera.position.z = 6.5;
    camera.position.y = 4;
    window.addEventListener('resize', onWindowResize, false); //resize callback
  };

  const createrocksPool = () => {
    let maxRocksInPool = 10;
    let newRock;
    for (let i = 0; i < maxRocksInPool; i++) {
      newRock = createRock();
      rocksPool.push(newRock);
    }
  };

  const handleButtonPressed = event => {
    if (event === 'LEFT') {
      //left
      if (currentLane == middleLane) {
        currentLane = leftLane;
      } else if (currentLane == rightLane) {
        currentLane = middleLane;
      }
    } else if (event === 'RIGHT') {
      if (currentLane == middleLane) {
        currentLane = rightLane;
      } else if (currentLane == leftLane) {
        currentLane = middleLane;
      }
    }
  };

  const addPlayer = () => {
    let sphereGeometry = new THREE.SphereGeometry(playerRadius, 32, 32);
    let sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0xffa500,
      flatShading: THREE.FlatShading,
    });
    playerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    playerSphere.receiveShadow = true;
    playerSphere.castShadow = true;
    playerSphere.position.y = playerY;
    playerSphere.position.z = 4.6;
    currentLane = middleLane;
    playerSphere.position.x = currentLane;
    scene.add(playerSphere);
  };

  const addWorld = () => {
    let sphereGeometry = new THREE.SphereGeometry(worldRadius, 100, 100);
    let sphereMaterial = new THREE.MeshPhongMaterial();
    sphereMaterial.map = THREE.ImageUtils.loadTexture(earthImage);
    sphereMaterial.bumpMap = THREE.ImageUtils.loadTexture(earthBumpImage);
    sphereMaterial.bumpScale = 0.05;
    sphereMaterial.specularMap = THREE.ImageUtils.loadTexture(earthSpecImage);
    sphereMaterial.specular = new THREE.Color('grey');
    rollingGroundSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    rollingGroundSphere.receiveShadow = true;
    rollingGroundSphere.castShadow = false;
    rollingGroundSphere.rotation.z = -Math.PI / 2;
    scene.add(rollingGroundSphere);
    rollingGroundSphere.position.y = -24;
    rollingGroundSphere.position.z = 2;
  };

  const addLight = () => {
    let hemisphereLight = new THREE.HemisphereLight(0xfffafa, 0x000000, 0.9);
    scene.add(hemisphereLight);
    sun = new THREE.DirectionalLight(0xcdc1c5, 0.9);
    sun.position.set(12, 6, -7);
    sun.castShadow = true;
    scene.add(sun);
    sun.shadow.mapSize.width = 256;
    sun.shadow.mapSize.height = 256;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 50;
  };

  const addRockObstacle = () => {
    let options = [0, 1, 2];
    let lane = Math.floor(Math.random() * 3);
    addRock(true, lane);
    options.splice(lane, 1);
    if (Math.random() > 0.5) {
      lane = Math.floor(Math.random() * 2);
      addRock(true, options[lane]);
    }
  };

  const addRock = (inPath, row) => {
    let newRock;
    if (rocksPool.length == 0) return;
    newRock = rocksPool.pop();
    newRock.visible = true;
    rocksInPath.push(newRock);
    sphericalHelper.set(
      worldRadius + 2.5,
      pathAngleValuesRocks[row],
      -rollingGroundSphere.rotation.x + 4,
    );
    newRock.position.setFromSpherical(sphericalHelper);
    let rollingGroundVector = rollingGroundSphere.position.clone().normalize();
    let rockVector = newRock.position.clone().normalize();
    newRock.quaternion.setFromUnitVectors(rockVector, rollingGroundVector);
    newRock.rotation.x += Math.random() * ((2 * Math.PI) / 10) + -Math.PI / 10;

    rollingGroundSphere.add(newRock);
  };
  const createRock = () => {
    let rockGeometry = new THREE.SphereGeometry(0.2, 10, 15);
    let rockMaterial = new THREE.MeshStandardMaterial({
      color: 0x151515,
      flatShading: THREE.FlatShading,
    });
    let rockItem = new THREE.Mesh(rockGeometry, rockMaterial);
    rockItem.receiveShadow = true;
    rockItem.position.y = 0;
    rockItem.rotation.y = Math.random() * Math.PI;
    let rock = new THREE.Object3D();
    rock.add(rockItem);
    return rock;
  };

  const update = () => {
    if (isPausedNoState === undefined) isPausedNoState = false;
    if (isGameOverNoState === undefined) isGameOverNoState = false;
    rollingGroundSphere.rotation.x +=
      isPausedNoState || isGameOverNoState ? 0 : rollingSpeed;
    playerSphere.rotation.x -=
      isPausedNoState || isGameOverNoState ? 0 : playerRollingSpeed;
    playerSphere.position.x = THREE.Math.lerp(
      playerSphere.position.x,
      currentLane,
      2 * clock.getDelta(),
    ); //clock.getElapsedTime());
    if (!(isPausedNoState || isGameOverNoState)) {
      if (clock.getElapsedTime() > rockReleaseInterval) {
        clock.start();
        addRockObstacle();
      }
    }
    doRockLogic();
    render();
    if (!isGameOverNoState) requestAnimationFrame(update); //request next update
  };

  const doRockLogic = () => {
    let oneRock;
    let rockPos = new THREE.Vector3();
    let rocksToRemove = [];
    rocksInPath.forEach((element, index) => {
      oneRock = rocksInPath[index];
      rockPos.setFromMatrixPosition(oneRock.matrixWorld);
      if (rockPos.z > 6 && oneRock.visible) {
        //gone out of our view zone
        rocksToRemove.push(oneRock);
      } else {
        //check collision
        if (rockPos.distanceTo(playerSphere.position) <= 0.38) {
          gameOver();
        }
      }
    });
    let fromWhere;
    rocksToRemove.forEach((element, index) => {
      oneRock = rocksToRemove[index];
      fromWhere = rocksInPath.indexOf(oneRock);
      rocksInPath.splice(fromWhere, 1);
      rocksPool.push(oneRock);
      oneRock.visible = false;
      setCurrentScore(prevCurrentScore => (prevCurrentScore += 1));
    });
  };

  const render = () => {
    renderer.render(scene, camera); //draw
  };

  const gameOver = () => {
    setGameOver(true);
    setCurrentScore(prevCurrentScore => {
      setHighscore(prevCurrentScore);
      setLastHighScore(prevCurrentScore);
      return prevCurrentScore;
    });
    isGameOverNoState = true;
  };

  const onWindowResize = () => {
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
  console.log(isFocused);
  return (
    <Container ref={ref}>
      {isGameOver ? (
        <GameOverScreen>
          <TitleContainer>
            <Title>The Game</Title>
            <Username>Game over</Username>
          </TitleContainer>
          <ButtonContainer>
            <Button
              className={`${focusedButton === 1 ? `focused` : ``} menu`}
              to="/menu"
            >
              Menu
            </Button>
            <Button
              className={`${focusedButton === 2 ? `focused` : ``} highscores`}
              to="/highscores"
            >
              Highscores
            </Button>
          </ButtonContainer>
          <ButtonLegend
            up
            down
            autohide={false}
            arrows="Use the arrow keys to navigate the menu"
            x="Confirm"
          />
        </GameOverScreen>
      ) : null}
      {isPaused ? (
        <GameOverScreen>
          <TitleContainer>
            <Title>The Game</Title>
            <Username>Paused</Username>
          </TitleContainer>
          <ButtonContainer>
            <Button
              className={`${focusedButton === 1 ? `focused` : ``} resume`}
              to="/menu"
              onClick={e => {
                e.preventDefault();
              }}
            >
              Resume
            </Button>
            <Button
              className={`${focusedButton === 2 ? `focused` : ``} menu`}
              to="/menu"
            >
              Menu
            </Button>
          </ButtonContainer>
          <ButtonLegend
            up
            down
            autohide={false}
            arrows="Use the arrow keys to navigate the menu"
            x="Confirm"
            o="Resume game"
          />
        </GameOverScreen>
      ) : null}
      <Score>
        <CurrentScore>Score: {currentScore}</CurrentScore>
        <HighScore>Highscore: {lastHighScore}</HighScore>
      </Score>
      <GameContainer id="gameContainer" />
      <ButtonLegend
        left
        right
        autohide={true}
        arrows="Use the arrow keys to move left and right"
        start="Pause game"
      />
    </Container>
  );
};

const HighScore = styled.h5`
  font-size: 2rem;
  margin-top: 0.5rem;
`;

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
  padding: 2rem;
  background: white;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.65);
  border-radius: 1rem;
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

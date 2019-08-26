import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
const Home = () => {
  const [currentScore, setCurrentScore] = useState(0);
  let renderer, sun, scene;
  let sceneWidth;
  let sceneHeight;
  let camera;
  let dom;
  let renderID;
  let rollingGroundSphere;
  let heroSphere;
  let rollingSpeed = 0.008;
  let heroRollingSpeed;
  let worldRadius = 26;
  let heroRadius = 0.2;
  let paused = false;
  let sphericalHelper;
  let pathAngleValues;
  let heroBaseY = 1.8;
  let bounceValue = 0.1;
  let gravity = 0.005;
  let leftLane = -1;
  let rightLane = 1;
  let middleLane = 0;
  let currentLane;
  let clock;
  let treeReleaseInterval = 0.5;
  let treesInPath;
  let treesPool;
  let particleGeometry;
  let particleCount = 30;
  let explosionPower = 1.06;
  let particles;

  const createScene = () => {
    treesInPath = [];
    treesPool = [];
    clock = new THREE.Clock();
    clock.start();
    heroRollingSpeed = (rollingSpeed * worldRadius) / heroRadius / 5;
    sphericalHelper = new THREE.Spherical();
    pathAngleValues = [1.52, 1.57, 1.62];
    sceneWidth = window.innerWidth;
    sceneHeight = window.innerHeight;
    scene = new THREE.Scene(); //the 3d scene
    scene.fog = new THREE.FogExp2(0x151515, 0.1);
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
    addHero();
    addLight();
    addExplosion();

    camera.position.z = 6.5;
    camera.position.y = 2.5;
    window.addEventListener('resize', onWindowResize, false); //resize callback

    document.onkeydown = handleKeyDown;
  };

  const addExplosion = () => {
    particleGeometry = new THREE.Geometry();
    for (let i = 0; i < particleCount; i++) {
      let vertex = new THREE.Vector3();
      particleGeometry.vertices.push(vertex);
    }
    let pMaterial = new THREE.ParticleBasicMaterial({
      color: 0xfffafa,
      size: 0.2,
    });
    particles = new THREE.Points(particleGeometry, pMaterial);
    scene.add(particles);
    particles.visible = false;
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
    console.log('test');
    let validMove = true;
    if (keyEvent.keyCode === 37) {
      //left
      if (currentLane == middleLane) {
        currentLane = leftLane;
      } else if (currentLane == rightLane) {
        currentLane = middleLane;
      } else {
        validMove = false;
      }
    } else if (keyEvent.keyCode === 39) {
      //right
      if (currentLane == middleLane) {
        currentLane = rightLane;
      } else if (currentLane == leftLane) {
        currentLane = middleLane;
      } else {
        validMove = false;
      }
    } else {
      if (keyEvent.keyCode === 38) {
        //up, jump
        bounceValue = 0.1;
      }
      validMove = false;
    }
    //heroSphere.position.x=currentLane;
    if (validMove) {
      bounceValue = 0.06;
    }
  };

  const addHero = () => {
    let sphereGeometry = new THREE.DodecahedronGeometry(heroRadius, 1);
    let sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xff8000,
      shading: THREE.FlatShading,
    });
    heroSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    heroSphere.receiveShadow = true;
    heroSphere.castShadow = true;
    scene.add(heroSphere);
    heroSphere.position.y = heroBaseY;
    heroSphere.position.z = 4.8;
    currentLane = middleLane;
    heroSphere.position.x = currentLane;
  };

  const addSkyBox = () => {
    const geometry = new THREE.CubeGeometry(10000, 10000, 10000);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  };

  const addWorld = () => {
    let sides = 40;
    let tiers = 40;
    let sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);
    let sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x151515,
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
      color: 0x00ff00,
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
    treeTrunk.position.y = 0.25;
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
      heroSphere.rotation.x -= heroRollingSpeed;
      if (heroSphere.position.y <= heroBaseY) {
        bounceValue = Math.random() * 0.04 + 0.005;
      }
      heroSphere.position.y += bounceValue;
      heroSphere.position.x = THREE.Math.lerp(
        heroSphere.position.x,
        currentLane,
        2 * clock.getDelta(),
      ); //clock.getElapsedTime());
      bounceValue -= gravity;
      if (clock.getElapsedTime() > treeReleaseInterval) {
        clock.start();
        addPathTree();
      }
      doTreeLogic();
      doExplosionLogic();
      render();
      renderID = requestAnimationFrame(update); //request next update
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
        if (treePos.distanceTo(heroSphere.position) <= 0.6) {
          gameOver();
          explode();
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
      setCurrentScore(prevCurrentScore => (prevCurrentScore += 1));
      console.log('remove tree');
    });
  };

  const doExplosionLogic = () => {
    if (!particles.visible) return;
    for (let i = 0; i < particleCount; i++) {
      particleGeometry.vertices[i].multiplyScalar(explosionPower);
    }
    if (explosionPower > 1.005) {
      explosionPower -= 0.001;
    } else {
      particles.visible = false;
    }
    particleGeometry.verticesNeedUpdate = true;
  };
  const explode = () => {
    particles.position.y = 2;
    particles.position.z = 4.8;
    particles.position.x = heroSphere.position.x;
    for (let i = 0; i < particleCount; i++) {
      let vertex = new THREE.Vector3();
      vertex.x = -0.2 + Math.random() * 0.4;
      vertex.y = -0.2 + Math.random() * 0.4;
      vertex.z = -0.2 + Math.random() * 0.4;
      particleGeometry.vertices[i] = vertex;
    }
    explosionPower = 1.07;
    particles.visible = true;
  };

  const render = () => {
    renderer.render(scene, camera); //draw
  };

  const gameOver = () => {
    paused = true;
    console.log('game over', renderID);
    cancelAnimationFrame(renderID);
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
      <Score>
        <CurrentScore>{currentScore}</CurrentScore>
      </Score>
      <GameContainer id="gameContainer" />
    </Container>
  );
};

const CurrentScore = styled.h3`
  font-size: 4rem;
  font-weight: 900;
  color: #151515;
`;

const Score = styled.div`
  position: absolute;
  top: 4rem;
  right: 4rem;
  z-index: 999;
`;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
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

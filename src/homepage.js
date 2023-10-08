import { Suspense, useMemo, useRef, useEffect, useState } from 'react';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import { Environment, GizmoHelper, GizmoViewport, OrbitControls, Center, PerspectiveCamera, Text3D } from '@react-three/drei';
import { Html, useProgress, Effects } from '@react-three/drei';
import niceColors from 'nice-color-palettes';
import { EffectComposer, N8AO, SSAO } from "@react-three/postprocessing"

import * as THREE from 'three';
THREE.ColorManagement.legacyMode = false


function Loader() {
  const { progress } = useProgress()
  return <Html className="text-white text-4xl" center>{progress} % loaded</Html>
}

function Header(props) {
    return (
        <div className="flex flex-row space justify-between p-4 sticky z-40 w-full backdrop-blur transition-colors duration-500 bg-white supports-backdrop-blur:bg-white/95 dark:bg-slate-700/60">

            <div className="flex flex-row center items-center outline outline-1 outline-gray-400 rounded-3xl shadow-sm shadow-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E5E7EA" className="w-6 h-6 my-1 mx-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            </div>

            <div className="flex flex-row">
                <div className="flex flex-row center outline outline-1 outline-gray-400 rounded-3xl items-center shadow-md shadow-black mx-4" onClick={() => console.log("")}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E5E7EA" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                    </svg>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E5E7EA" className="w-6 h-6 my-1 mx-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                </div>

                <div className="flex flex-row center outline outline-1 outline-gray-400 rounded-3xl items-center shadow-md shadow-black mx-4" onClick={() => console.log("")}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E5E7EA" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                    </svg>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E5E7EA" className="w-6 h-6 my-1 mx-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                    </svg>
                </div>

                <div className="flex flex-row center outline outline-1 outline-gray-400 rounded-3xl items-center shadow-md shadow-black mx-4" onClick={() => console.log("")}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E5E7EA" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                    </svg>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E5E7EA" className="w-6 h-6 my-1 mx-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                    </svg>
                </div>
            </div>

            <div className="flex flex-row center outline outline-1 outline-gray-400 rounded-3xl items-center shadow-sm shadow-black">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E5E7EA" className="w-5 h-5 my-1 mx-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#E5E7EA" className="w-8 h-8 m-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>
        </div>
    );
}

function Cell(props) {
    const x = props.position[0];
    const y = props.position[1];
    const z = props.position[2];
    const thickness = .015;
    var length = 1;
    const lineSpread = length/2;
    length += thickness;
    const color = "#6d6875";
    const wireMaterial = new THREE.MeshLambertMaterial({ color: color, emissive: color });
    const castShadow = false;
    const receiveShadow = false;
    return <>
        <mesh position={[0+x, -lineSpread+y, -lineSpread+z]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        material={wireMaterial}
        >
            <boxGeometry args={[length, thickness, thickness]} />
        </mesh>
        <mesh position={[0+x, lineSpread+y, -lineSpread+z]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        material={wireMaterial}
        >
            <boxGeometry args={[length, thickness, thickness]} />
        </mesh>
        <mesh position={[0+x, -lineSpread+y, lineSpread+z]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        material={wireMaterial}
        >
            <boxGeometry args={[length, thickness, thickness]} />
        </mesh>
        <mesh position={[0+x, lineSpread+y, lineSpread+z]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        material={wireMaterial}
        >
            <boxGeometry args={[length, thickness, thickness]} />
        </mesh>

        <mesh position={[-lineSpread+x, 0+y, lineSpread+z]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        material={wireMaterial}
        >
            <boxGeometry args={[thickness, length, thickness]} />
        </mesh>
        <mesh position={[lineSpread+x, 0+y, lineSpread+z]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        material={wireMaterial}
        >
            <boxGeometry args={[thickness, length, thickness]} />
        </mesh>
        <mesh position={[-lineSpread+x, 0+y, -lineSpread+z]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        material={wireMaterial}
        >
            <boxGeometry args={[thickness, length, thickness]} />
        </mesh>
        <mesh position={[lineSpread+x, 0+y, -lineSpread+z]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        material={wireMaterial}
        >
            <boxGeometry args={[thickness, length, thickness]} />
        </mesh>

        <mesh position={[lineSpread+x, -lineSpread+y, 0+z]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        material={wireMaterial}
        >
            <boxGeometry args={[thickness, thickness, length]} />
        </mesh>
        <mesh position={[-lineSpread+x, -lineSpread+y, 0+z]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        material={wireMaterial}
        >
            <boxGeometry args={[thickness, thickness, length]} />
        </mesh>
        <mesh position={[lineSpread+x, lineSpread+y, 0+z]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        material={wireMaterial}
        >
            <boxGeometry args={[thickness, thickness, length]} />
        </mesh>
        <mesh position={[-lineSpread+x, lineSpread+y, 0+z]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        material={wireMaterial}
        >
            <boxGeometry args={[thickness, thickness, length]} />
        </mesh>
    </>;
}

/*
function Boxes() {
    const meshRef = useRef()
    const tempObject = new THREE.Object3D()
    let cellCount = 4**3;
    const thickness = .015;
    var length = 1;
    const lineSpread = length/2;
    length += thickness;

    useFrame((state) => {
      let i = 0
      for (let x = Math.floor(-Math.pow(cellCount, 1/3)/2); x < Math.floor(Math.pow(cellCount, 1/3)/2); x++){
        for (let y = Math.floor(-Math.pow(cellCount, 1/3)/2); y < Math.floor(Math.pow(cellCount, 1/3)/2); y++){
            for (let z = Math.floor(-Math.pow(cellCount, 1/3)/2); z < Math.floor(Math.pow(cellCount, 1/3)/2); z++){
                for (let e=0; e<12; e++) {
                    const id = i++;
                    tempObject.rotation.x = 0;
                    tempObject.rotation.y = 0;
                    tempObject.rotation.z = 0;
                    if (e%3===0) {
                        if (e%4===0) {
                            tempObject.position.set(0+x, lineSpread+y, lineSpread+z)
                        }else if (e%4===1) {
                            tempObject.position.set(0+x, lineSpread+y, -lineSpread+z)
                        }else if (e%4===2) {
                            tempObject.position.set(0+x, -lineSpread+y, lineSpread+z)
                        }else if (e%4===3) {
                            tempObject.position.set(0+x, -lineSpread+y, -lineSpread+z)
                        }
                    }else if(e%3===1) {
                        tempObject.rotation.z = Math.PI/2;
                        if (e%4===0) {
                            tempObject.position.set(lineSpread+x, 0+y, lineSpread+z)
                        }else if (e%4===1) {                    
                            tempObject.position.set(lineSpread+x, 0+y, -lineSpread+z)
                        }else if (e%4===2) {                    
                            tempObject.position.set(-lineSpread+x, 0+y, lineSpread+z)
                        }else if (e%4===3) {                    
                            tempObject.position.set(-lineSpread+x, 0+y, -lineSpread+z)
                        }
                    }else if(e%3===2) {
                        tempObject.rotation.y = Math.PI/2;
                        if (e%4===0) {
                            tempObject.position.set(lineSpread+x, lineSpread+y, 0+z)
                        }else if (e%4===1) {                    
                            tempObject.position.set(lineSpread+x, -lineSpread+y, 0+z)
                        }else if (e%4===2) {                    
                            tempObject.position.set(-lineSpread+x, lineSpread+y, 0+z)
                        }else if (e%4===3) {                    
                            tempObject.position.set(-lineSpread+x, -lineSpread+y, 0+z)
                        }
                    }
                    tempObject.updateMatrix();
                    meshRef.current.setMatrixAt(id, tempObject.matrix);
                }
            }
        }
    }
      meshRef.current.instanceMatrix.needsUpdate = true
    })

    return (
      <instancedMesh
        castShadow
        receiveShadow
        ref={meshRef}
        args={[null, null, cellCount*12]}>
        <boxGeometry args={[length, thickness, thickness]} />

        <meshBasicMaterial toneMapped={false} vertexColors />
      </instancedMesh>
    )
  }
const baubleMaterial = new THREE.MeshLambertMaterial({ color: "#c0a0a0", emissive: "red" })
<meshBasicMaterial color={niceColors[17][Math.floor(Math.random() * 5)]}/>
*/

function Cells(props) {
    let programState = props.programState;
    let toRender = [];
    const sizeZ = programState.length;
    const sizeY = programState[0].length;
    const sizeX = programState[0][0].length;
    for (let x=0; x<sizeX; x++) {
        for (let y=0; y<sizeY; y++) {
            for (let z=0; z<sizeZ; z++) {
                toRender.push(<Cell position={[x,y,z]}/>);
                if (programState[z][y][x]!=="") {
                    toRender.push(
                    <Text3D
                        castShadow = {false}
                        receiveShadow = {false}
                        position={[x-.2, y-.275, z-.1]}
                        curveSegments={500}
                        bevelEnabled
                        bevelSize={0.01}
                        bevelThickness={0.1}
                        height={0.01}
                        lineHeight={0.5}
                        size={.7}
                        font="/Inter_Bold.json"
                        material={new THREE.MeshLambertMaterial({ color: niceColors[17][Math.floor(Math.random() * 5)], emissive: niceColors[17][Math.floor(Math.random() * 5)] })}
                        >
                        {programState[z][y][x]}
                    </Text3D>
                    );
                }
            }
        }
    }
    return toRender;
}

let exampleState = [[["I", "l"],["n","y"]],[["",""],["!","."]]];
/*

            <mesh position={[0, -2, 0]}
            castShadow 
            receiveShadow
            material={new THREE.MeshLambertMaterial({ color: "white", emissive: "white" })}
            >
                <boxGeometry args={[10, .1, 10]} />
            </mesh>
            */

function Scene(props) {
    return (
        <>
            <PerspectiveCamera
                makeDefault
                fov={75}
                near={0.1}
                far={100}
                position={[0, 10, 0]}
                rotation={[-0.6, 0, 0]}/>
            <OrbitControls />
            <Cells programState={exampleState} />
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
            </GizmoHelper>
        </>
    );
}


// #1c2e4a #f0f0f0 
function HomePage() {
    return (
    <div className="flex flex-row">
        <main role="main" className="w-screen h-screen">
            <div className="h-screen w-screen absolute top-0 left-0">
                <Header/>
            </div>
            <div className="h-screen w-screen absolute top-0 left-0">
                <Canvas camera={{ near: 1, far: 40}}
                shadows
                gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
                onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
                >
                    <color attach="background" args={['#f0f0f0']} />
                    <ambientLight intensity={0.5} />
                    <directionalLight castShadow position={[2.5, 8, 5]} intensity={1.5} shadow-mapSize={1024}>
                        <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10, 0.1, 50]} />
                    </directionalLight>
                    <pointLight position={[-10, 0, -20]} color="white" intensity={1} />
                    <pointLight position={[0, -10, 0]} intensity={1} />
                    <Scene/>
                    <Environment files={"../adams_place_bridge_4k.exr"} background blur={.50}/>
                    <EffectComposer disableNormalPass multisampling={0}>
                        <N8AO color="white" aoRadius={2} intensity={1} />
                        <SSAO />
                    </EffectComposer>
                </Canvas>
            </div>
        </main>
    </div>
    );
}

export default HomePage;
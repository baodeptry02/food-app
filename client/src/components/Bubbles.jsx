import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";

const o = new THREE.Object3D();

const Bubbles = ({
  count = 300,
  speed = 5,
  bubbleSize = 0.05,
  opacity = 0.5,
  repeat = true,
}) => {
  const meshRef = useRef(null);

  const bubbleSpeed = useRef(new Float32Array(count));
  const minSpeed = speed * 0.001;
  const maxSpeed = speed * 0.005;

  const geometry = new THREE.SphereGeometry(bubbleSize, 16, 16);

  const material = new THREE.MeshStandardMaterial({
    transparent: true,
    opacity,
  });

  useEffect(() => {
    // Access the instanced mesh
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    for (let i = 0; i < count; i++) {
      o.position.set(
        gsap.utils.random(-4, 4),
        gsap.utils.random(-4, 4),
        gsap.utils.random(-4, 4)
      );

      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);

      bubbleSpeed.current[i] = gsap.utils.random(minSpeed, maxSpeed);
    }

    mesh.instanceMatrix.needsUpdate = true;
    return () => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    };
  }, [count, minSpeed, maxSpeed]);

  useFrame(() => {
    if (!meshRef.current) {
      return;
    }

    material.color = new THREE.Color(document.body.style.backgroundColor);

    for (let i = 0; i < count; i++) {
      meshRef.current.getMatrixAt(i, o.matrix);
      o.position.setFromMatrixPosition(o.matrix);
      o.position.y += bubbleSpeed.current[i];

      if (o.position.y > 4 && repeat) {
        o.position.y = -2; // Reset to bottom
        o.position.x = gsap.utils.random(-4, 4);
        o.position.z = gsap.utils.random(0, 8);
      }

      o.updateMatrix();
      meshRef.current.setMatrixAt(i, o.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      position={[0, 0, 0]}
    />
  );
};

export default Bubbles;

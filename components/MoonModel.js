"use client";

// components/MoonModel.js
import { useEffect, useRef } from "react";
import * as THREE from "three";

const MoonModel = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / (window.innerHeight / 2), // Adjusted aspect ratio
      0.1,
      30
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight / 2); // Shrink height
    mountRef.current.appendChild(renderer.domElement);

    // Load Moon texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/moonTexture.jpg", (texture) => {
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const moon = new THREE.Mesh(geometry, material);

      moon.scale.set(1.6, 1.6, 1.6);

      scene.add(moon);
    });

    // Adjust camera position
    camera.position.z = 4;
    camera.position.y = 0;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      // Rotate the moon
      const moon = scene.children.find((child) => child instanceof THREE.Mesh);
      if (moon) {
        moon.rotation.y += 0.009; // Rotate around Y-axis
        moon.rotation.x += 0.00005; // Rotate around X-axis for a bit of 3D effect
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const height = window.innerHeight / 2; // Maintain the smaller height
      camera.aspect = window.innerWidth / height; // Adjust aspect ratio accordingly
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, height); // Update renderer size
    };
    window.addEventListener("resize", handleResize);

    // Clean up on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default MoonModel;

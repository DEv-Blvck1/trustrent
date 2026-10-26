"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RotateCw, Sun, Moon, Eye, Image as ImageIcon, Box } from "lucide-react";

export function RotatingHome3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"3d" | "photo">("3d");
  const [isRotating, setIsRotating] = useState(true);

  // Three.js object references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const houseGroupRef = useRef<THREE.Group | null>(null);
  const lightsRef = useRef<THREE.PointLight[]>([]);

  useEffect(() => {
    if (viewMode !== "3d") return;
    const mount = mountRef.current;
    if (!mount) return;

    // --- 1. SCENE SETUP ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    // Position to frame the craftsman house at a classic architectural 3/4 angle
    camera.position.set(11, 7, 16);
    camera.lookAt(0, 2.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    // --- 2. LIGHTING (Sunset Dusk Atmosphere with Warm Interior Lights) ---
    // Ambient dusk light (cool purple/blue tone)
    const ambientLight = new THREE.AmbientLight(0x7c8ba1, 1.1);
    scene.add(ambientLight);

    // Directional Sunset Light (warm peach/orange from the left-rear horizon)
    const sunLight = new THREE.DirectionalLight(0xffbe98, 2.2);
    sunLight.position.set(-18, 14, -12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Front soft fill light
    const fillLight = new THREE.DirectionalLight(0xdde6f0, 0.9);
    fillLight.position.set(12, 10, 18);
    scene.add(fillLight);

    // --- 3. MATERIALS ---
    // Soft Blue-Grey Horizontal Siding (matching photo)
    const sidingMat = new THREE.MeshStandardMaterial({
      color: 0x8b9bb0,
      roughness: 0.5,
      metalness: 0.05,
    });

    // Dark Charcoal / Slate Gable Accent
    const darkGableMat = new THREE.MeshStandardMaterial({
      color: 0x272e3b,
      roughness: 0.4,
      metalness: 0.1,
    });

    // Deep Navy / Slate Shingle Roof
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x222838,
      roughness: 0.6,
      metalness: 0.1,
    });

    // Crisp White Trim & Fascia
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xf4f7fa,
      roughness: 0.25,
      metalness: 0.1,
    });

    // Natural Stone Masonry (Pedestals & Wainscot)
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x5a636e,
      roughness: 0.9,
      metalness: 0.05,
    });

    // Garage Doors (Slate Grey)
    const garageDoorMat = new THREE.MeshStandardMaterial({
      color: 0x5e6b7c,
      roughness: 0.4,
      metalness: 0.2,
    });

    // Craftsman Front Door (Teal Ocean Blue)
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0x0c4d68,
      roughness: 0.3,
      metalness: 0.1,
    });

    // Warm Illuminated Golden Windows (Glowing interior from photo)
    const windowGlassGlowingMat = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      emissive: 0xffa726,
      emissiveIntensity: 0.85,
      roughness: 0.1,
      metalness: 0.1,
    });

    // Window Mullions & Dividers
    const windowFrameMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
    });

    // Wet Reflective Concrete Driveway
    const drivewayMat = new THREE.MeshStandardMaterial({
      color: 0x3d434d,
      roughness: 0.25,
      metalness: 0.2,
    });

    // Manicured Green Lawn
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x3e7b4c,
      roughness: 0.8,
    });

    // --- 4. HOUSE HIERARCHY ---
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);
    houseGroupRef.current = houseGroup;

    // Helper: Create a pitched gable roof section
    const createGableRoof = (
      width: number,
      depth: number,
      height: number,
      posX: number,
      posY: number,
      posZ: number,
      rotateY = 0
    ) => {
      const roofMeshGroup = new THREE.Group();

      // Prism geometry for pitched roof
      const shape = new THREE.Shape();
      shape.moveTo(-width / 2, 0);
      shape.lineTo(0, height);
      shape.lineTo(width / 2, 0);
      shape.closePath();

      const extrudeSettings = {
        depth: depth,
        bevelEnabled: false,
      };

      const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const mesh = new THREE.Mesh(geo, roofMat);
      mesh.position.set(0, 0, -depth / 2);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      roofMeshGroup.add(mesh);

      // White Fascia Trim along the front triangle
      const trimGeo = new THREE.BoxGeometry(0.18, 0.18, depth + 0.1);
      const trimLeft = new THREE.Mesh(trimGeo, trimMat);
      const angle = Math.atan2(height, width / 2);
      const length = Math.sqrt((width / 2) ** 2 + height ** 2);

      const fasciaLeftGeo = new THREE.BoxGeometry(length, 0.2, 0.12);
      const fasciaLeft = new THREE.Mesh(fasciaLeftGeo, trimMat);
      fasciaLeft.position.set(-width / 4, height / 2, depth / 2 + 0.05);
      fasciaLeft.rotation.z = angle;
      roofMeshGroup.add(fasciaLeft);

      const fasciaRight = fasciaLeft.clone();
      fasciaRight.position.set(width / 4, height / 2, depth / 2 + 0.05);
      fasciaRight.rotation.z = -angle;
      roofMeshGroup.add(fasciaRight);

      roofMeshGroup.position.set(posX, posY, posZ);
      roofMeshGroup.rotation.y = rotateY;
      return roofMeshGroup;
    };

    // Helper: Create a multi-pane craftsman window
    const createWindow = (
      width: number,
      height: number,
      posX: number,
      posY: number,
      posZ: number
    ) => {
      const winGroup = new THREE.Group();

      // Glowing Glass Pane
      const pane = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        windowGlassGlowingMat
      );
      winGroup.add(pane);

      // Outer White Frame
      const outerFrame = new THREE.Mesh(
        new THREE.BoxGeometry(width + 0.16, height + 0.16, 0.08),
        windowFrameMat
      );
      outerFrame.position.z = -0.02;
      winGroup.add(outerFrame);

      // Mullion Cross (Vertical & Horizontal Grids)
      const vertGrid = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, height, 0.02),
        windowFrameMat
      );
      vertGrid.position.z = 0.01;
      winGroup.add(vertGrid);

      const horizGrid = new THREE.Mesh(
        new THREE.BoxGeometry(width, 0.04, 0.02),
        windowFrameMat
      );
      horizGrid.position.z = 0.01;
      winGroup.add(horizGrid);

      // Interior warm point light shining outward
      const pointLight = new THREE.PointLight(0xffa726, 0.7, 4);
      pointLight.position.set(0, 0, 0.3);
      winGroup.add(pointLight);
      lightsRef.current.push(pointLight);

      winGroup.position.set(posX, posY, posZ);
      return winGroup;
    };

    // --- BASE & LANDSCAPING ---
    // Driveway & Sidewalk
    const groundGeo = new THREE.BoxGeometry(15, 0.3, 14);
    const groundMesh = new THREE.Mesh(groundGeo, drivewayMat);
    groundMesh.position.set(0, -0.15, 0);
    groundMesh.receiveShadow = true;
    houseGroup.add(groundMesh);

    // Front Right Lawn
    const lawnGeo = new THREE.BoxGeometry(4.8, 0.35, 6);
    const lawnMesh = new THREE.Mesh(lawnGeo, grassMat);
    lawnMesh.position.set(4.6, -0.12, 3.8);
    lawnMesh.receiveShadow = true;
    houseGroup.add(lawnMesh);

    // Left Lawn Strip
    const leftLawnGeo = new THREE.BoxGeometry(1.6, 0.34, 13);
    const leftLawnMesh = new THREE.Mesh(leftLawnGeo, grassMat);
    leftLawnMesh.position.set(-6.5, -0.13, 0);
    houseGroup.add(leftLawnMesh);

    // Birch / Maple Young Tree on Right Lawn (matching photo)
    const treeGroup = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 2.2, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4d3826, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.1;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    const foliageGeo = new THREE.SphereGeometry(0.85, 8, 8);
    foliageGeo.scale(0.8, 1.4, 0.8);
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x6ca548, roughness: 0.7 });
    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.y = 2.4;
    foliage.castShadow = true;
    treeGroup.add(foliage);

    treeGroup.position.set(5.8, 0, 3.6);
    houseGroup.add(treeGroup);

    // --- MAIN HOUSE STRUCTURE ---
    // Ground Floor Body
    const mainBodyGeo = new THREE.BoxGeometry(11.2, 2.8, 8);
    const mainBody = new THREE.Mesh(mainBodyGeo, sidingMat);
    mainBody.position.set(0, 1.4, -0.4);
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    houseGroup.add(mainBody);

    // Stone Masonry Wainscot Base (Bottom 0.8m)
    const stoneBaseGeo = new THREE.BoxGeometry(11.3, 0.8, 8.1);
    const stoneBase = new THREE.Mesh(stoneBaseGeo, stoneMat);
    stoneBase.position.set(0, 0.4, -0.4);
    stoneBase.castShadow = true;
    houseGroup.add(stoneBase);

    // --- GARAGE SECTION (LEFT & CENTER) ---
    // Center Double Garage Door (Width: 3.6m, Height: 2.1m)
    const doubleGarage = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 2.1, 0.1),
      garageDoorMat
    );
    doubleGarage.position.set(-0.8, 1.1, 3.65);
    houseGroup.add(doubleGarage);

    // Double Garage Glass Window Inserts (Top row)
    const garageGlassRow = new THREE.Mesh(
      new THREE.BoxGeometry(3.3, 0.28, 0.12),
      windowGlassGlowingMat
    );
    garageGlassRow.position.set(-0.8, 1.85, 3.66);
    houseGroup.add(garageGlassRow);

    // Left Single Garage Door (Width: 2.0m, Height: 2.1m)
    const singleGarage = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 2.1, 0.1),
      garageDoorMat
    );
    singleGarage.position.set(-4.2, 1.1, 3.65);
    houseGroup.add(singleGarage);

    const singleGlassRow = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.28, 0.12),
      windowGlassGlowingMat
    );
    singleGlassRow.position.set(-4.2, 1.85, 3.66);
    houseGroup.add(singleGlassRow);

    // Carriage Lights on Garages
    const lanternGeo = new THREE.BoxGeometry(0.12, 0.22, 0.12);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xffe082,
      emissive: 0xffb300,
      emissiveIntensity: 1,
    });

    [-5.4, -3.0, 1.2].forEach((x) => {
      const lantern = new THREE.Mesh(lanternGeo, lanternMat);
      lantern.position.set(x, 2.2, 3.75);
      houseGroup.add(lantern);

      const lanternLight = new THREE.PointLight(0xffb74d, 0.6, 3);
      lanternLight.position.set(x, 2.2, 3.9);
      houseGroup.add(lanternLight);
    });

    // --- FRONT PORCH & ENTRANCE (RIGHT) ---
    // Craftsman Porch Pedestal Column
    const columnBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.9, 0.5),
      stoneMat
    );
    columnBase.position.set(2.4, 0.45, 3.6);
    houseGroup.add(columnBase);

    const columnPost = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 1.7, 0.28),
      trimMat
    );
    columnPost.position.set(2.4, 1.75, 3.6);
    houseGroup.add(columnPost);

    // Teal Front Entry Door (matching photo)
    const frontDoor = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 2.1, 0.08),
      doorMat
    );
    frontDoor.position.set(2.2, 1.1, 2.8);
    houseGroup.add(frontDoor);

    // Sidelight Glass Window
    const sidelight = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 2.0, 0.05),
      windowGlassGlowingMat
    );
    sidelight.position.set(2.9, 1.1, 2.8);
    houseGroup.add(sidelight);

    // Ground Floor Living Room Window (Far Right, glowing warm yellow)
    const livingWindow = createWindow(1.8, 1.4, 4.2, 1.4, 3.65);
    houseGroup.add(livingWindow);

    // --- UPPER LEVEL & DORMER GABLES (Exact Peaked Gables from Photo) ---
    // Upper Floor Main Block
    const upperBlock = new THREE.Mesh(
      new THREE.BoxGeometry(7.2, 2.2, 6.2),
      sidingMat
    );
    upperBlock.position.set(-0.8, 3.6, -0.6);
    upperBlock.castShadow = true;
    houseGroup.add(upperBlock);

    // Main Roof (Wide Pitched Gable spanning the house)
    const mainRoof = createGableRoof(12.4, 9.2, 2.8, 0, 3.6, -0.6);
    houseGroup.add(mainRoof);

    // Upper Center Left Dormer Gable (with Dark Accent & Attic Vent)
    const centerGable = createGableRoof(3.4, 4.2, 1.9, -1.8, 3.7, 1.8);
    houseGroup.add(centerGable);

    // Dark Panel Infill in Gable Peak
    const gableInfill = new THREE.Mesh(
      new THREE.BufferGeometry(),
      darkGableMat
    );
    // Attic Louver Vent (White square)
    const atticVent = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.45, 0.05),
      trimMat
    );
    atticVent.position.set(-1.8, 5.0, 3.9);
    houseGroup.add(atticVent);

    // Upper Left Dormer Window
    const dormerWindow1 = createWindow(1.3, 1.1, -1.8, 3.8, 3.9);
    houseGroup.add(dormerWindow1);

    // Upper Center-Right Gable (Nested Gable Peak from photo)
    const rightDormerGable = createGableRoof(3.0, 3.6, 1.6, 0.8, 3.7, 2.2);
    houseGroup.add(rightDormerGable);

    const dormerWindow2 = createWindow(1.2, 1.05, 0.8, 3.8, 4.0);
    houseGroup.add(dormerWindow2);

    // Front Porch Gable Roof over Front Door (Right)
    const porchGable = createGableRoof(3.2, 2.2, 1.3, 3.2, 2.6, 3.6);
    houseGroup.add(porchGable);

    // --- 5. INTERACTION & ANIMATION LOOP ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      houseGroup.rotation.y += deltaX * 0.007;
      camera.position.y = Math.max(2.5, Math.min(12, camera.position.y - deltaY * 0.03));
      camera.lookAt(0, 2.2, 0);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Scroll Transition Tilt
    const handleScroll = () => {
      const scrollY = window.scrollY;
      houseGroup.rotation.x = Math.min(scrollY * 0.0006, 0.35);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isDragging && isRotating) {
        houseGroup.rotation.y += 0.0035; // gentle gradual rotation
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (mount && dom.parentElement === mount) {
        mount.removeChild(dom);
      }
      renderer.dispose();
    };
  }, [viewMode, isRotating]);

  return (
    <div className="relative w-full h-[460px] lg:h-[540px] rounded-3xl overflow-hidden glass-card shadow-2xl flex items-center justify-center border border-white/70 bg-gradient-to-b from-[#3a284c]/20 via-[#fcd3b0]/30 to-[#fdfbf8]">
      {/* View Mode 1: 3D Canvas */}
      {viewMode === "3d" ? (
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />
      ) : (
        /* View Mode 2: Ultra-HD Photo Reference View (User's Exact Uploaded Image) */
        <div className="w-full h-full relative">
          <img
            src="/images/hero-craftsman-home.png"
            alt="Luxury Craftsman Suburban Home at Dusk"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>
      )}

      {/* Floating Badges */}
      <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none z-10">
        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-[#0f4c81] shadow-sm border border-white/60 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          {viewMode === "3d" ? "Interactive 3D Craftsman Home" : "Architectural Photo View"}
        </span>
        {viewMode === "3d" && (
          <span className="hidden sm:inline-block text-[11px] text-[#786953] bg-white/75 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/40">
            360° Drag & Rotate
          </span>
        )}
      </div>

      {/* Control Switcher Overlay */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
        {/* Toggle between 3D Model and Photo View */}
        <button
          onClick={() => setViewMode(viewMode === "3d" ? "photo" : "3d")}
          className="px-3 py-2 rounded-xl bg-white/90 hover:bg-white text-[#1b130a] shadow-lg backdrop-blur-md transition-all text-xs font-bold flex items-center gap-1.5 border border-white/60"
        >
          {viewMode === "3d" ? (
            <>
              <ImageIcon size={14} className="text-[#0f4c81]" />
              <span>HD Photo View</span>
            </>
          ) : (
            <>
              <Box size={14} className="text-[#c4601a]" />
              <span>Interactive 3D View</span>
            </>
          )}
        </button>

        {viewMode === "3d" && (
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-[#1b130a] shadow-lg backdrop-blur-md transition-all text-xs font-semibold border border-white/60"
            title={isRotating ? "Pause Rotation" : "Resume Auto-Rotation"}
          >
            <RotateCw
              size={15}
              className={`text-[#0f4c81] ${isRotating ? "animate-spin" : ""}`}
            />
          </button>
        )}
      </div>
    </div>
  );
}

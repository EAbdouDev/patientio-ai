"use client";
import {
  Box,
  CameraControls,
  Environment,
  Float,
  Html,
  OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FC, Suspense, useState } from "react";
import Patient01 from "./Patient01";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import GLTFModel from "./GLTFModel"; // Import the GLTFModel component

interface OfficeProps {}

const Office: FC<OfficeProps> = ({}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(true);

  const handleLoadStart = () => setLoading(true);
  const handleLoadEnd = () => setLoading(false);
  return (
    <>
      {loading && <Loader />}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="z-[999] min-h-[70%] min-w-[70%] p-0 aspect-video select-none overflow-hidden rounded-xl my-6 "
        backdrop="blur"
        scrollBehavior="inside"
      >
        <ModalContent className="w-full h-full p-0">
          {(onClose) => (
            <>
              <ModalBody className="p-0 w-full h-full">
                <div className="bg-black w-full h-full p-2">
                  <div className="bg-bg-mac-bg-2 bg-cover bg-no-repeat p-2 w-full h-full rounded-lg relative ">
                    <div className="rounded-t-sm w-full h-[40px] absolute top-0 left-0 bg-black/80 backdrop-blur text-white py-1 px-2 flex justify-between items-center ">
                      <span className="text-sm opacity-70">11:26 AM</span>
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Canvas
        camera={{
          position: [0, 0, 0.0001], // Set the camera position to be behind and above the model
          fov: 50, // Field of view
        }}
      >
        <CameraManager />
        <OrbitControls />
        <Environment
          preset="night"
          far={1000}
          environmentIntensity={0.1}
          backgroundIntensity={0.5}
        />
        <LampLights />
        <Patient01 />
        <Suspense fallback={""}>
          <Float speed={0.5} floatIntensity={0.2} rotationIntensity={0.1}>
            <Html position={[1.6, -0.4, 0.7]} className="z-10">
              <div className={`${isOpen ? "hidden" : "flex"}`}>
                <Button onPress={onOpen}>Open Modal</Button>
              </div>
            </Html>
            <GLTFModel
              src="/models/doctor_office_last_final_v2.glb"
              position={[-0.5, -1.2, 0.8]}
              onLoadStart={handleLoadStart}
              onLoadEnd={handleLoadEnd}
            />
          </Float>
        </Suspense>
      </Canvas>
    </>
  );
};

const LampLights = () => {
  return (
    <>
      <pointLight intensity={0.58} position={[-0.4, 1.3, 0.7]} distance={9} />
      <pointLight intensity={0.58} position={[0.4, 1.3, 0.7]} distance={9} />
      <pointLight intensity={0.58} position={[1, 1.3, 0.7]} distance={9} />
      <pointLight intensity={0.58} position={[1.5, 1.3, 0.7]} distance={9} />
      <pointLight intensity={0.58} position={[2, 1.3, 0.7]} distance={9} />
      <pointLight intensity={0.58} position={[2.5, 1.3, 0.7]} distance={9} />
      <pointLight intensity={0.58} position={[3, 1.3, 0.7]} distance={9} />
      <pointLight intensity={0.58} position={[3.5, 1.3, 0.7]} distance={9} />
      <pointLight intensity={0.58} position={[4, 1.3, 0.7]} distance={9} />
      <pointLight intensity={0.58} position={[4.5, 1.3, 0.7]} distance={9} />
      <pointLight intensity={0.58} position={[5, 1.3, 0.7]} distance={9} />

      <pointLight intensity={0.58} position={[0.4, 1.3, -0.3]} distance={9} />
      <pointLight intensity={0.58} position={[1, 1.3, -0.3]} distance={9} />
      <pointLight intensity={0.58} position={[1.5, 1.3, -0.3]} distance={9} />
      <pointLight intensity={0.58} position={[2, 1.3, -0.3]} distance={9} />
      <pointLight intensity={0.58} position={[2.5, 1.3, -0.3]} distance={9} />
      <pointLight intensity={0.58} position={[3, 1.3, -0.3]} distance={9} />
      <pointLight intensity={0.58} position={[3.5, 1.3, -0.3]} distance={9} />
      <pointLight intensity={0.58} position={[4, 1.3, -0.3]} distance={9} />
      <pointLight intensity={0.58} position={[4.5, 1.3, -0.3]} distance={9} />
      <pointLight intensity={0.58} position={[5, 1.3, -0.3]} distance={9} />

      <pointLight intensity={0.58} position={[0.4, 1.3, -0.1]} distance={9} />
      <pointLight intensity={0.58} position={[1, 1.3, -0.1]} distance={9} />
      <pointLight intensity={0.58} position={[1.5, 1.3, -0.1]} distance={9} />
      <pointLight intensity={0.58} position={[2, 1.3, -0.1]} distance={9} />
      <pointLight intensity={0.58} position={[2.5, 1.3, -0.1]} distance={9} />
      <pointLight intensity={0.58} position={[3, 1.3, -0.1]} distance={9} />
      <pointLight intensity={0.58} position={[3.5, 1.3, -0.1]} distance={9} />
      <pointLight intensity={0.58} position={[4, 1.3, -0.1]} distance={9} />
      <pointLight intensity={0.58} position={[4.5, 1.3, -0.1]} distance={9} />
      <pointLight intensity={0.58} position={[5, 1.3, -0.1]} distance={9} />

      <pointLight intensity={0.58} position={[0.4, 1.3, -0.9]} distance={9} />
      <pointLight intensity={0.58} position={[1, 1.3, -0.9]} distance={9} />
      <pointLight intensity={0.58} position={[1.5, 1.3, -0.9]} distance={9} />
      <pointLight intensity={0.58} position={[2, 1.3, -0.9]} distance={9} />
      <pointLight intensity={0.58} position={[2.5, 1.3, -0.9]} distance={9} />
      <pointLight intensity={0.58} position={[3, 1.3, -0.9]} distance={9} />
      <pointLight intensity={0.58} position={[3.5, 1.3, -0.9]} distance={9} />
      <pointLight intensity={0.58} position={[4, 1.3, -0.9]} distance={9} />
      <pointLight intensity={0.58} position={[4.5, 1.3, -0.9]} distance={9} />
      <pointLight intensity={0.58} position={[5, 1.3, -0.9]} distance={9} />

      <pointLight intensity={0.58} position={[0.4, 1.3, -1.8]} distance={9} />
      <pointLight intensity={0.58} position={[1, 1.3, -1.8]} distance={9} />
      <pointLight intensity={0.58} position={[1.5, 1.3, -1.8]} distance={9} />
      <pointLight intensity={0.58} position={[2, 1.3, -1.8]} distance={9} />
      <pointLight intensity={0.58} position={[2.5, 1.3, -1.8]} distance={9} />
      <pointLight intensity={0.58} position={[3, 1.3, -1.8]} distance={9} />
      <pointLight intensity={0.58} position={[3.5, 1.3, -1.8]} distance={9} />
      <pointLight intensity={0.58} position={[4, 1.3, -1.8]} distance={9} />
      <pointLight intensity={0.58} position={[4.5, 1.3, -1.8]} distance={9} />
      <pointLight intensity={0.58} position={[5, 1.3, -1.8]} distance={9} />

      <pointLight intensity={0.58} position={[0.4, 1.3, -2.5]} distance={9} />
      <pointLight intensity={0.58} position={[1, 1.3, -2.5]} distance={9} />
      <pointLight intensity={0.58} position={[1.5, 1.3, -2.5]} distance={9} />
      <pointLight intensity={0.58} position={[2, 1.3, -2.5]} distance={9} />
      <pointLight intensity={0.58} position={[2.5, 1.3, -2.5]} distance={9} />
      <pointLight intensity={0.58} position={[3, 1.3, -2.5]} distance={9} />
      <pointLight intensity={0.58} position={[3.5, 1.3, -2.5]} distance={9} />
      <pointLight intensity={0.58} position={[4, 1.3, -2.5]} distance={9} />
      <pointLight intensity={0.58} position={[4.5, 1.3, -2.5]} distance={9} />
      <pointLight intensity={0.58} position={[5, 1.3, -2.5]} distance={9} />
    </>
  );
};

const Loader = () => {
  return <div>Loading...</div>;
};

export default Office;

const CameraManager = () => {
  return (
    <CameraControls
      minZoom={1}
      maxZoom={3}
      polarRotateSpeed={-0.3}
      azimuthRotateSpeed={-0.3}
    />
  );
};

"use client";
import { useGLTF, useAnimations } from "@react-three/drei";
import { FC, useEffect } from "react";

interface Patient01Props {}

const Patient01: FC<Patient01Props> = ({}) => {
  const { scene, animations } = useGLTF(
    `https://models.readyplayer.me/665c4f9f09dff701a3b9fd75.glb`
  );
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions && actions.sit) {
      actions.sit.play();
    }
  }, [actions]);

  return (
    <group position={[2, -1.22, 0.5]} rotation={[0, -Math.PI / 2, 0]}>
      <primitive object={scene} />
    </group>
  );
};

export default Patient01;

useGLTF.preload(`https://models.readyplayer.me/665c4f9f09dff701a3b9fd75.glb`);

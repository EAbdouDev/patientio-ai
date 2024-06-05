import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { FC, useEffect } from "react";

interface GLTFModelProps {
  src: string;
  position: [number, number, number];
  onLoadStart: () => void;
  onLoadEnd: () => void;
}

const GLTFModel: FC<GLTFModelProps> = ({
  src,
  position,
  onLoadStart,
  onLoadEnd,
  ...props
}) => {
  const gltf = useLoader(GLTFLoader, src, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
    );
    loader.setDRACOLoader(dracoLoader);
  });

  useEffect(() => {
    onLoadStart();
    return () => {
      onLoadEnd();
    };
  }, [gltf, onLoadStart, onLoadEnd]);

  return <primitive object={gltf.scene} position={position} {...props} />;
};

export default GLTFModel;

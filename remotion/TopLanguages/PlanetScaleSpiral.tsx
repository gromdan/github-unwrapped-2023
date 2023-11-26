import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import { LanguagesEnum, cornerType } from "../../src/config";
import { Gradient } from "../Gradients/NativeGradient";
import { LanguageDescription } from "./LanguageDescription";
import { PlanetScaleSpiralWhole } from "./PlanetScaleSpiralWhole";
import { mapLanguageToPlanet } from "./constants";
import {
  deriveClockDirectionFromEnterDirection,
  deriveEnterDirectionFromCorner,
  deriveStartRotationFromEnterDirection,
} from "./corner";

export const spiralSchema = z.object({
  language: LanguagesEnum,
  showHelperLine: z.boolean(),
  corner: cornerType,
  position: z.number().int(),
});

export const PlanetScaleSpiral: React.FC<z.infer<typeof spiralSchema>> = ({
  language,
  showHelperLine,
  corner,
  position,
}) => {
  const frame = useCurrentFrame();

  const zoomOutProgress = interpolate(frame, [0, 80], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  const scale = interpolate(zoomOutProgress, [0, 1], [1.5, 1]);

  const style: React.CSSProperties = useMemo(() => {
    return {
      transform: `scale(${scale})`,
    };
  }, [scale]);

  const enterDirection = deriveEnterDirectionFromCorner(corner);
  const clockDirection = deriveClockDirectionFromEnterDirection(enterDirection);
  const startRotation = deriveStartRotationFromEnterDirection(enterDirection);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: mapLanguageToPlanet[language].opacity }}>
        <Gradient gradient={mapLanguageToPlanet[language].gradient} />
      </AbsoluteFill>
      <AbsoluteFill style={style}>
        <PlanetScaleSpiralWhole
          startRotationInRadians={startRotation}
          showHelperLine={showHelperLine}
          language={language}
          clockDirection={clockDirection}
        />
      </AbsoluteFill>
      <AbsoluteFill>
        <LanguageDescription
          delay={60}
          duration={90}
          language={language}
          position={position}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

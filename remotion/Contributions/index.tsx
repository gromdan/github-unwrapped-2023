import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import React, { useMemo } from "react";
import type { AccentColor } from "../../src/config";
import { Gradient } from "../Gradients/NativeGradient";
import { FPS } from "../Issues/make-ufo-positions";
import { accentColorToGradient } from "../Opening/TitleImage";
import { ContributionDot, GLOW_PNG } from "./Dot";
import { GRID_HEIGHT, GRID_WIDTH, computePositions } from "./compute-positions";

export const CONTRIBUTIONS_SCENE_DURATION = 6 * FPS;
export const CONTRIBUTIONS_SCENE_EXIT_TRANSITION = 20;
export const CONTRIBUTIONS_SCENE_ENTRANCE_TRANSITION = 3;

export const contributionSceneAssets = (): string[] => {
  return [GLOW_PNG];
};

export const ContributionsScene: React.FC<{
  accentColor: AccentColor;
  contributionData: number[];
}> = ({ accentColor, contributionData }) => {
  const frame = useCurrentFrame();

  const { positions } = useMemo(() => {
    return computePositions({
      data: contributionData,
    });
  }, [contributionData]);

  const fadeInGradient = interpolate(
    frame,
    [
      0,
      7,
      CONTRIBUTIONS_SCENE_DURATION - CONTRIBUTIONS_SCENE_EXIT_TRANSITION,
      CONTRIBUTIONS_SCENE_DURATION,
    ],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const container: React.CSSProperties = useMemo(() => {
    return {
      justifyContent: "center",
      alignItems: "center",
      fontSize: 60,
      opacity: fadeInGradient,
    };
  }, [fadeInGradient]);

  return (
    <AbsoluteFill style={container}>
      <AbsoluteFill>
        <Gradient gradient={accentColorToGradient(accentColor)} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: GRID_WIDTH,
            height: GRID_HEIGHT,
          }}
        >
          {positions.map((p, i) => (
            <ContributionDot
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              dot={p}
              maxContributions={Math.max(...contributionData)}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import { UFO_HEIGHT, UFO_WIDTH } from "./Ufo";

export const CANVAS_WIDTH = 1080;
export const PADDING = 100;
export const USABLE_CANVAS_WIDTH = CANVAS_WIDTH - PADDING * 2;

type UfoPosition = {
  x: number;
  y: number;
  scale: number;
};

const issuesPerRow = (numberOfIssues: number) => {
  if (numberOfIssues < 4) {
    return 3;
  }
  if (numberOfIssues < 15) {
    return 4;
  }
  if (numberOfIssues < 30) {
    return 6;
  }
  return 8;
};

export const makeUfoPositions = (numberOfUfos: number): UfoPosition[] => {
  const perRow = issuesPerRow(numberOfUfos);
  const spaceInbetweenUfo = 10;

  const ufoContainerWidth =
    (USABLE_CANVAS_WIDTH - (perRow - 1) * spaceInbetweenUfo) / perRow;

  const ufoScale = 1 / (UFO_WIDTH / ufoContainerWidth);
  const ufoHeight = UFO_HEIGHT * ufoScale;

  const rowHeight = ufoHeight + 10;

  return new Array(numberOfUfos).fill(0).map((_, i) => {
    const width = ufoContainerWidth;

    const row = Math.floor(i / perRow);
    const column = i % perRow;

    return {
      x: width * column + PADDING + width / 2 + column * spaceInbetweenUfo,
      y: PADDING + row * rowHeight,
      scale: ufoScale,
    };
  });
};

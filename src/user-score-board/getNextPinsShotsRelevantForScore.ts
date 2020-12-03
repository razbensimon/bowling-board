import {LAST_FRAME} from "../consts";
import {FrameShots} from "../models";
import {isNormal, isSpare, isStrike} from "../common";

export const getNextPinsShotsRelevantForScore = (frameIndex: number, framesShots: FrameShots[]): number[] => {
    if (frameIndex === LAST_FRAME) return null;
    const frameShots = framesShots[frameIndex];
    if (!frameShots) return null; // didnt reach to that frame yet
    if (isNormal(frameShots)) return null;

    const nextTwoFrames = [framesShots[frameIndex + 1], framesShots[frameIndex + 2]].filter(Boolean);
    const nextShotsFlatten = nextTwoFrames.flatMap(pins => pins).filter(Number.isInteger);
    if (isStrike(frameShots)) return nextShotsFlatten.slice(0, 2);
    if (isSpare(frameShots)) return nextShotsFlatten.slice(0, 1);
    return null;
}

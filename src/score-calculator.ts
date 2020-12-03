import {LAST_FRAME, PINS} from "./consts";
import {FrameShots} from "./models";
import {isLastFrameSpare, isLastFrameStrike, isNormal, isSpare, isStrike} from "./common";

export class ScoreCalculator {
    public calcFrameScore(frameIndex: number, pinsDownInFrame: number[], prevFrameScore: number = 0, nextRelevantBalls?: number[]): number | null {
        if (frameIndex === LAST_FRAME) {
            return this.calcLastFrameScore(pinsDownInFrame, prevFrameScore);
        }
        return this.calcNormalFrameScore(pinsDownInFrame, prevFrameScore, nextRelevantBalls);
    }

    private calcNormalFrameScore = (pinsDownInFrame: FrameShots, prevFrameScore: number, nextRelevantBalls: number[] = []): number | null => {
        if (isNormal(pinsDownInFrame)) {
            const [first, second] = pinsDownInFrame;
            return prevFrameScore + first + second;
        }

        if (!nextRelevantBalls || nextRelevantBalls.length === 0) {
            return null; // can't calculate score now, waiting for feature balls!
        }

        const [nextBall, nextNextBall] = nextRelevantBalls;
        if (isSpare(pinsDownInFrame)) {
            return prevFrameScore + PINS + nextBall;
        }

        if (isStrike(pinsDownInFrame) && nextRelevantBalls.length === 2) {
            return prevFrameScore + PINS + nextBall + nextNextBall;
        }

        return null;
    }

    private calcLastFrameScore = (pinsDownInFrame: FrameShots, prevFrameScore: number): number | null => {
        const [first, second, extra] = pinsDownInFrame;

        if (isNormal(pinsDownInFrame)) {
            return prevFrameScore + first + second;
        }

        if (isLastFrameSpare(pinsDownInFrame)) {
            return prevFrameScore + first + second + extra;
        }

        if (isLastFrameStrike(pinsDownInFrame)) {
            return prevFrameScore + first + second + extra;
        }

        return null; // wait for all shots to be calculated
    }
}

export const scoreTransform = (isLastFrame:boolean, pinsDown: number, prevPinsDown?: number): string => {
    if (pinsDown === 0) return '-';
    if (Number.isInteger(prevPinsDown) && prevPinsDown + pinsDown === PINS) return '/'; // spare
    if ((prevPinsDown === null || isLastFrame) && pinsDown === PINS) return 'X'; // strike
    return pinsDown?.toString();
}

const scoreCalculator = new ScoreCalculator();
export {scoreCalculator}

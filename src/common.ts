import {PINS} from "./consts";
import {FrameShots} from "./models";

export const isLastFrameStrike = ([firstShot, secondShot, extra]: FrameShots) => {
    return firstShot === PINS && Number.isInteger(secondShot) && Number.isInteger(extra);
}

export const isStrike = ([firstShot, secondShot]: FrameShots) => {
    return !Number.isInteger(firstShot) && secondShot === PINS;
}

export const isSpare = ([firstShot, secondShot]: FrameShots) => {
    return Number.isInteger(firstShot) && Number.isInteger(secondShot) && firstShot + secondShot === PINS;
}

export const isLastFrameSpare = ([firstShot, secondShot, extra]: FrameShots) => {
    return isSpare([firstShot, secondShot]) && Number.isInteger(extra);
}

export const isNormal = ([firstShot, secondShot]: FrameShots) => {
    return Number.isInteger(firstShot) && Number.isInteger(secondShot) && firstShot + secondShot < PINS;
}



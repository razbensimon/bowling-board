import React, {useEffect, useState} from "react";
import classNames from "classnames";
import styles from './score-frame.module.scss';
import {FRAMES} from "../consts";
import {FrameShots} from "../models";
import {scoreCalculator, scoreTransform} from "../score-calculator";

interface Props {
    frameIndex: number;
    isCurrentPlay?: boolean;
    prevFrameScore?: number;
    onScore: (frameScore: number, frameIndex: number) => void;
    pinsDownInFrame: FrameShots;
    nextRelevantPinsDrops?: number[];
}

const ScoreFrame = (props: Props) => {
    const {frameIndex, isCurrentPlay = false, pinsDownInFrame = [], nextRelevantPinsDrops, prevFrameScore = 0, onScore} = props;

    if (pinsDownInFrame.length > 3) {
        throw new Error('Invalid balls number in frame')
    }

    const [frameScore, setFameScore] = useState<number>();

    useEffect(() => {
        if (pinsDownInFrame.length < 2) return; // did not finish frame yet
        const score = scoreCalculator.calcFrameScore(frameIndex, pinsDownInFrame, prevFrameScore, nextRelevantPinsDrops);
        setFameScore(score);
    }, [pinsDownInFrame, nextRelevantPinsDrops, prevFrameScore, isCurrentPlay, frameIndex]);

    useEffect(() => {
        if (frameScore) {
            onScore(frameScore, frameIndex);
        }
    }, [frameScore, onScore, frameIndex]);

    const isLast = FRAMES === frameIndex + 1;
    return (
        <div className={styles.container}>
            <div className={styles.header}>{frameIndex + 1}</div>
            <div className={classNames(styles.body, {[styles.active]: isCurrentPlay})}>
                <div className={styles.shots}>
                    <div className={styles.shotBox}>{scoreTransform(isLast, pinsDownInFrame[0])}</div>
                    <div className={styles.shotBox}>{scoreTransform(isLast, pinsDownInFrame[1], pinsDownInFrame[0])}</div>
                    {isLast && <div className={styles.shotBox}>{scoreTransform(isLast, pinsDownInFrame[2])}</div>}
                </div>
                <div className={styles.score}>{frameScore}</div>
            </div>
        </div>
    );
};

export default ScoreFrame;

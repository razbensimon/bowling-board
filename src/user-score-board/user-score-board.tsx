import React, {useCallback, useEffect, useState} from "react";
import styles from './user-score-board.module.scss';
import ScoreFrame from "../score-frame/score-frame";
import FinalScoreFrame from "../final-score-frame/final-score-frame";
import {FRAMES} from "../consts";
import {getNextPinsShotsRelevantForScore} from "./getNextPinsShotsRelevantForScore";
import {Dictionary, FrameShots} from "../models";

const framesNumber = Array.from(Array(FRAMES).keys());

interface Props {
    userName: string;
    currentFrame: number;
    framesShots: FrameShots[];
}

const UserScoreBoard = (props: Props) => {
    const {userName, currentFrame, framesShots} = props;
    const [finalScore, setFinalScore] = useState(0);

    const [frameScores, setFrameScores] = useState<Dictionary<number>>({});
    const onFrameScored = useCallback((frameScore: number, frameIndex: number) => {
        setFrameScores((prevFrameScores) => ({...prevFrameScores, ...{[frameIndex]: frameScore}}));
        setFinalScore(frameScore);
    }, []);

    const [nextPinsShotsRelevantForScore, setNextPinsShotsRelevantForScore] = useState<number[][]>([]);
    useEffect(() => {
        const framesNextRelevantPinsDrops = framesShots.map((framePinsDrop, frameIndex) => getNextPinsShotsRelevantForScore(frameIndex, framesShots));
        setNextPinsShotsRelevantForScore(framesNextRelevantPinsDrops);
    }, [framesShots]);

    return (
        <div className={styles.container}>
            <div className={styles.user}>{userName}</div>
            <div className={styles.frames}>
                {
                    framesNumber.map((frameIndex) => (
                        <ScoreFrame key={frameIndex}
                                    frameIndex={frameIndex}
                                    isCurrentPlay={frameIndex === currentFrame}
                                    pinsDownInFrame={framesShots[frameIndex]}
                                    nextRelevantPinsDrops={nextPinsShotsRelevantForScore[frameIndex]}
                                    onScore={onFrameScored}
                                    prevFrameScore={frameScores[frameIndex - 1]}/>
                    ))
                }
                <FinalScoreFrame finalScore={finalScore}/>
            </div>
        </div>
    );
};

export default UserScoreBoard;

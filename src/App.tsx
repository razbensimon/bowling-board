import React, {useCallback, useEffect, useState} from 'react';
import styles from './App.module.scss';
import UserScoreBoard from "./user-score-board/user-score-board";
import PinsDeck from "./pins-deck/pins-deck";
import {FRAMES, LAST_FRAME} from "./consts";
import {FrameShots} from "./models";
import {isLastFrameSpare, isLastFrameStrike, isNormal, isSpare, isStrike} from "./common";

function App() {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [prevKnockDown, setPrevKnockDown] = useState<number | null>(null);
    const [framesShots, setFramesShots] = useState<FrameShots[]>([]);
    const [gameDone, setSetGameDone] = useState(false);

    const updatePinsDown = useCallback((knockDown: number, prevKnockDown: number) => {
        if (isStrike([prevKnockDown, knockDown])) {
            setFramesShots(framesShots => [...framesShots, [null, knockDown]])
            setCurrentFrame(currentFrame => currentFrame + 1);
            setPrevKnockDown(null);
            return;
        }

        if (!Number.isInteger(prevKnockDown)) {
            // first ball in round
            setFramesShots(framesShots => [...framesShots, [knockDown]]);
            setPrevKnockDown(knockDown);
            return;
        }

        if (isSpare([prevKnockDown, knockDown]) || isNormal([prevKnockDown, knockDown])) {
            setFramesShots(framesShots => {
                framesShots.pop();
                return [...framesShots, [prevKnockDown, knockDown]];
            });
            setCurrentFrame(currentFrame => currentFrame + 1);
            setPrevKnockDown(null);
            return;
        }
    }, []);

    const updatePinsDownAtLastFrame = useCallback((pins: number) => {
        setFramesShots((frameShots) => {
            if (frameShots.length === FRAMES) {
                const lastFrameResults = frameShots.pop();
                lastFrameResults.push(pins);
                return [...frameShots, [...lastFrameResults]];
            }
            return [...frameShots, [pins]];
        });
    }, []);

    const onKnockDown = useCallback((pins: number) => {
        console.log(`knocked down ${pins} pins`);
        if (currentFrame !== LAST_FRAME) {
            updatePinsDown(pins, prevKnockDown);
            return;
        }
        updatePinsDownAtLastFrame(pins);
    }, [currentFrame, prevKnockDown, updatePinsDown, updatePinsDownAtLastFrame]);

    // Determine if should end the game
    useEffect(() => {
        console.info('Current Frame', currentFrame + 1);
        if (currentFrame !== LAST_FRAME) {
            return;
        }
        const lastFrameResults = framesShots[currentFrame];
        const lastFrameIsDone = lastFrameResults?.length >= 2 &&
            (
                isNormal(lastFrameResults) || // no extra shot
                isLastFrameSpare(lastFrameResults) || // spare with extra last shot
                isLastFrameStrike(lastFrameResults) // strike with 2 extra last shots
            )

        if (lastFrameIsDone)
            setSetGameDone(lastFrameIsDone);
    }, [currentFrame, framesShots]);

    return (
        <div className={styles.App}>
            <div className={styles.upper}>
                {gameDone ?
                    <span className={styles.done}>Game Done!</span> :
                    <PinsDeck onKnockDown={onKnockDown} currentFrame={currentFrame}/>}
            </div>
            <UserScoreBoard userName="Raz Ben Simon" currentFrame={currentFrame} framesShots={framesShots}/>
        </div>
    );
}

export default App;

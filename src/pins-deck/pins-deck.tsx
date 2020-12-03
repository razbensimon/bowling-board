import React, {useCallback, useEffect, useState} from "react";
import classNames from "classnames";
import styles from './pins-deck.module.scss';
import {PINS} from "../consts";

import {isSpare, isStrike} from "../common";

interface Props {
    currentFrame: number;
    onKnockDown: (pins: number) => void;
}

const PINS_DECK = Array.from(Array(PINS).keys());

const PinsDeck = (props: Props) => {
    //useWhyDidYouUpdate('PinsDeck', props);

    const {onKnockDown, currentFrame} = props;
    const [pinsLeft, setPinsLeft] = useState(PINS);
    const [prevPinsDown, setPrevPinsDown] = useState(PINS);

    const resetDeck = () => {
        setPinsLeft(PINS);
        setPrevPinsDown(null);
    };

    const knockDown = useCallback((downPins: number) => {
        if (downPins < PINS) {
            setPinsLeft(PINS - downPins);
        }
        onKnockDown(downPins);

        if (isSpare([prevPinsDown, downPins]) || isStrike([prevPinsDown, downPins])) {
            resetDeck(); // reset after spare
            return;
        }
        setPrevPinsDown(downPins);
    }, [onKnockDown, prevPinsDown]);

    useEffect(() => {
        resetDeck(); // reset pins for next frame
    }, [currentFrame])

    return (
        <div className={styles.container}>
            <span className={styles.message}>Click Number of Pins Knocked Down</span>
            <div className={styles.pinDeck}>
                <button onClick={() => knockDown(0)} className={styles.pinBtn}>0</button>
                {
                    PINS_DECK.map((index) => (
                        <button key={index} onClick={() => knockDown(index + 1)}
                                className={classNames(styles.pinBtn, {[styles.hide]: index + 1 > pinsLeft})}>
                            {index + 1}
                        </button>
                    ))
                }
            </div>
        </div>
    );
};

export default PinsDeck;

import React from 'react';
import {ScoreCalculator} from "./score-calculator";
import {LAST_FRAME} from "./consts";

describe('ScoreCalculator', () => {
    let calculator: ScoreCalculator;
    beforeEach(() => {
        calculator = new ScoreCalculator();
    });

    describe('calculate frame score when knocked down less the 10', () => {
        test('calculate first frame with less the 10', () => {
            expect(calculator.calcFrameScore(1, [2, 7])).toEqual(9);
            expect(calculator.calcFrameScore(1, [1, 6])).toEqual(7);
            expect(calculator.calcFrameScore(1, [1, 1])).toEqual(2);
            expect(calculator.calcFrameScore(1, [1, 0])).toEqual(1);
            expect(calculator.calcFrameScore(1, [0, 1])).toEqual(1);
            expect(calculator.calcFrameScore(1, [0, 0])).toEqual(0);
        });

        test('calculate middle frame with less the 10', () => {
            expect(calculator.calcFrameScore(5, [2, 7], 50)).toEqual(59);
            expect(calculator.calcFrameScore(5, [1, 6], 50)).toEqual(57);
            expect(calculator.calcFrameScore(5, [1, 1], 50)).toEqual(52);
            expect(calculator.calcFrameScore(5, [1, 0], 50)).toEqual(51);
            expect(calculator.calcFrameScore(5, [0, 1], 50)).toEqual(51);
            expect(calculator.calcFrameScore(5, [0, 0], 50)).toEqual(50);
        });

        test('calculate last frame with less the 10', () => {
            expect(calculator.calcFrameScore(LAST_FRAME, [2, 7], 50)).toEqual(59);
            expect(calculator.calcFrameScore(LAST_FRAME, [1, 6], 50)).toEqual(57);
            expect(calculator.calcFrameScore(LAST_FRAME, [1, 1], 50)).toEqual(52);
            expect(calculator.calcFrameScore(LAST_FRAME, [1, 0], 50)).toEqual(51);
            expect(calculator.calcFrameScore(LAST_FRAME, [0, 1], 50)).toEqual(51);
            expect(calculator.calcFrameScore(LAST_FRAME, [0, 0], 50)).toEqual(50);
        });
    })

    describe('calculate frame score when knocked down spare', () => {
        test('on spare with no feature balls, should abort calculation', () => {
            expect(calculator.calcFrameScore(1, [2, 8])).toEqual(null);
            expect(calculator.calcFrameScore(2, [1, 9])).toEqual(null);
            expect(calculator.calcFrameScore(3, [0, 10])).toEqual(null);
            expect(calculator.calcFrameScore(3, [9, 1], 50)).toEqual(null);
        });

        test('on spare with feature balls, should calculate frame', () => {
            expect(calculator.calcFrameScore(1, [2, 8], null, [1])).toEqual(11);
            expect(calculator.calcFrameScore(2, [1, 9], 50, [1])).toEqual(61);
            expect(calculator.calcFrameScore(3, [0, 10], 50, [1])).toEqual(61);

            expect(calculator.calcFrameScore(3, [0, 10], 50, [0])).toEqual(60); // before zero
            expect(calculator.calcFrameScore(3, [0, 10], 50, [5, 5])).toEqual(65); // before other spare
            expect(calculator.calcFrameScore(3, [0, 10], 50, [10])).toEqual(70); // before strike
        });

        test('on last frame, on spare with no extra ball, should abort calculation', () => {
            expect(calculator.calcFrameScore(LAST_FRAME, [5, 5], 50)).toEqual(null);
            expect(calculator.calcFrameScore(LAST_FRAME, [1, 9])).toEqual(null);
            expect(calculator.calcFrameScore(LAST_FRAME, [0, 10])).toEqual(null);
        });

        test('on last frame, on spare with extra ball, should calculate frame', () => {
            expect(calculator.calcFrameScore(LAST_FRAME, [0, 10, 0], 50)).toEqual(60); // extra zero
            expect(calculator.calcFrameScore(LAST_FRAME, [0, 10, 2], 50)).toEqual(62); // extra normal
            expect(calculator.calcFrameScore(LAST_FRAME, [0, 10, 10], 50)).toEqual(70); // extra strike

            expect(calculator.calcFrameScore(LAST_FRAME, [5, 5, 0], 50)).toEqual(60); // extra zero
            expect(calculator.calcFrameScore(LAST_FRAME, [5, 5, 2], 50)).toEqual(62); // extra normal
            expect(calculator.calcFrameScore(LAST_FRAME, [5, 5, 10], 50)).toEqual(70); // extra strike
        });
    });

    describe('calculate frame score when knocked down strike', () => {
        test('on strike with no feature balls, should abort calculation', () => {
            expect(calculator.calcFrameScore(1, [null, 10])).toEqual(null);
            expect(calculator.calcFrameScore(2, [null, 10], 50)).toEqual(null);
        });

        test('on strike with only 1 feature balls, should abort calculation', () => {
            expect(calculator.calcFrameScore(1, [null, 10], null, [1])).toEqual(null);
            expect(calculator.calcFrameScore(2, [null, 10], 50, [1])).toEqual(null);
        });

        test('on strike with feature balls, should calculate frame', () => {
            expect(calculator.calcFrameScore(1, [null, 10], null, [1, 1])).toEqual(12);
            expect(calculator.calcFrameScore(2, [null, 10], 50, [1, 1])).toEqual(62);

            // before spare
            expect(calculator.calcFrameScore(1, [null, 10], null, [5, 5])).toEqual(20);
            expect(calculator.calcFrameScore(2, [null, 10], 50, [5, 5])).toEqual(70);
            expect(calculator.calcFrameScore(2, [null, 10], 50, [0, 10])).toEqual(70);

            // before strike and normal
            expect(calculator.calcFrameScore(1, [null, 10], null, [10, 5])).toEqual(25);
            expect(calculator.calcFrameScore(2, [null, 10], 50, [10, 5])).toEqual(75);

            // before 2 strikes
            expect(calculator.calcFrameScore(1, [null, 10], null, [10, 10])).toEqual(30);
            expect(calculator.calcFrameScore(2, [null, 10], 50, [10, 10])).toEqual(80);
        });

        test('on last frame, should abort calculation if there are no 2 extra shots', () => {
            expect(calculator.calcFrameScore(LAST_FRAME, [10], 50)).toEqual(null);
            expect(calculator.calcFrameScore(LAST_FRAME, [10, 5], 50)).toEqual(null);
            expect(calculator.calcFrameScore(LAST_FRAME, [10, 10], 50)).toEqual(null);
        });

        test('on last frame, on strike with extra 2 balls, should calculate frame', () => {
            // handle extra zeros
            expect(calculator.calcFrameScore(LAST_FRAME, [10, 0, 0], 50)).toEqual(60);
            expect(calculator.calcFrameScore(LAST_FRAME, [10, 5, 0], 50)).toEqual(65);
            expect(calculator.calcFrameScore(LAST_FRAME, [10, 0, 5], 50)).toEqual(65);

            // handle 2 normal shots
            expect(calculator.calcFrameScore(LAST_FRAME, [10, 1, 1], 50)).toEqual(62);
            expect(calculator.calcFrameScore(LAST_FRAME, [10, 9, 9], 50)).toEqual(78);

            // handle following "spare" (not consider as spare '/' on the board)
            expect(calculator.calcFrameScore(LAST_FRAME, [10, 5, 5], 50)).toEqual(70);
            expect(calculator.calcFrameScore(LAST_FRAME, [10, 1, 9], 50)).toEqual(70);
            expect(calculator.calcFrameScore(LAST_FRAME, [10, 0, 10], 50)).toEqual(70);

            // handle following strike
            expect(calculator.calcFrameScore(LAST_FRAME, [10, 10, 0], 50)).toEqual(70);
            expect(calculator.calcFrameScore(LAST_FRAME, [10, 10, 5], 50)).toEqual(75);
            expect(calculator.calcFrameScore(LAST_FRAME, [10, 10, 9], 50)).toEqual(79);
            expect(calculator.calcFrameScore(LAST_FRAME, [10, 10, 10], 50)).toEqual(80); // 3 strikes
        });
    });
})

import React from "react";
import styles from './final-score-frame.module.scss';


interface Props {
    finalScore: number;
}

const FinalScoreFrame = (props: Props) => {
    //useWhyDidYouUpdate('FinalScoreFrame', props);
    const {finalScore = 0} = props;

    return (
        <div className={styles.container}>
            <div className={styles.header}>Hdcp Score</div>
            <div className={styles.body}>
                <span>{finalScore}</span>
            </div>
        </div>
    );
};

export default FinalScoreFrame;

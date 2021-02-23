import { useState, useLayoutEffect } from 'react';

const useAnimalNum = () => {
    const [animalNum, setAnimalNum] = useState(null);
    const comment = [
        'このペースでがんばろう！',
        '継続することが未来につながる！！',
        '頑張ってるね！',
        'うおおおおお！！！！！！',
        'チャレンジを続けよう！！',
        'Persistence pays off!!',
        'Do your best!!',
    ];

    // 描画前に同期的に実行させるためにuseLayoutEffectを利用
    useLayoutEffect(() => {
        setAnimalNum(Math.floor(Math.random() * 7));
    }, []);

    return [animalNum, comment[animalNum]];
};

export default useAnimalNum;

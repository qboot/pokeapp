import React, { useEffect, useState } from 'react';
import GameView from './views/GameView';
import LoginView from './views/LoginView';
import WelcomeView from './views/WelcomeView';
import ChooseView from './views/ChooseView';
import io from 'socket.io-client';

export default () => {
    const [name, setName] = useState();
    const [socket, setSocket] = useState();
    const [data, setData] = useState();
    const [status, setStatus] = useState('waiting'); // waiting, playing, ended, terminated

    useEffect(() => {
        if (!name) {
            return;
        }

        setSocket(io(`http://localhost:3000?name=${name}`));
    }, [name]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.on('started', localData => {
            console.log(localData);
            setData(localData);
            setStatus('playing');
        });

        socket.on('moved', localData => {
            console.log(localData);
            setData(localData);
        });

        socket.on('terminated', () => {
            setStatus('terminated');
            setData(null);
        });

        socket.on('ended', localData => {
            console.log(localData);
            setStatus('ended');
            setData(localData);
        });
    }, [socket]);

    const resetGame = () => {
        setName(null);
        setData(null);
        setStatus('waiting');

        if (socket) {
            socket.disconnect();
        }
    };

    return (
        <div className="c-app">
            {name && <GameView data={data} status={status} socket={socket} resetGame={resetGame} />}
            {!name && <LoginView setName={setName} />}
            {/* <WelcomeView /> */}
            {/* <ChooseView /> */}
        </div>
    );
};

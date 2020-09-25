import React from 'react';

export default ({ data, status, socket, resetGame }) => {
    let message = '';

    switch (status) {
        case 'waiting':
            message = "En attente d'un autre joueur...";
            break;
        case 'playing':
            if (data.turn === 'you') {
                if (data.moveId !== undefined) {
                    message = `${data.opponent.name} a joué ${data.opponent.pokemon.moves[data.moveId].name} avec ${
                        data.opponent.pokemon.name
                    }.`;
                }

                message += ' A toi de jouer ! Quelle attaque choisis-tu ?';
            } else {
                if (data.moveId !== undefined) {
                    message = `Tu a joué ${data.you.pokemon.moves[data.moveId].name} avec ${data.you.pokemon.name}.`;
                }

                message += ` C'est au tour de ${data.opponent.name} de jouer...`;
            }
            break;
        case 'ended':
            if (data.win !== undefined) {
                message = data.win ? 'Tu as gagné! Bravo.' : 'Perdu :(';
            }
            break;
        case 'terminated':
            message = "Ton adversaire s'est déconnecté :/";
            break;
        default: // do nothing
    }

    const triggerAction = moveId => {
        if (data.turn === 'you') {
            socket.emit('move', moveId);
        }
    };

    const hpToPercent = pokemon => {
        return Math.floor((pokemon.hp / pokemon.maxHp) * 100);
    };

    return (
        <>
            <div className="c-game">
                {data && (
                    <div className="c-game-row">
                        <div className="c-pokemon-info">
                            {`${data.opponent.name}'s ${data.opponent.pokemon.name} (${data.opponent.pokemon.hp}hp)`}
                            <div
                                className="c-pokemon__hp"
                                style={{ '--pokemon-hp-percent': hpToPercent(data.opponent.pokemon) }}
                            />
                        </div>
                        <div className="c-pokemon">
                            <div className="c-pokemon__image">
                                <img alt="Opponent Pokemon" src={data.opponent.pokemon.image} />
                            </div>
                        </div>
                    </div>
                )}
                {data && (
                    <div className="c-game-row">
                        <div className="c-pokemon">
                            <div className="c-pokemon__image">
                                <img alt="Mine Pokemon" src={data.you.pokemon.image} />
                            </div>
                        </div>
                        <div className="c-pokemon-info">
                            {`${data.you.name}'s ${data.you.pokemon.name} (${data.you.pokemon.hp}hp)`}
                            <div
                                className="c-pokemon__hp"
                                style={{ '--pokemon-hp-percent': hpToPercent(data.you.pokemon) }}
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className="c-game-info">
                <div className="c-message">
                    {message}
                    {(status === 'terminated' || status === 'ended') && (
                        <div className="c-form u-mt-base">
                            <button onClick={resetGame}>Retourner au menu</button>
                        </div>
                    )}
                </div>
                {data && (
                    <div className="c-actions">
                        <button
                            className="c-actions__action"
                            onClick={() => triggerAction(0)}
                            disabled={data.win !== undefined || data.turn === 'opponent'}
                        >
                            {data.you.pokemon.moves[0].name}
                        </button>
                        <button
                            className="c-actions__action"
                            onClick={() => triggerAction(1)}
                            disabled={data.win !== undefined || data.turn === 'opponent'}
                        >
                            {data.you.pokemon.moves[1].name}
                        </button>
                        <button
                            className="c-actions__action"
                            onClick={() => triggerAction(2)}
                            disabled={data.win !== undefined || data.turn === 'opponent'}
                        >
                            {data.you.pokemon.moves[2].name}
                        </button>
                        <button
                            className="c-actions__action"
                            onClick={() => triggerAction(3)}
                            disabled={data.win !== undefined || data.turn === 'opponent'}
                        >
                            {data.you.pokemon.moves[3].name}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

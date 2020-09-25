import pokemons from './pokemons';

export const startGame = (players, config) => {
    console.log('Game starting...');

    for (const player of players) {
        const index = Math.floor(Math.random() * pokemons.length);
        player.pokemon = { ...pokemons[index] };
    }

    config.turn = Math.floor(Math.random() * 2); // 0 1

    // for (let i = 0; i < players.length; i++)
    for (const [index, player] of players.entries()) {
        const { socket, ...you } = player;
        // const { socket: _, ...opponent} = players.find(localPlayer => localPlayer.socket.id !== player.socket.id);
        const { socket: _, ...opponent} = players.find(localPlayer => {
            return localPlayer.socket.id !== player.socket.id;
        });

        player.socket.emit('started', {
            you,
            opponent,
            turn: index === config.turn ? 'you' : 'opponent',
        });
    }
};

export const terminateGame = (socket, players) => {
    console.log('Game terminating...');

    const index = players.findIndex(player => player.socket.id === socket.id);

    if (-1 !== index) {
        players.splice(index, 1);
    }

    // players[0].pokemon = null;

    for (const player of players) {
        player.pokemon = null;
        player.socket.emit('terminated');
    }
};

export const handleMove = (moveId, players, config) => {
    const activePlayer = players[config.turn];
    const opponent = players[0 === config.turn ? 1 : 0];
    const move = activePlayer.pokemon.moves[moveId];

    console.log(`${activePlayer.name} with "${activePlayer.pokemon.name}" has played "${move.name}"`);
    console.log(`${opponent.pokemon.name} (${opponent.pokemon.hp}hp) has taken ${move.power} damages`);

    opponent.pokemon.hp -= move.power;

    if (opponent.pokemon.hp <= 0) {
        endGame(players);
    } else {
        updateGame(moveId, players, config);
    }
};

const endGame = players => {
    console.log('Game ending...');

    const winnerIndex = players.findIndex(player => 0 < player.pokemon.hp);

    for (const [i, player] of players.entries()) {
        const { socket, ...you } = player;
        const { socket: _, ...opponent } = players.find(player => player.socket.id !== socket.id);

        player.socket.emit('ended', {
            you,
            opponent,
            win: i === winnerIndex,
        });
    }
};

export const updateGame = (moveId, players, config) => {
    config.turn = 0 === config.turn ? 1 : 0;

    for (const [i, player] of players.entries()) {
        const { socket, ...you } = player;
        const { socket: _, ...opponent } = players.find(player => player.socket.id !== socket.id);

        player.socket.emit('moved', {
            you,
            opponent,
            moveId,
            turn: i === config.turn ? 'you' : 'opponent',
        });
    }
};

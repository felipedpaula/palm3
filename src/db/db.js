import { openDB } from 'idb';

const DB_NAME = 'palm3';

export async function initDB() {
    return openDB(DB_NAME, 2, { // Altere o número da versão (por exemplo, de 1 para 2)
        upgrade(db) {
            // Criar store para jogos
            if (!db.objectStoreNames.contains('jogos')) {
                db.createObjectStore('jogos', { keyPath: 'id', autoIncrement: true });
            }

            // Criar store para jogadores
            if (!db.objectStoreNames.contains('jogadores')) {
                db.createObjectStore('jogadores', { keyPath: 'id', autoIncrement: true });
            }

            // Criar store para o Time 1
            if (!db.objectStoreNames.contains('time1')) {
                db.createObjectStore('time1', { keyPath: 'id', autoIncrement: true });
            }

            // Criar store para o Time 2
            if (!db.objectStoreNames.contains('time2')) {
                db.createObjectStore('time2', { keyPath: 'id', autoIncrement: true });
            }

            // Criar store para os Próximos Reservas
            if (!db.objectStoreNames.contains('proxReservas')) {
                db.createObjectStore('proxReservas', { keyPath: 'id', autoIncrement: true });
            }
        }
    });
}

export async function addJogo(jogo) {
    const db = await initDB();
    const jogoComId = { id: 1, ...jogo }; // ID fixo para sempre atualizar o mesmo jogo
    return db.put('jogos', jogoComId); // Salva no store "jogos"
}

export async function getDadosJogo() {
    const db = await initDB();
    return db.getAll('jogos'); // Busca do store "jogos"
}

export async function addJogador(jogador) {
    const db = await initDB();
    return db.put('jogadores', jogador); // Salva no store "jogadores"
}

export async function getJogadores() {
    const db = await initDB();
    return db.getAll('jogadores'); // Busca do store "jogadores"
}

export async function getJogadoresTime1() {
    const db = await initDB();
    return db.getAll('time1');
}

export async function getJogadoresTime2() {
    const db = await initDB();
    return db.getAll('time2');
}

export async function getProxReservas() {
    const db = await initDB();
    return db.getAll('proxReservas');
}

export async function removeJogador(id) {
    const db = await initDB();
    return db.delete('jogadores', id); // Remove do store "jogadores"
}

export async function saveTime1(time1) {
    const db = await initDB();
    const tx = db.transaction('time1', 'readwrite');
    const store = tx.objectStore('time1');
    for (const jogador of time1) {
        await store.put(jogador); // Adiciona cada jogador individualmente ao store 'time1'
    }
    await tx.done; // Aguarda até que a transação seja concluída
}

export async function saveTime2(time2) {
    const db = await initDB();
    const tx = db.transaction('time2', 'readwrite');
    const store = tx.objectStore('time2');
    for (const jogador of time2) {
        await store.put(jogador); // Adiciona cada jogador individualmente ao store 'time2'
    }
    await tx.done;
}

export async function saveProxReservas(proxReservas) {
    const db = await initDB();
    const tx = db.transaction('proxReservas', 'readwrite');
    const store = tx.objectStore('proxReservas');
    for (const jogador of proxReservas) {
        await store.put(jogador); // Adiciona cada jogador individualmente ao store 'proxReservas'
    }
    await tx.done;
}

export async function clearTime1() {
    const db = await initDB();
    const tx = db.transaction('time1', 'readwrite');
    const store = tx.objectStore('time1');
    await store.clear(); // Limpa todos os registros do store 'time1'
    await tx.done;
}

export async function clearTime2() {
    const db = await initDB();
    const tx = db.transaction('time2', 'readwrite');
    const store = tx.objectStore('time2');
    await store.clear(); // Limpa todos os registros do store 'time2'
    await tx.done;
}

export async function clearProxReservas() {
    const db = await initDB();
    const tx = db.transaction('proxReservas', 'readwrite');
    const store = tx.objectStore('proxReservas');
    await store.clear(); // Limpa todos os registros do store 'proxReservas'
    await tx.done;
}

// Função para atualizar as reservas e reorganizar o Time 2 caso o Time 1 vença
export async function vitoriaTime1() {
    const db = await initDB();

    // Passo 1: Recupera os jogadores do Time 2 e da lista de proxReservas
    const time2 = await db.getAll('time2');
    const proxReservas = await db.getAll('proxReservas');

    // Passo 2: Limpar o store de proxReservas para reiniciar a fila
    const txProxReservasClear = db.transaction('proxReservas', 'readwrite');
    const storeProxReservasClear = txProxReservasClear.objectStore('proxReservas');
    await storeProxReservasClear.clear(); // Limpa todos os jogadores de proxReservas
    await txProxReservasClear.done;

    // Passo 3: Combinar a lista de proxReservas com time2, colocando time2 ao final
    const novasReservas = [...proxReservas, ...time2];

    // Passo 4: Reinserir os jogadores de proxReservas com IDs únicos em ordem correta
    const txProxReservasUpdate = db.transaction('proxReservas', 'readwrite');
    const storeProxReservasUpdate = txProxReservasUpdate.objectStore('proxReservas');
    
    // ID inicial para garantir que a ordem de inserção seja preservada
    let id = 1;
    
    for (const jogador of novasReservas) {
        // Vamos criar um ID incrementado para manter a ordem na fila
        const jogadorComId = { ...jogador, id: id++ };
        await storeProxReservasUpdate.put(jogadorComId); // Salva os jogadores na ordem correta
    }
    await txProxReservasUpdate.done;

    // Limpa o store do Time 2 após mover os jogadores
    const txTime2 = db.transaction('time2', 'readwrite');
    const storeTime2 = txTime2.objectStore('time2');
    await storeTime2.clear(); // Limpa todos os jogadores do time 2
    await txTime2.done;
}

// Função para atualizar as reservas e reorganizar o Time 1 caso o Time 2 vença
export async function vitoriaTime2() {
    const db = await initDB();

    // Passo 1: Recupera os jogadores do Time 1 e da lista de proxReservas
    const time1 = await db.getAll('time1');
    const proxReservas = await db.getAll('proxReservas');

    // Passo 2: Limpar o store de proxReservas para reiniciar a fila
    const txProxReservasClear = db.transaction('proxReservas', 'readwrite');
    const storeProxReservasClear = txProxReservasClear.objectStore('proxReservas');
    await storeProxReservasClear.clear(); // Limpa todos os jogadores de proxReservas
    await txProxReservasClear.done;

    // Passo 3: Combinar a lista de proxReservas com time1, colocando time1 ao final
    const novasReservas = [...proxReservas, ...time1];

    // Passo 4: Reinserir os jogadores de proxReservas com IDs únicos em ordem correta
    const txProxReservasUpdate = db.transaction('proxReservas', 'readwrite');
    const storeProxReservasUpdate = txProxReservasUpdate.objectStore('proxReservas');
    
    // ID inicial para garantir que a ordem de inserção seja preservada
    let id = 1;
    
    for (const jogador of novasReservas) {
        // Vamos criar um ID incrementado para manter a ordem na fila
        const jogadorComId = { ...jogador, id: id++ };
        await storeProxReservasUpdate.put(jogadorComId); // Salva os jogadores na ordem correta
    }
    await txProxReservasUpdate.done;

    // Limpa o store do Time 1 após mover os jogadores
    const txTime1 = db.transaction('time1', 'readwrite');
    const storeTime1 = txTime1.objectStore('time1');
    await storeTime1.clear(); // Limpa todos os jogadores do time 1
    await txTime1.done;
}

// Função genérica para atualizar um time com os primeiros jogadores da lista de proxReservas
export async function atualizarTimeComReservas(nomeTime, jogadoresPorTime) {
    const db = await initDB();

    // Passo 1: Recuperar a lista de proximosReservas
    const proxReservas = await db.getAll('proxReservas');
    const qtdPorTime = jogadoresPorTime;

    // Passo 2: Selecionar os primeiros jogadores da lista para o Time
    const novosJogadores = proxReservas.slice(0, qtdPorTime);
    const novasReservas = proxReservas.slice(qtdPorTime); // Remove os primeiros jogadores da lista de reservas

    // Passo 3: Limpar o time especificado e adicionar os novos jogadores
    const txTime = db.transaction(nomeTime, 'readwrite');
    const storeTime = txTime.objectStore(nomeTime);
    await storeTime.clear(); // Limpa todos os jogadores do time especificado
    for (const jogador of novosJogadores) {
        await storeTime.put(jogador); // Adiciona os novos jogadores no time
    }
    await txTime.done;

    // Passo 4: Atualizar o proxReservas com os jogadores restantes
    const txProxReservas = db.transaction('proxReservas', 'readwrite');
    const storeProxReservas = txProxReservas.objectStore('proxReservas');
    await storeProxReservas.clear(); // Limpa as reservas
    for (const jogador of novasReservas) {
        await storeProxReservas.put(jogador); // Reinsere os jogadores restantes nas reservas
    }
    await txProxReservas.done;
}

export async function getJogadoresProxReservas() {
    const db = await initDB();
    return db.getAll('proxReservas'); // Retorna todos os jogadores da store 'proxReservas'
}

// Função para buscar o próximo ID para um novo jogador
export async function getProximoIdJogador() {
    const db = await initDB();
    const jogadores = await db.getAll('jogadores');
    return jogadores.length > 0 ? jogadores[jogadores.length - 1].id + 1 : 1;
}

// Função para adicionar jogador ao final da lista de proxReservas
export async function addJogadorAosReservas(jogador) {
    const db = await initDB();
    const tx = db.transaction('proxReservas', 'readwrite');
    const store = tx.objectStore('proxReservas');
    await store.add(jogador); // Adiciona o jogador ao final da lista
    await tx.done;
}

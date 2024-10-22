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



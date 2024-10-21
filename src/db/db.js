import { openDB } from 'idb';

const DB_NAME = 'palm3';

export async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            // Criar store para jogos
            if (!db.objectStoreNames.contains('jogos')) {
                db.createObjectStore('jogos', { keyPath: 'id', autoIncrement: true });
            }

            // Criar store para jogadores
            if (!db.objectStoreNames.contains('jogadores')) {
                db.createObjectStore('jogadores', { keyPath: 'id', autoIncrement: true });
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
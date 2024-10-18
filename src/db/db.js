import { openDB } from 'idb';

const DB_NAME = 'palm3';
const STORE_NAME = 'jogos';

export async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        }
    });
}

export async function addJogo(jogo) {
    const db = await initDB();
    return db.add(STORE_NAME, jogo);
}

export async function getAllJogos() {
    const db = await initDB();
    return db.getAll(STORE_NAME);
}

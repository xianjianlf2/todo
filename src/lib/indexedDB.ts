import type { MindMap as MindMapType } from "@/types/mindmap";

const DB_NAME = "MindMapDB";
const DB_VERSION = 1;
const STORE_NAME = 'mindmaps';

export class DBError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DBError';
    }
}

type DBStatus = 'uninitialized' | 'initializing' | 'ready' | 'error';

class DBManager {
    private static instance: DBManager;
    private db: IDBDatabase | null = null;
    private status: DBStatus = 'uninitialized';

    private constructor() {
        // Empty constructor is now removed
    }

    static getInstance(): DBManager {
        if (!DBManager.instance) {
            DBManager.instance = new DBManager();
        }
        return DBManager.instance;
    }

    async init(): Promise<void> {
        if (this.status === 'ready') return;
        if (this.status === 'initializing') {
            await this.waitForInitialization();
            return;
        }

        this.status = 'initializing';
        try {
            this.db = await this.openDatabase();
            this.status = 'ready';
        } catch (error) {
            this.status = 'error';
            throw new DBError(`Failed to initialize database: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private openDatabase(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(new DBError("Error opening database"));
            request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            };
        });
    }

    private waitForInitialization(): Promise<void> {
        return new Promise((resolve) => {
            const checkStatus = () => {
                if (this.status === 'ready' || this.status === 'error') {
                    resolve();
                } else {
                    setTimeout(checkStatus, 100);
                }
            };
            checkStatus();
        });
    }

    getDatabase(): IDBDatabase {
        if (!this.db) {
            throw new DBError("Database not initialized");
        }
        return this.db;
    }

    getStatus(): DBStatus {
        return this.status;
    }
}

export const initDB = (): Promise<void> => {
    return DBManager.getInstance().init();
};

export const isDBReady = async (): Promise<boolean> => {
    const dbManager = DBManager.getInstance();
    if (dbManager.getStatus() === 'uninitialized') {
        await dbManager.init();
    }
    return dbManager.getStatus() === 'ready';
};

export const saveMindMap = async (id: string | number, mindMap: MindMapType): Promise<number> => {
    const db = DBManager.getInstance().getDatabase();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = id === 'new' ? store.add(mindMap) : store.put(mindMap);

    return new Promise((resolve, reject) => {
        request.onerror = () => reject(new DBError("Error saving mindmap"));
        request.onsuccess = () => resolve(request.result as number);
    });
};

export const getMindMaps = async (): Promise<MindMapType[]> => {
    const db = DBManager.getInstance().getDatabase();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onerror = () => reject(new DBError("Error getting mindmaps"));
        request.onsuccess = () => resolve(request.result);
    });
};

export const getMindMapById = async (id: MindMapType["id"]): Promise<MindMapType | null> => {
    const db = DBManager.getInstance().getDatabase();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    return new Promise((resolve, reject) => {
        request.onerror = () => reject(new DBError("Error getting mindmap"));
        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result as MindMapType);
            } else {
                resolve(null);
            }
        };
    });
};

export const deleteMindMap = async (id: string): Promise<void> => {
    const db = DBManager.getInstance().getDatabase();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    return new Promise((resolve, reject) => {
        request.onerror = () => reject(new DBError("Error deleting mindmap"));
        request.onsuccess = () => resolve();
    });
};

export const batchOperation = async <T>(
    operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> => {
    const db = DBManager.getInstance().getDatabase();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const request = operation(store);
        request.onerror = () => reject(new DBError("Error performing batch operation"));
        request.onsuccess = () => resolve(request.result);
    });
};
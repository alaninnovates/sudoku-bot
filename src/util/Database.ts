import {Collection, Db, MongoClient} from 'mongodb';
import type {SudokuBoard} from './types';

interface SavedBoard {
    saveId: string;
    name: string;
    state: SudokuBoard['state'];
    timestamp: Date;
}

interface User {
    id: string;
    saves: {
        [saveId: string]: SavedBoard;
    };
}

const generateId = (length: number) => {
    const chars =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
};

export namespace Database {
    let db: Db;
    let usersColl: Collection<User>;
    export const connectDb = async () => {
        const client = new MongoClient(process.env['MONGODB_URI']!);
        await client.connect();
        db = client.db('db');
        usersColl = db.collection<User>('users');
    };
    export const getSavedBoard = async (
        userId: string,
        saveId: string,
    ): Promise<SavedBoard | undefined> => {
        const user = await usersColl.findOne({id: userId});
        if (!user) return;
        return user.saves[saveId];
    };
    export const getSaves = async (userId: string): Promise<SavedBoard[]> => {
        const user = await usersColl.findOne({id: userId});
        if (!user) return [];
        return Object.values(user.saves);
    };
    export const saveBoard = async (
        userId: string,
        board: SudokuBoard,
        name: string,
    ) => {
        const saveId = generateId(6);
        await usersColl.updateOne(
            {id: userId},
            {
                $set: {
                    [`saves.${saveId}`]: {
                        saveId,
                        name,
                        state: board.state,
                        timestamp: new Date(),
                    },
                },
            },
            {upsert: true},
        );
    };
    export const deleteSave = async (userId: string, saveId: string) => {
        await usersColl.updateOne(
            {id: userId},
            {
                $unset: {
                    [`saves.${saveId}`]: '',
                },
            },
        );
    };
}

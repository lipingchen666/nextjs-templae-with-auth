import { MongoClient } from 'mongodb';
import { getOneUserById, getOneUserByEmail, getAllUsers } from './userDao';
import clientPromise from '../mongodb';

console.log("url", globalThis.__MONGO_URI__);
jest.mock('../mongodb', () => ({
    __esModule: true,
    default: (async () => {
        return await MongoClient.connect(globalThis.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    })()
}))

describe('useDao', () => {
    afterAll(async () => {
        
        const client = await clientPromise;
        console.log("client", client);
        client.close();
    });

    it('get user by by unknown', async () => {
        const user = await getOneUserById("1");
        console.log("user", user);
        expect(user).toBeNull;
    });

    it('get user by by unknown email', async () => {
        const user = await getOneUserByEmail("flamechen123@gmail.com");
        console.log("user", user);
        expect(user).toBeNull;
    });

    it('get all users', async () => {
        const users = await getAllUsers();
        console.log("users", users);
        expect(users).toEqual([]);
    })
});
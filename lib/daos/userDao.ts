import clientPromise from "../mongodb"

export const getDB = async () => {
    const client = await clientPromise;
    const db = client.db('test');

    return db;
}

export const getOneUserById = async (id: string) => {
    const db = await getDB();
    const user = await db.collection("users").findOne({ id })

    return user
}

export const getOneUserByEmail = async (email: string) => {
    const db = await getDB();
    const user = await db.collection("users").findOne({ email })

    return user
}

export const getAllUsers = async () => {
    const db = await getDB();
    const user = await db.collection("users").find().toArray();

    return user;
}

export const getAllUsersCursor = async () => {
    const db = await getDB();
    const user = db.collection("users").find();

    return user;
}
import express from 'express';
import { deleteuserById, getUsers } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const deletedUser = await deleteuserById(id);

        return res.json(deletedUser);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error! Check if user id exists." });
    }
}
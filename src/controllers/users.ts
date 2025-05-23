import express from 'express';
import { deleteuserById, getUserById, getUsers } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json({message: "Successfully fetched all users!", users}).end;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const deletedUser = await deleteuserById(id);

        return res.json({deletedUser, message: "Successfully deleted user!"}).end;
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error! Check if user id exists." });
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;

        if(!username) {
            return res.status(400).json({ message: "Please provide a username" });
        }   

        const user = await getUserById(id);

        user.username = username;
        await user.save();

        return res.status(200).json({user, message: "Successfully update username!"}).end;
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error! Check if user id exists." });
    }
}
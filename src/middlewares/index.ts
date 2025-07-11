import express from 'express';
import { get, merge } from 'lodash';
import { getUserBySessionToken } from '../db/users';

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, "identity._id") as string;

        if(!currentUserId) {
            return res.status(403).json({ message: "Your account does not exist" });
        }

        if(currentUserId.toString() !== id) {
            return res.status(403).json({ message: "Error! you are not cleared to take this action!" });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Account not found" });
    }
}

export const isAuthenticated = async( req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies["JOSEPH-AUTH"];

        if (!sessionToken) {
            return res.status(400).json({ message: "You are not authenticated" });
        }

        const existingUser = await getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.status(400).json({ message: "This user does not exist"});
        }

        merge(req, { identity: existingUser });

        return next();
    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: "Not found" });
    }}

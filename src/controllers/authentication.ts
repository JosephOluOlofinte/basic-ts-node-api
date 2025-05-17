
import express from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { authentication, random } from '../helpers';

// Login controller
export const login = async (req: express.Request, res: express.Response) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        // check if user exists
        // if user does not exist, return 401
        if (!user) {
            return res.status(401).json({ message: "User does not exist" });
        }

        // authenticate user without password
        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            return res.status(401).json({ message: "Invalid password" });
        }
        
        // if user password matches expectedHash, update user session token
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        // set cookie with session token
        res.cookie('JOSEPH-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

// register controller
export const register = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password, username} = req.body;

        if (!email || !password || !username) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return res.sendStatus(409);
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        return res.status(201).json(user).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

// OAuth controller 
import express from 'express';
import { deleteUser, getAllUsers, updateUser } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middlewares';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers);
    router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);
    router.patch('/users/:id', isAuthenticated, isOwner, updateUser);
};

// This file defines the routes for the users. It imports the necessary modules and functions, and then exports a function that takes a router as an argument. The function defines a GET route for '/users' that is protected by the isAuthenticated middleware and calls the getAllUsers controller function.
// The isAuthenticated middleware checks if the user is authenticated by looking for a session token in the cookies and verifying it against the database. If the user is authenticated, the getAllUsers controller function is called to retrieve all users from the database and return them as a JSON response. If there are any errors, appropriate error messages are returned.
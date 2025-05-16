
import express from 'express';
import http from 'http';
import compression from "compression";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});

const MONGO_URL = 'mongodb+srv://josepholofinte:josepholofinte2232@cluster0.izd0aky.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (errror: Error) => {
    console.error('MongoDB connection error:', errror);
});

app.use('/', router());
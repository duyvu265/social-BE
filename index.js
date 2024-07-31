import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import { Server } from "socket.io";
import { register, login, update, sendRegistrationMail } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import { authenticationMiddleware } from "./middleware/auth.js";
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from "./routes/MessageRoutes.js";
import User from "./models/UserSchema.js";
import Post from "./models/PostSchema.js";
import { users, posts } from './data/data.js';

// Configurations
const app = express();
dotenv.config();

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Routes
app.post('/auth/register', register);
app.patch('/auth/update/:id', update);
app.post('/posts', authenticationMiddleware, createPost);
app.post('/auth/login', login);
app.post('/auth/register/otp', sendRegistrationMail);

app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/message', messageRoutes);

// Mongoose Setup
const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => console.log('Connected'));

        const server = app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
        const io = new Server(server, {
            cors: {
                origin: 'http://localhost:3000', // Thay đổi theo nguồn gốc của bạn
                credentials: true,
            }
        });
        global.onlineUsers = new Map();
        io.on("connection", (socket) => {
            global.chatsocket = socket;
            socket.on("addUser", (id) => {
                onlineUsers.set(id, socket.id);
            });

            socket.on("send-msg", (data) => {
                const sendUserSocket = onlineUsers.get(data.to);
                if (sendUserSocket) {
                    socket.to(sendUserSocket).emit("msg-recieve", data.message);
                }
            });
        });
        /* ADD DATA ONE TIME */
        // User.insertMany(users);
        // Post.insertMany(posts);
    } catch (error) {
        console.log(error);
    }
}

start();

import express from "express"
import "dotenv/config"
import cors from "cors"
import http from "http"
import { connectDB } from "./lib/db.js"
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)

// Initialize socket.io
export const io = new Server(server, {
    cors: { origin: "*" }
})

// store online users
export const userSocketMap = {} // {userId: socketId}

// socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected", userId)

    if (userId) {
        userSocketMap[userId] = socket.id;

        // emit online users
        io.emit("getOnlineUsers", Object.keys(userSocketMap))

        socket.on("disconnect", () => {
            console.log("User disconnected", userId)
            delete userSocketMap[userId]

            io.emit("getOnlineUsers", Object.keys(userSocketMap))
        })
    }
})

// middleware
app.use(express.json({ limit: "4mb" }))
app.use(cors())

// routes
app.use("/api/status", (req, res) => {
    res.send("Server is live")
})

app.use("/api/auth", userRouter)
app.use("/api/messages", messageRouter)

// mongodb connect
await connectDB()

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
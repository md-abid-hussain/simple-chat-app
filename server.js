import {createServer} from 'http'
import {Server} from 'socket.io'
import express from 'express'
import path from 'path'

const PORT = process.env.PORT || 3500

const app = express()

const httpServer = createServer(app)

const socketIO = new Server(httpServer,{
    cors:{
        origin:process.env.NODE_ENV === 'production' ? false : ['http://localhost:5500','http://127.0.0.1:5500','https://good-lemur-causal.ngrok-free.app','https://good-lemur-causal.ngrok-free.app/app/']
    }
})

app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'))
})

socketIO.on('connection',(socket)=>{
    console.log(`User ${socket.id} connected`)
    
    socket.on('message',(data)=>{
        const parseData = JSON.parse(data)
        parseData.username = parseData.username || socket.id.substring(0,5).toUpperCase()
        socketIO.emit('chat message',JSON.stringify(parseData))
    })

    socket.on('disconnect',()=>{
        console.log(`User ${socket.id} disconnected`)
    })
})

httpServer.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})
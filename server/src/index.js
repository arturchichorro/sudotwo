import Fastify from 'fastify'
import { randomBytes } from 'crypto'

const fastify = Fastify({ logger: true })

const rooms = new Map()

function generateRoomId() {
  return randomBytes(4).toString('hex').toUpperCase()
}

await fastify.register(import('@fastify/websocket'))
await fastify.register(import('@fastify/cors'))

fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    console.log('Client connected')
    let currentRoomId = null
    
    connection.on('message', (message) => {
      const data = JSON.parse(message.toString())
      console.log('Received:', data)
      
      if (data.type === 'join-room') {
        const roomId = data.roomId || generateRoomId()
        
        if (!rooms.has(roomId)) {
          rooms.set(roomId, {
            players: [],
            gameState: {}
          })
        }
        
        const room = rooms.get(roomId)
        room.players.push(connection)
        currentRoomId = roomId
        
        console.log(`Player joined room ${roomId}. Players: ${room.players.length}`)
        
        connection.send(JSON.stringify({
          type: 'room-joined',
          roomId: roomId,
          playerCount: room.players.length
        }))
        
        room.players.forEach(player => {
          player.send(JSON.stringify({
            type: 'player-count-update',
            playerCount: room.players.length
          }))
        })
      }
    })
    
    connection.on('close', () => {
      console.log('Client disconnected')
      
      if (currentRoomId && rooms.has(currentRoomId)) {
        const room = rooms.get(currentRoomId)
        room.players = room.players.filter(player => player !== connection)
        
        if (room.players.length === 0) {
          rooms.delete(currentRoomId)
          console.log(`Room ${currentRoomId} deleted - no players`)
        } else {
          room.players.forEach(player => {
            player.send(JSON.stringify({
              type: 'player-count-update',
              playerCount: room.players.length
            }))
          })
        }
      }
    })
  })
})

const start = async () => {
  try {
    await fastify.listen({ port: 3001 })
    console.log('Server running on port 3001')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
import { create } from 'zustand'
import type { Board, CellPosition } from '../types'

interface SudokuStore {
    
    board: Board
    initialBoard: Board
    solutionBoard: Board
    selectedCell: CellPosition | null
    
    socket: WebSocket | null
    isConnected: boolean
    roomId: string | null
    playerCount: number

    setCell: (row: number, col: number, value: number) => void // Should be local, when I add the server make it server
    selectCell: (row: number, col: number) => void
    clearSelection: () => void

    loadSudoku: (puzzle: string, solution: string) => void
    connectToServer: () => void
    disconnectFromServer: () => void
    joinRoom: (roomId?: string) => void
}

const emptyBoard = (): Board => Array.from({ length: 9 }, () => Array(9).fill(0))

function parseBoard(sudoStr: string): Board {
    if (sudoStr.length !== 81) throw new Error('Sudoku string must be exactly 81 characters');
    
    const toNum = (ch: string): number => {
        if (ch === '.' || ch === '0') return 0
        if (ch >= '1' && ch <= '9') return ch.charCodeAt(0) - 48
        throw new Error(`Invalid character "${ch}" in Sudoku string`)
    }

    return Array.from({ length: 9 }, (_, r) => 
        Array.from({length: 9}, (_, c) => toNum(sudoStr[r * 9 + c]))
    )
}

const useSudokuStore = create<SudokuStore>((set, get) => ({
    board: emptyBoard(),
    initialBoard: emptyBoard(),
    solutionBoard: emptyBoard(),
    selectedCell: null,

    socket: null,
    isConnected: false,
    roomId: null,
    playerCount: 0,
    
    setCell: (row, col, value) => set((state) => ({
        board: state.board.map((r, rIdx) => 
        r.map((c, cIdx) => rIdx === row && cIdx === col ? value : c)
        )
    })),
    
    selectCell: (row, col) => set({ selectedCell: { row, col } }),
    
    clearSelection: () => set({ selectedCell: null }),

    loadSudoku: (puzzle, solution) => {
        const puzzleBoard = parseBoard(puzzle);
        const solutionBoard = parseBoard(solution);

        set({
            initialBoard: puzzleBoard,
            board: puzzleBoard.map((row) => row.slice()),
            solutionBoard,
            selectedCell: null,
        })
    },
    connectToServer: () => {
        const { socket } = get()
  
        if (socket && socket.readyState === WebSocket.OPEN) {
            return
        }
        
        if (socket) {
            socket.close()
        }
        
        const newSocket = new WebSocket('ws://localhost:3001/ws')
    
        newSocket.onopen = () => {
            console.log('Connected to server')
            set({ socket: newSocket, isConnected: true })
        }
        
        newSocket.onclose = () => {
            console.log('Disconnected from server')
            set({ socket: null, isConnected: false })
        }

        newSocket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            console.log('Received from server:', data)
            
            if (data.type === 'room-joined') {
                set({ roomId: data.roomId, playerCount: data.playerCount })
            }
            
            if (data.type === 'player-count-update') {
                set({ playerCount: data.playerCount })
            }
        }
    },
  
    disconnectFromServer: () => {
        const { socket } = get()
        if (socket) {
            socket.close()
            set({ socket: null, isConnected: false })
        }
    },

    joinRoom: (roomId) => {
        const { socket } = get()
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'join-room',
                roomId: roomId
            }))
        }
    },
}))

export default useSudokuStore
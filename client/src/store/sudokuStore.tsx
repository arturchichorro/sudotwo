import { create } from 'zustand'
import type { Board, CellPosition } from '../types'

interface SudokuStore {
    
    board: Board
    initialBoard: Board
    solutionBoard: Board
    selectedCell: CellPosition | null
    setCell: (row: number, col: number, value: number) => void
    selectCell: (row: number, col: number) => void
    clearSelection: () => void
}

const useSudokuStore = create<SudokuStore>((set) => ({
    board: Array(9).fill(null).map(() => Array(9).fill(0)),
    initialBoard: Array(9).fill(null).map(() => Array(9).fill(0)),
    solutionBoard: Array(9).fill(null).map(() => Array(9).fill(0)),
    selectedCell: null,
    
    setCell: (row, col, value) => set((state) => ({
        board: state.board.map((r, rIdx) => 
        r.map((c, cIdx) => rIdx === row && cIdx === col ? value : c)
        )
    })),
    
    selectCell: (row, col) => set({ selectedCell: { row, col } }),
    
    clearSelection: () => set({ selectedCell: null })
}))

export default useSudokuStore
import { create } from 'zustand'
import type { Board, CellPosition } from '../types'

interface SudokuStore {
    
    board: Board
    initialBoard: Board
    solutionBoard: Board
    selectedCell: CellPosition | null

    setCell: (row: number, col: number, value: number) => void // Should be local, when I add the server make it server
    selectCell: (row: number, col: number) => void
    clearSelection: () => void

    loadSudoku: (puzzle: string, solution: string) => void
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

const useSudokuStore = create<SudokuStore>((set) => ({
    board: emptyBoard(),
    initialBoard: emptyBoard(),
    solutionBoard: emptyBoard(),
    selectedCell: null,
    
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
}))

export default useSudokuStore
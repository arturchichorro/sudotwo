import SudokuBoard from "./SudokuBoard"

const SudokuGame = () => {
    return (
        <div className="flex flex-col justify-center items-center gap-6">
            <h1 className="text-5xl font-bold text-gray-100">Sudoku</h1>
            <SudokuBoard />
        </div>
    )
}

export default SudokuGame

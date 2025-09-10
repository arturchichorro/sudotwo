import SudokuBoard from "./SudokuBoard"
import SudokuControls from "./SudokuControls"

const SudokuGame = () => {
    return (
        <div className="flex flex-col justify-center items-center gap-6">
            <h1 className="text-5xl font-bold text-gray-100">Sudotwo</h1>
            <SudokuBoard />
            <SudokuControls />
        </div>
    )
}

export default SudokuGame

import { useState } from "react"
import useSudokuStore from "../store/sudokuStore";

const SudokuControls = () => {
    const loadSudoku = useSudokuStore((state) => state.loadSudoku);
    
    const [formSudoku, setFormSudoku] = useState("");
    const [formSolution, setFormSolution] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            loadSudoku(formSudoku.trim(), formSolution.trim())
        } catch (err) {
            if (err instanceof Error) setError(err.message);
            else setError('Failed to load Sudoku');
        }
    }



    return (
        <div className="flex flex-col gap-2 justify-center items-center">
            <form onSubmit={handleSubmit} className="flex gap-6">
                <input 
                    type="text"
                    value={formSudoku}
                    onChange={(e) => setFormSudoku(e.target.value)}
                    className="w-full rounded-lg bg-gray-700 text-gray-200 placeholder-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input 
                    type="text"
                    value={formSolution}
                    onChange={(e) => setFormSolution(e.target.value)}
                    className="w-full rounded-lg bg-gray-700 text-gray-200 placeholder-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button type="submit" className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 transition">
                    Load Sudoku
                </button>
            </form>
            {error && <p className="text-white">{error}</p>}
        </div>
    )
}

export default SudokuControls

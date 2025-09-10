import useSudokuStore from "../store/sudokuStore"

const SudokuBoard = () => {
    const board = useSudokuStore((state) => state.board);
    const initialBoard = useSudokuStore((state) => state.initialBoard);
    const selectedCell = useSudokuStore((state) => state.selectedCell);
    const setCell = useSudokuStore((state) => state.setCell);
    const selectCell = useSudokuStore((state) => state.selectCell);
    const clearSelection = useSudokuStore((state) => state.clearSelection);

    return (
        <div className="bg-white p-4 rounded-xl">
            <table className="border-collapse
                [&>tbody>tr:nth-child(3)>td]:border-b-2 [&>tbody>tr:nth-child(3)>td]:border-b-gray-700
                [&>tbody>tr:nth-child(6)>td]:border-b-2 [&>tbody>tr:nth-child(6)>td]:border-b-gray-700
                [&>tbody>tr:nth-child(9)>td]:border-b-2 [&>tbody>tr:nth-child(9)>td]:border-b-gray-700
                [&>tbody>tr:first-child>td]:border-t-2  [&>tbody>tr:first-child>td]:border-t-gray-700
            ">
                <tbody>
                    {board.map((row, rIdx) => {
                        return (
                            <tr key={rIdx}>
                                {row.map((cell, cIdx) => {

                                    const isPrefilled = initialBoard[rIdx][cIdx] !== 0;
                                    const isHighligted = selectedCell &&
                                        (
                                            rIdx === selectedCell.row ||
                                            cIdx === selectedCell.col ||
                                            (
                                                Math.floor(rIdx / 3) === Math.floor(selectedCell.row / 3) &&
                                                Math.floor(cIdx / 3) === Math.floor(selectedCell.col / 3)
                                            )
                                        )

                                    return (
                                        <td key={cIdx} className={`border border-gray-300
                                            nth-3:border-r-2 nth-3:border-r-gray-700
                                            nth-6:border-r-2 nth-6:border-r-gray-700
                                            nth-9:border-r-2 nth-9:border-r-gray-700
                                            nth-1:border-l-2 nth-1:border-l-gray-700
                                            ${isHighligted ? 'bg-[#e6f0ff]' : ''}
                                        `}>
                                            <input
                                                className={`w-12 h-12 text-center text-xl border-none outline-none cursor-default focus:bg-[#78b1eb] focus:caret-transparent ${isPrefilled ? "text-gray-400" : "text-gray-900"}`}
                                                type="text"
                                                readOnly={isPrefilled}
                                                maxLength={1}
                                                value={cell === 0 ? '' : cell}
                                                onClick={() => selectCell(rIdx, cIdx)}
                                                onFocus={() => selectCell(rIdx, cIdx)}
                                                onBlur={() => clearSelection()}
                                                onChange={(e) => setCell(rIdx, cIdx, Number(e.target.value))}
                                            />
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default SudokuBoard

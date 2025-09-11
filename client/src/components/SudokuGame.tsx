import { useEffect } from "react"
import SudokuBoard from "./SudokuBoard"
import SudokuControls from "./SudokuControls"
import useSudokuStore from "../store/sudokuStore"

const SudokuGame = () => {

    const connectToServer = useSudokuStore((state) => state.connectToServer);
    const disconnectFromServer = useSudokuStore((state) => state.disconnectFromServer);
    const joinRoom = useSudokuStore((state) => state.joinRoom);
    const isConnected = useSudokuStore((state) => state.isConnected);
    const roomId = useSudokuStore((state) => state.roomId);
    const playerCount = useSudokuStore((state) => state.playerCount);

    useEffect(() => {
        if (!isConnected) {
            connectToServer()
        }
        return () => disconnectFromServer()
    }, [])

    useEffect(() => {
        if (isConnected && !roomId) {
            joinRoom()
        }
    }, [isConnected, roomId])

    return (
        <div className="flex flex-col justify-center items-center gap-6">
            <h1 className="text-5xl font-bold text-gray-100">Sudotwo</h1>

            <div className="flex gap-4 text-sm">
                {isConnected ? (
                    <span className="text-green-400">✓ Connected</span>
                ) : (
                    <span className="text-red-400">✗ Disconnected</span>
                )}
                
                {roomId && (
                    <span className="text-blue-400">
                        Room: {roomId} ({playerCount}/2 players)
                    </span>
                )}
            </div>

            <SudokuBoard />
            <SudokuControls />
        </div>
    )
}

export default SudokuGame

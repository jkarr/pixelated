import styles from "./gameBoard.module.css";

export default function GameBoard({ board, numberOfColumns }) {
    const boardStyle = {
        gridTemplateColumns: `repeat(${numberOfColumns}, 25px)`
    }

    const rows = [];

    for (let r = 0; r < board.length; r++) {
        const cells = [];
        for (let c = 0; c < board[r].length; c++) {
            cells.push(
                <div key={c}
                    className={styles.gameCell}
                    style={{
                        backgroundColor: board[r][c].hexValue
                    }}></div>
            )
        }

        rows.push(
            <div key={r}>
                {cells}
            </div>
        )
    }

    return (
        <section style={boardStyle}
            className={styles.gameBoard}
            id="table">
            {rows}
        </section>
    )
}
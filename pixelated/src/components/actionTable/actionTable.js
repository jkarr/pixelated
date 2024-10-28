import styles from "./actionTable.module.css";
import Color from "../../utils/color";

export default function ActionTable({ onActionClick }) {
    const divs = [];

    for (let c = 0; c < Color.colors.length; c++) {
        divs.push(
            <div
                key={c}
                className={styles.actionCell}
                style={{
                    backgroundColor: Color.colors[c].hexValue
                }}
                onClick={() => onActionClick(Color.colors[c])}
            ></div>
        );
    }

    return (
        <div className={styles.actionTable} id="actionTable">
            {divs}
        </div>
    )
};
import { useState, useEffect } from 'react';

export default function useMaxBoardSize(cellSize, minSize = 5, maxSize = 25) {
    const [maxBoardSize, setMaxBoardSize] = useState(maxSize);

    useEffect(() => {
        function updateMaxBoardSize() {
            const screenWidth = window.innerWidth;
            const padding = 75; // Adjust for margins/padding
            const availableWidth = screenWidth - padding;
            const calculatedSize = Math.floor(availableWidth / cellSize);

            // Clamp the size to your allowed range
            setMaxBoardSize(Math.min(Math.max(calculatedSize, minSize), maxSize));
        }

        // Run on load and on resize
        updateMaxBoardSize();
        window.addEventListener('resize', updateMaxBoardSize);

        // Cleanup event listener
        return () => window.removeEventListener('resize', updateMaxBoardSize);
    }, [cellSize, minSize, maxSize]);

    return maxBoardSize;
}

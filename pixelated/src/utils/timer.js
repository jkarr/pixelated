import {useState, useRef, useCallback} from 'react';

export default function useTimer() {
    const [elapsedTime, setElapsedTime] = useState(0);
    const startTime = useRef(0);
    const activeFrames = useRef(new Set());

    // Updates the timer continuously
    const updateTimer = useCallback(() => {
        const now = Date.now();
        const delta = now - startTime.current;

        setElapsedTime(prevElapsedTime => prevElapsedTime + delta);
        startTime.current = now;

        const frameId = requestAnimationFrame(updateTimer);
        activeFrames.current.add(frameId);
    }, []);

    // Starts the timer
    const startTimer = useCallback(() => {
        if (activeFrames.current.size > 0) return; // Prevent multiple timers

        startTime.current = Date.now();
        const frameId = requestAnimationFrame(updateTimer);
        activeFrames.current.add(frameId);
    }, [updateTimer]);

    // Stops the timer
    const stopTimer = useCallback(() => {
        for (const frame of activeFrames.current) {
            cancelAnimationFrame(frame);
        }
        activeFrames.current.clear();
    }, []);

    // Reset the timer
    const resetTimer = useCallback(() => {
        stopTimer();
        setElapsedTime(0);
    }, [stopTimer]);

    return {elapsedTime, startTimer, stopTimer, resetTimer};
}

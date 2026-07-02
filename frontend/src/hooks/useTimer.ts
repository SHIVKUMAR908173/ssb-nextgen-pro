import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
    initialTime: number; // in seconds
    onExpire?: () => void;
    autoStart?: boolean;
}

export function useTimer({ initialTime, onExpire, autoStart = false }: UseTimerOptions) {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(autoStart);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const onExpireRef = useRef(onExpire);

    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    const clearTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const start = useCallback(() => {
        setIsRunning(true);
    }, []);

    const pause = useCallback(() => {
        setIsRunning(false);
    }, []);

    const reset = useCallback((newTime?: number) => {
        clearTimer();
        setTimeLeft(newTime ?? initialTime);
        setIsRunning(false);
    }, [initialTime, clearTimer]);

    const setTimeAndStart = useCallback((newTime: number) => {
        clearTimer();
        setTimeLeft(newTime);
        setIsRunning(true);
    }, [clearTimer]);

    useEffect(() => {
        if (!isRunning || timeLeft <= 0) {
            clearTimer();
            if (timeLeft <= 0 && isRunning) {
                setIsRunning(false);
                onExpireRef.current?.();
            }
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return clearTimer;
    }, [isRunning, timeLeft, clearTimer]);

    const formattedTime = `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;

    return {
        timeLeft,
        formattedTime,
        isRunning,
        start,
        pause,
        reset,
        setTimeAndStart
    };
}

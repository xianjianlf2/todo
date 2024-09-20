import { DEFAULT_SIDEBAR_WIDTH, MIN_SIDEBAR_WIDTH } from '@/lib/const';
import { useCallback, useEffect, useState } from 'react';

export const useSidebarResize = () => {
    const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = useCallback(() => setIsDragging(true), []);
    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) {
            const newWidth = document.body.clientWidth - e.clientX;
            setSidebarWidth(Math.max(MIN_SIDEBAR_WIDTH, newWidth));
        }
    }, [isDragging]);

    useEffect(() => {
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, [handleMouseUp, handleMouseMove]);

    return { sidebarWidth, handleMouseDown };
};
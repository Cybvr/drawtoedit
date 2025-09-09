
import { useState, useCallback } from 'react';

export const useCanvasHistory = (initialState: string[] = []) => {
  const [history, setHistory] = useState<string[]>(initialState.length > 0 ? initialState : ['']);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  const pushHistory = useCallback((newState: string) => {
    // If we are in the middle of history, slice it
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  }, [history, currentHistoryIndex]);

  const undo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
    }
  }, [currentHistoryIndex]);

  const redo = useCallback(() => {
    if (currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1);
    }
  }, [currentHistoryIndex, history.length]);

  const resetHistory = useCallback(() => {
    setHistory(['']);
    setCurrentHistoryIndex(0);
  }, []);

  return { history, currentHistoryIndex, pushHistory, undo, redo, resetHistory };
};

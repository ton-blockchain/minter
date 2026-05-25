import { useState, useEffect, useCallback } from "react";

interface CreatedToken {
  address: string;
  name: string;
  symbol: string;
  timestamp: number;
}

const STORAGE_KEY = "created_tokens";

const loadTokens = (): CreatedToken[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveTokens = (tokens: CreatedToken[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
};

export function useCreatedTokens() {
  const [tokens, setTokens] = useState<CreatedToken[]>(loadTokens);

  const addToken = useCallback((token: CreatedToken) => {
    setTokens((prev) => {
      const exists = prev.find((t) => t.address === token.address);
      if (exists) return prev;
      const updated = [token, ...prev];
      saveTokens(updated);
      return updated;
    });
  }, []);

  const removeToken = useCallback((address: string) => {
    setTokens((prev) => {
      const updated = prev.filter((t) => t.address !== address);
      saveTokens(updated);
      return updated;
    });
  }, []);

  return { tokens, addToken, removeToken };
}

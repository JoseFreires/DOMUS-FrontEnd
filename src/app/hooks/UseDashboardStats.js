import { useState, useEffect, useCallback } from "react";
import { sindicoStatCard, porteiroStatCard } from "@/app/components/Card/StatCard/data";

const MOCKS = {
    ROLE_ADMIN:    sindicoStatCard,
    ROLE_SINDICO:  sindicoStatCard,
    ROLE_PORTEIRO: porteiroStatCard,
};

export function useDashboardStats(role) {
    const [cards,     setCards]     = useState(null);
    const [isLoading, setIsLoading] = useState(true);
 
    const fetchStats = useCallback(async () => {
        setIsLoading(true);
 
        await new Promise((r) => setTimeout(r, 0));
        setCards(MOCKS[role] ?? []);
        setIsLoading(false);
        return;

    }, [role]);
 
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);
 
    return { cards, isLoading, fetchStats };
}
import { useEffect, useState } from "react";
import { listMyEncomendas } from "@/features/encomendas/services/myEncomendasGET";

export function useMyEncomendas() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchMyEncomendas() {
            const encomendas = await listMyEncomendas();

            if (isMounted) {
                setData(Array.isArray(encomendas) ? encomendas : []);
                setIsLoading(false);
            }
        }

        fetchMyEncomendas();

        return () => {
            isMounted = false;
        };
    }, []);

    return { data, isLoading };
}

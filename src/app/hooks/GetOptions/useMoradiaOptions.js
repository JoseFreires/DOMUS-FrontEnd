import { useState, useEffect } from "react";
import { listMoradia } from "@/app/services/Moradia/GET.js";

export function useMoradiaOptions() {
    const [options, setOptions] = useState([]);
    const [isoptionLoading, setIsoptionLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setIsoptionLoading(true);

        listMoradia().then((data) => {
            if (!mounted) return;
            setOptions(
                (data ?? []).map((m) => ({
                    value:m.idMoradia,
                    label: m.numero ?? String(m.idmoradia),
                    idBloco: m.blocoIdBloco ,
                }))
            );
        }).catch(() => {

            if (mounted) setOptions([]);
        }).finally(() => {
            
            if (mounted) setIsoptionLoading(false);
        });
        return () => { mounted = false; };
    }, []);

    return { options, isoptionLoading };
}
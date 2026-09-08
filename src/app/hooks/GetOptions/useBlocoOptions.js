import {useState, useEffect} from "react";
import {listBloco} from "@/app/services/Bloco/GET.js";

export function useBlocoOptions() {
    const [options, setOptions] = useState([]);
    const [isoptionLoading, setIsoptionLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setIsoptionLoading(true);

        listBloco().then((data) => {
            if (!mounted) return;
            setOptions(
                (data ?? []).map((b) => ({
                    value: b.idBloco,
                    label: b.nomeTorre ?? String(b.idBloco),
                }))
            );
        }
        ).catch(() => {
            if (mounted) setOptions([]);
        }
        ).finally(() => {
            if (mounted) setIsoptionLoading(false);
        } 
        );
        return () => { mounted = false; };
    }, []);

    return { options, isoptionLoading };
}
export async function listAvisos() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL; 

    try {
        const response = await fetch(`${API_URL}/avisos`, {
            method: "GET",
           credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching avisos data:", error);
        return null;
    }
}

export async function listAvisosDesativados() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL; 

    try {
        const response = await fetch(`${API_URL}/avisos/desativados`, {
            method: "GET",
           credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching desativados data:", error);
        return null;
    }
}
export async function getLogs() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL; 

    try {
        const response = await fetch(`${API_URL}/logs`, {
            method: "GET",
           credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching bloco data:", error);
        return null;
    }
}
export default getLogs;

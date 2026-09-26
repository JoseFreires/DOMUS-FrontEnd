export function parseItemDate(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function isWithinDateRange(itemDate, filters) {
    if (!filters.startDate && !filters.endDate) return true;
    if (!itemDate) return false;
 
    if (filters.startDate && itemDate < new Date(filters.startDate)) {
        return false;
    }
 
    if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        if (itemDate > end) return false;
    }
 
    return true;
}
export const formatDate = (dateStr: string | null | undefined): string | null => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

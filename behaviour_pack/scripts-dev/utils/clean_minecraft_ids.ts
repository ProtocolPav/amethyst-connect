
export default function clean_id(id: string) {
    return id.replace(/^[^:]+:/, "") // Remove the "XXXX:" prefix
            .replace(/_/g, " ")        // Replace underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
}
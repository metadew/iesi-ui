export default function isValidDate(date: Date) {
    return !Number.isNaN(date.getTime());
}

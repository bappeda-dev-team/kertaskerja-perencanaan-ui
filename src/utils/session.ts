export function getSessionExpiry(): number | null {
    if (typeof document === "undefined") return null;
    const raw = document.cookie
        .split("; ")
        .find((c) => c.startsWith("session_hint="))
        ?.split("=")[1];
    if (!raw) return null;

    const [expStr] = decodeURIComponent(raw).split(".");
    const exp = Number(expStr);
    return Number.isFinite(exp) ? exp : null;
}

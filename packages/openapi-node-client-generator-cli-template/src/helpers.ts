export function findCookie(name: string): string | undefined {
    /* handle when document or cookie does not exist, e.g. when DOM isn't
     * present */
    if (!document?.cookie) {
        return undefined;
    }

    const cookieKeyValueStrings = document.cookie.split(";");

    for (const cookie of cookieKeyValueStrings) {
        const [foundCookieName, foundCookieValue] = cookie.split("=", 2);
        if (name === foundCookieName.trim()) {
            return foundCookieValue
                ? decodeURIComponent(foundCookieValue)
                : undefined;
        }
    }

    return undefined;
}

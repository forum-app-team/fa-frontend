export const resolvePath = (pattern, params = {}) =>
    (pattern || "").replace(/:([A-Za-z0-9_]+)/g, (_, k) =>
        encodeURIComponent(params?.[k] ?? `:${k}`)
    );
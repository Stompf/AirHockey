export function getConfig() {
    return {
        NETWORK_INTERVAL: Number(process.env.LUNNE_WEB_NETWORK_INTERVAL) || 1 / 20,
        FIXED_TIME_STEP: Number(process.env.LUNNE_WEB_FIXED_TIME_STEP) || 1 / 60,
        MAX_SUB_STEPS: Number(process.env.LUNNE_WEB_MAX_SUB_STEPS) || 10,
    };
}

export type Config = ReturnType<typeof getConfig>;

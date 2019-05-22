import { DeepReadonly } from 'src/shared';

const flagsInternal = {
    INVULNERABLE: false,
    SPAWN_ASTEROIDS: true,
    DEBUG_PHYSICS: false,
};

export const flags: DeepReadonly<typeof flagsInternal> = flagsInternal;

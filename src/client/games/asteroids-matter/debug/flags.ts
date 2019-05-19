import { DeepReadonly } from 'src/shared';

const flagsInternal = {
    INVULNERABLE: false,
    SPAWN_ASTEROIDS: true,
};

export const flags: DeepReadonly<typeof flagsInternal> = flagsInternal;

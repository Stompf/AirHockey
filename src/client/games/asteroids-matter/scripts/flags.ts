import { DeepReadonly } from 'src/shared';

const flagsInternal = {
    INVULNERABLE: false,
};

export const flags: DeepReadonly<typeof flagsInternal> = flagsInternal;

import * as React from 'react';
import { TextField } from '@material-ui/core';
import {host, join} from './scripts/webrtc'

export const WebRTC: React.FunctionComponent = () => {
    const inputEl = React.useRef<HTMLInputElement>(null);  
    return (
    <div style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
        <button type='button' onClick={() => host()} >Host</button>
        <TextField type="text" inputRef={inputEl} />
        <button type='button' onClick={() => join(inputEl.current!.value)}>Join</button>
    </div>
)};

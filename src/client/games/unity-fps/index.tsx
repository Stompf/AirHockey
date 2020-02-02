import * as React from 'react';

export const UnityFps: React.FunctionComponent = () => (
    <div style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
        <iframe
            title="LunneFps"
            id="serviceFrameSend"
            src="./unity-fps/index.html"
            width="100%"
            height="100%"
        />
    </div>
);

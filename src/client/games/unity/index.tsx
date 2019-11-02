import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

export class Unity extends React.Component<RouteComponentProps<any>, {}> {

    public render() {
        return <div style={{
            overflow: 'hidden',
            width: '100%',
            height: '100%'
        }}><iframe id="serviceFrameSend" src="./unity/index.html" width="100%" height="100%"></iframe></div>
    }
}

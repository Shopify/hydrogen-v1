import React, { ReactNode } from 'react';
declare global {
    var __HYDROGEN_DEV__: boolean;
}
export interface ServerState {
    pathname: string;
    search: string;
    [key: string]: any;
}
declare type ServerStateSetterInput = ((prev: ServerState) => Partial<ServerState>) | Partial<ServerState> | string;
export interface ServerStateSetter {
    (input: ServerStateSetterInput, propValue?: any): void;
}
interface ProposedServerStateSetter {
    (input: ServerStateSetterInput, propValue?: any): ServerState;
}
export interface ServerStateContextValue {
    pending: boolean;
    serverState: ServerState;
    setServerState: ServerStateSetter;
    getProposedServerState: ProposedServerStateSetter;
}
export declare const ServerStateContext: React.Context<ServerStateContextValue>;
interface ServerStateProviderProps {
    serverState: ServerState;
    setServerState: React.Dispatch<React.SetStateAction<ServerState>>;
    children: ReactNode;
}
export declare function ServerStateProvider({ serverState, setServerState, children, }: ServerStateProviderProps): JSX.Element;
export {};

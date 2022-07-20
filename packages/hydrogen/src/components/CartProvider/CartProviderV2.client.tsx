// import React from 'react';
// import Debug from 'robot3/debug';
// import {createMachine, invoke, reduce, state, transition} from 'robot3';
// import {useMachine} from 'react-robot';

import React, {useCallback} from 'react';
import {
  createMachine,
  state,
  transition,
  d,
  interpret,
  invoke,
  reduce,
} from 'robot3';
import {useSyncExternalStore} from 'react';

const createStore = (initialState) => {
  let state = initialState;
  const getState = () => state;
  const listeners = new Set();
  const setState = (fn) => {
    state = fn(state);
    listeners.forEach((l) => l());
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  return {getState, setState, subscribe};
};

const useStore = (store, selector) => {
  return useSyncExternalStore(
    store.subscribe,
    useCallback(() => selector(store.getState()), [store, selector]),
    useCallback(() => selector(store.getState()), [store, selector])
  );
};

d._onEnter = function (machine, to, state, prevState, event) {
  // compare states and log the differences
  console.log({machine, to, state, prevState, event});
};

type User = {
  id: number;
  name: string;
};

type UserContext = () => {
  users: User[];
  error: String;
};

const context: UserContext = () => ({
  users: [],
  error: '',
});

const machine = createMachine(
  {
    idle: state(transition('fetch', 'loading')),
    loading: invoke(
      loadUsers,
      transition(
        'done',
        'loaded',
        reduce((ctx, ev) => {
          console.log({...ctx, users: ev.data});
          return {...ctx, users: ev.data};
        })
      ),
      transition(
        'error',
        'loaded',

        reduce((ctx, ev) => {
          console.log({...ctx, error: ev.data});
          return {...ctx, error: ev.data};
        })
      )
    ),
    loaded: state(),
  },
  context
);
const machineStore = createStore({
  current: machine,
  send: () => {},
});

const service = interpret(machine, () => {
  machineStore.setState(() => ({
    current: service.machine.current,
    send: service.send,
  }));
});

service.send('toggle');

async function loadUsers() {
  console.log('users loaded');
  return [
    {id: 1, name: 'Wilbur'},
    {id: 2, name: 'Matthew'},
    {id: 3, name: 'Anne'},
  ];
}

function useMachine(store) {
  const current = useStore(
    store,
    useCallback((state) => state.current, [])
  );
  const send = useStore(
    store,
    useCallback((state) => state.send, [])
  );
  return [current, send];
}

export function CartProviderV2() {
  const [current, send] = useMachine(machineStore);
  const state = current.name;
  const {users, error} = current.context;
  const disableButton = state === 'loading' || state === 'loaded';

  const handleClick = React.useCallback(() => {
    send('fetch');
  }, [send]);

  console.log(current.name);

  return (
    <>
      {state === 'loading' ? (
        <div>Loading users...</div>
      ) : state === 'loaded' ? (
        <ul>
          {users.map((user) => {
            <li id={`user-${user.id}`}>{user.name}</li>;
          })}
        </ul>
      ) : null}

      <div>{current.name}</div>

      <div>{error}</div>

      <div>{JSON.stringify(current)}</div>

      <button onClick={handleClick} disabled={disableButton}>
        Load users
      </button>
    </>
  );
}

// export function CartProviderV2() {
//   const machine = useStore(
//     machineStore,
//     useCallback((state) => state.current, [])
//   );

//   const send = useStore(
//     machineStore,
//     useCallback((state) => state.send, [])
//   );

//   console.log(send);
//   return (
//     <>
//       <div>{JSON.stringify(machine)}</div>
//       <div>{JSON.stringify(send)}</div>
//       <button onClick={() => send('toggle')}>Toggle</button>
//     </>
//   );
// }

'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store'; // Make sure this path is correct

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // The store is created only once
  const storeRef = useRef(store);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
// This component wraps your application with the Redux Provider
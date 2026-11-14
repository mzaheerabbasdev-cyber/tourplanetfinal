'use client';

import React, { createContext, useContext } from 'react';

const HeaderConfigContext = createContext<any>(null);

export function HeaderConfigProvider({ value, children }: { value: any; children: React.ReactNode }) {
  return <HeaderConfigContext.Provider value={value}>{children}</HeaderConfigContext.Provider>;
}

export const useHeaderConfig = () => useContext(HeaderConfigContext);

import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const StateProvider = ({value, children }) => {
    
    return (
        <StateContext.Provider value={value}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
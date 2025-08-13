import React, { createContext, useState, useEffect, useContext } from 'react';
import { initWeb3, setAccountChangeCallback } from '../utils/web3';

const AccountContext = createContext();

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeWeb3 = async () => {
      try {
        await initWeb3();
        const { web3 } = await import('../utils/web3');
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0] || null);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing web3:', error);
        setLoading(false);
      }
    };

    initializeWeb3();

    // Set up account change callback
    setAccountChangeCallback((newAccount) => {
      setAccount(newAccount);
    });

    return () => {
      setAccountChangeCallback(null);
    };
  }, []);

  const refreshAccount = async () => {
    try {
      const { web3 } = await import('../utils/web3');
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0] || null);
    } catch (error) {
      console.error('Error refreshing account:', error);
    }
  };

  return (
    <AccountContext.Provider value={{ account, loading, refreshAccount, setAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

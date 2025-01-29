"use client";

import type React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

interface LoadingContextProps {
  isLoading: boolean;
  increment: () => void;
  decrement: () => void;
}

const LoadingContext = createContext<LoadingContextProps>({
  isLoading: false,
  increment: () => {},
  decrement: () => {},
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [requestCount, setRequestCount] = useState(0);
  const isMounted = useRef(false);

  // Called when a request starts
  function increment() {
    setRequestCount((prev) => prev + 1);
  }

  // Called when a request finishes
  function decrement() {
    setRequestCount((prev) => (prev > 0 ? prev - 1 : 0));
  }

  useEffect(() => {
    // Ensure we only set up interceptors once
    if (isMounted.current) return;
    isMounted.current = true;

    // Request interceptor
    const reqInterceptor = axios.interceptors.request.use(
      (config) => {
        increment();
        return config;
      },
      (error) => {
        decrement();
        return Promise.reject(error);
      }
    );

    // Response interceptor
    const resInterceptor = axios.interceptors.response.use(
      (response) => {
        decrement();
        return response;
      },
      (error) => {
        decrement();
        return Promise.reject(error);
      }
    );

    // Clean up interceptors when component unmounts
    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isLoading: requestCount > 0,
        increment,
        decrement,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}

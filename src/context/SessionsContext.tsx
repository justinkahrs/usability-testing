"use client";

import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { useLoading } from "./LoadingContext";

export interface TestingTask {
  id: string;
  taskNumber: string;
  title: string;
  scenario: string;
  instructions: string;
  successCriteria?: string;
}

export interface UserTest {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  department: string;
  dateOfTest: string;
  taskResults: Array<{
    taskId: string;
    pass?: boolean;
    comments: string;
  }>;
  generalComments?: string;
}

export type Analysis = {
  overallPassRate?: string;
  tasks?: Array<{
    taskId: string;
    title: string;
    passRate: string;
  }>;
};

export type Session = {
  id: string;
  name: string;
  tasks: TestingTask[];
  userTests: UserTest[];
  analysis?: Analysis;
};

interface SessionsContextType {
  sessions: Session[];
  addSession: (name: string, tasks: TestingTask[]) => void;
  addUserTest: (sessionId: string, userTest: UserTest) => void;
  removeUserTest: (sessionId: string, userTestId: string) => void;
  updateUserTest: (
    sessionId: string,
    userTestId: string,
    updatedUserTest: UserTest
  ) => void;
  removeSession: (sessionId: string) => void;
  removeSessionAnalysis: (sessionId: string) => void;
  updateSessionAnalysis: (sessionId: string, analysis?: Analysis) => void;
}

const SessionsContext = React.createContext<SessionsContextType>({
  sessions: [],
  addSession: () => {},
  addUserTest: () => {},
  removeUserTest: () => {},
  updateUserTest: () => {},
  removeSession: () => {},
  removeSessionAnalysis: () => {},
  updateSessionAnalysis: () => {},
});

export function SessionsProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const { increment, decrement } = useLoading();
  // Load sessions from localStorage once on mount
  useEffect(() => {
    const stored = window.localStorage.getItem("sessions");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Session[];
        setSessions(parsed);
      } catch (error) {
        console.error("Failed to parse localStorage sessions:", error);
        setSessions([]);
      }
    }
  }, []);

  // Persist sessions in localStorage whenever they change
  useEffect(() => {
    // sessions is always an array, so we can just stringify
    window.localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  function addSession(name: string, tasks: TestingTask[]) {
    const id = uuid();
    const newSession: Session = {
      id,
      name,
      tasks,
      userTests: [],
    };
    setSessions((prevSessions) => [...prevSessions, newSession]);
    return id;
  }

  function addUserTest(sessionId: string, userTest: UserTest) {
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            userTests: [...session.userTests, userTest],
          };
        }
        return session;
      })
    );
  }

  function removeUserTest(sessionId: string, userTestId: string) {
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            userTests: session.userTests.filter(
              (ut: UserTest) => ut.id !== userTestId
            ),
          };
        }
        return session;
      })
    );
  }

  function updateUserTest(
    sessionId: string,
    userTestId: string,
    updatedUserTest: UserTest
  ) {
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id !== sessionId) return session;
        return {
          ...session,
          userTests: session.userTests.map((ut: UserTest) => {
            if (ut.id !== userTestId) return ut;
            return updatedUserTest;
          }),
        };
      })
    );
  }

  function removeSession(sessionId: string) {
    setSessions((prevSessions) =>
      prevSessions.filter((s) => s.id !== sessionId)
    );
  }

  function removeSessionAnalysis(sessionId: string) {
    setSessions((prevSessions) =>
      prevSessions.map((s) =>
        s.id === sessionId ? { ...s, analysis: undefined } : s
      )
    );
  }

  async function updateSessionAnalysis(sessionId: string, analysis?: Analysis) {
    increment();
    try {
      setSessions((p) =>
        p.map((s) => (s.id === sessionId ? { ...s, analysis } : s))
      );
    } catch (err) {
      console.error("Analysis submission error:", err);
    } finally {
      decrement();
    }
  }

  return (
    <SessionsContext.Provider
      value={{
        sessions,
        addSession,
        addUserTest,
        removeUserTest,
        updateUserTest,
        removeSession,
        removeSessionAnalysis,
        updateSessionAnalysis,
      }}
    >
      {children}
    </SessionsContext.Provider>
  );
}

export function useSessions() {
  return React.useContext(SessionsContext);
}

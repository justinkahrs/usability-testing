"use client";

import react from "react";
import { v4 as uuid } from "uuid";

export interface TestingTask {
  id: string;
  description: string;
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
    pass: boolean;
    comments: string;
  }>;
}

export interface SessionData {
  id: string;
  name: string;
  tasks: TestingTask[];
  userTests: UserTest[];
}

interface SessionsContextType {
  sessions: SessionData[];
  addSession: (name: string, tasks: TestingTask[]) => void;
  addUserTest: (sessionId: string, userTest: UserTest) => void;
}

const SessionsContext = react.createContext<SessionsContextType>({
  sessions: [],
  addSession: () => {},
  addUserTest: () => {},
});

export function SessionsProvider({ children }: { children: react.ReactNode }) {
  const [sessions, setSessions] = react.useState<SessionData[]>([]);

  function addSession(name: string, tasks: TestingTask[]) {
    const newSession: SessionData = {
      id: uuid(),
      name,
      tasks,
      userTests: [],
    };
    setSessions((prev) => [...prev, newSession]);
  }

  function addUserTest(sessionId: string, userTest: UserTest) {
    setSessions((prev) => {
      return prev.map((session) => {
        if (session.id === sessionId) {
          return {
            ...session,
            userTests: [...session.userTests, userTest],
          };
        }
        return session;
      });
    });
  }

  return (
    <SessionsContext.Provider value={{ sessions, addSession, addUserTest }}>
      {children}
    </SessionsContext.Provider>
  );
}

export function useSessions() {
  return react.useContext(SessionsContext);
}

import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";

type FirestoreContextType = {
  db: Firestore | null;
};

const FirestoreContext = createContext<FirestoreContextType | undefined>(undefined);

export const FirestoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<Firestore | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initFirestore = async () => {
      try {
        const {
          FIREBASE_API_KEY,
          FIREBASE_AUTH_DOMAIN,
          FIREBASE_PROJECT_ID,
          FIREBASE_STORAGE_BUCKET,
          FIREBASE_MESSAGING_SENDER_ID,
          FIREBASE_APP_ID,
        } = Constants.expoConfig?.extra?.firebaseVariables || process.env;

        if (!FIREBASE_API_KEY) {
          throw new Error("Firebase environment variables are missing!");
        }

        const firebaseConfig = {
          apiKey: FIREBASE_API_KEY,
          authDomain: FIREBASE_AUTH_DOMAIN,
          projectId: FIREBASE_PROJECT_ID,
          storageBucket: FIREBASE_STORAGE_BUCKET,
          messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
          appId: FIREBASE_APP_ID,
        };

        const app = initializeApp(firebaseConfig);
        const firestoreDb = getFirestore(app);

        setDb(firestoreDb);
        setReady(true);
      } catch (error) {
        console.error("Erro ao inicializar Firestore:", error);
      }
    };

    initFirestore();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Inicializando Firestore...</Text>
      </View>
    );
  }

  return (
    <FirestoreContext.Provider value={{ db }}>
      {children}
    </FirestoreContext.Provider>
  );
};

export const useFirestore = (): Firestore => {
  const context = useContext(FirestoreContext);
  if (!context || !context.db) {
    throw new Error("useFirestore deve ser usado dentro de um FirestoreProvider");
  }
  return context.db;
};

import { EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import {
  connectFunctionsEmulator,
  getFunctions,
  provideFunctions,
} from '@angular/fire/functions';
import {
  connectStorageEmulator,
  getStorage,
  provideStorage,
} from '@angular/fire/storage';

import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { FirebaseOptions } from 'firebase/app';
import { AuthService } from './services/auth.service';
import { AuthEffects } from './state+/auth.effect';
import { authFeature } from './state+/auth.reducer';

export function provideFirebaseCore(
  firebaseConfig: FirebaseOptions,
  enableEmulators: boolean = false,
): EnvironmentProviders {
  initializeApp(firebaseConfig);
  return makeEnvironmentProviders([
    provideAuth(() => {
      const auth = getAuth();
      if (enableEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', {
          disableWarnings: true,
        });
      }
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      if (enableEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 8080); // Firestore emulator
      }
      return firestore;
    }),
    provideStorage(() => {
      const storage = getStorage();
      if (enableEmulators) {
        connectStorageEmulator(storage, 'localhost', 9199);
      }
      return storage;
    }),
    provideFunctions(() => {
      const functions = getFunctions();
      if (enableEmulators) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    }),
    provideState(authFeature),
    provideEffects(AuthEffects),
    AuthService,
  ]);
}

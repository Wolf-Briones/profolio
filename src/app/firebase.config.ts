import { EnvironmentProviders, importProvidersFrom } from '@angular/core'; 
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';  
import { environment } from '../environments/environment';

export const firebaseProviders: EnvironmentProviders = importProvidersFrom( 
  AngularFireModule.initializeApp(environment.firebaseConfig),
  AngularFireAuthModule,
  AngularFirestoreModule
);
 
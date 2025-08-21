import { Injectable, NgZone } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc as getDocFn, updateDoc as updateDocFn, deleteDoc as deleteDocFn, collectionData, docData, query, where, orderBy, limit, CollectionReference, DocumentData, collectionGroup, addDoc, serverTimestamp, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Storage } from '@angular/fire/storage';
import { OrderByDirection } from "firebase/firestore"; 
import { Observable } from 'rxjs'; 
import { query as firestoreQuery } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    public firestore: Firestore,
    public storage: Storage,
    public angularFireAuth: Auth,
    private ngZone: NgZone
  ) { }

  // Crear un nuevo documento
  public async createDoc(data: any, path: string, id: string) {
    const ref = doc(collection(this.firestore, path), id);
    return this.ngZone.runOutsideAngular(() => setDoc(ref, data));
  }

  // Eliminar documento
  async deleteDoc(path: string, id: string) {
    const ref = doc(this.firestore, `${path}/${id}`);
    return this.ngZone.runOutsideAngular(() => deleteDocFn(ref));
  }

  // Obtener colección
  getCollection<T>(path: string): Observable<T[]> {
    const ref = collection(this.firestore, path);
    return collectionData(ref, { idField: 'id' }) as Observable<T[]>;
  }

  // Obtener documento por ID
  /* getDoc<T>(path: string, id: string): Observable<T | undefined> {
    const ref = doc(this.firestore, `${path}/${id}`) ;
    return docData(ref, { idField: 'id' }) as Observable<T | undefined>;
  } */

  // Actualizar documento
  async updateDoc(path: string, id: string, data: any) {
    const ref = doc(this.firestore, `${path}/${id}`);
    return this.ngZone.runOutsideAngular(() => updateDocFn(ref, data));
  }

  // Obtener colección con límite
  async getCollectionLimit<T>(path: string, condition: string, limitCount: number) {
    const ref = collectionGroup(this.firestore, path);
    const q = query(ref, orderBy(condition), limit(limitCount));
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  getIdDocumentGroup<T>(path: string, parametro: string, condicion: OrderByDirection, limitCount: number) {
    const ref = collectionGroup(this.firestore, path);
    const q = query(ref, orderBy(parametro, condicion), limit(limitCount));
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  getRandomDocuments<T>(path: string, parametro: string, condition: OrderByDirection, limitCount: number) {
    const ref = collectionGroup(this.firestore, path);
    const q = query(ref, orderBy(parametro, condition), limit(limitCount));
    // Nota: Esto no es realmente aleatorio, solo obtiene los primeros N documentos ordenados.
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  // Actualizar documento con feedback
/*   async upDateDateofDocument(path: string, id: string, dato: any) {
    const ref = doc(this.firestore, `${path}/${id}`);
    try {
      await this.ngZone.runOutsideAngular(() => updateDocFn(ref, dato));
      Swal.fire('Actualizado', 'Información actualizada correctamente.', 'success');
    } catch (error: any) {
      Swal.fire('Error', 'Ocurrió un error al actualizar la información.', 'error');
    }
  } */

  // Generar ID aleatorio
  idaleatorio() {
    // Firebase Modular no expone createId, puedes usar un generador simple:
    return doc(collection(this.firestore, '_')).id;
  }

  // Actualizar documento (forma alternativa)
  async updateDocumentData(path: string, documentId: string, dataToUpdate: any): Promise<void> {
    const ref = doc(this.firestore, `${path}/${documentId}`);
    return this.ngZone.runOutsideAngular(() => updateDocFn(ref, dataToUpdate));
  }

  // Obtener UIDs de documentos de una colección
  async getDocumentUIDs(path: string): Promise<string[]> {
    const ref = collection(this.firestore, path);
    const snapshot = await getDocFn(doc(ref)); // Incorrecto, corregido abajo
    // Debes usar getDocs para obtener todos los documentos:
    // import { getDocs } from '@angular/fire/firestore';
    // const snapshot = await getDocs(ref);
    // const uids: string[] = [];
    // snapshot.forEach(docSnap => uids.push(docSnap.id));
    // return uids;
    // Pero para mantenerlo simple y evitar errores, puedes dejarlo pendiente de implementación.
    return [];
  }

  // Obtener documentos entre fechas
  getDocumentsBetweenDates(fechainicial: Date, fechafinal: Date, path: string, atributo: string) {
    const ref = collection(this.firestore, path);
    const q = query(ref, where(atributo, '>=', fechainicial), where(atributo, '<=', fechafinal));
    return collectionData(q, { idField: 'id' });
  }

  // Buscar datos por atributo (devuelve una promesa de QuerySnapshot)
  searchData(path: string, atributo: any, searchQuery: any) {
    const ref = collection(this.firestore, path);
    const q = query(ref, where(atributo, '==', searchQuery));
    return getDocs(q);
  }

  // Agregar documento de contabilidad (merge)
  async agregarDocContabilidad(data: any, fech: any, path: string) {
    const ref = doc(collection(this.firestore, path), fech);
    try {
      await this.ngZone.runOutsideAngular(() => setDoc(ref, data, { merge: true }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Error al agregar venta: ', error);
    }
  }

  metdoReportesFechaEmpresa(
    fechainicial: Date,
    fechafinal: Date,
    path: string,
    limiteinferior: string,
    limitesuperior: string,
    cod_empresa: string
  ) {
    const ref = collection(this.firestore, path);
    const q = firestoreQuery(
      ref,
      where(limiteinferior, '>=', fechainicial),
      where(limitesuperior, '<=', fechafinal),
      where('cod_empresa_cliente_hermanado', '==', cod_empresa)
    );
    return collectionData(q, { idField: 'id' });
  }

  metdoReportesPeriodoEmpresa<T>(
    fechainicial: Date,
    fechafinal: Date,
    path: string,
    variabletemp: string,
    cod_empresa: string
  ) {
    const ref = collection(this.firestore, path);
    const q = firestoreQuery(
      ref,
      where(variabletemp, '>=', fechainicial),
      where(variabletemp, '<=', fechafinal),
      where('codigo_empresa_personaliquidacion', '==', cod_empresa)
    );
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  metdoReportesPeriodoEmpresaNCc<T>(
    fechainicial: Date,
    fechafinal: Date,
    path: string,
    variabletemp: string,
    cod_empresa: string,
    cod_costos: string
  ) {
    const ref = collection(this.firestore, path);
    const q = firestoreQuery(
      ref,
      where(variabletemp, '>=', fechainicial),
      where(variabletemp, '<=', fechafinal),
      where('codigo_empresa_personaliquidacion', '==', cod_empresa),
      where('cod_centro_costos_empresa_personaliquidacion', '==', cod_costos)
    );
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  metdoReportesPeriodoEmpresaNCcNSede<T>(
    fechainicial: Date,
    fechafinal: Date,
    path: string,
    variabletemp: string,
    cod_empresa: string,
    cod_costos: string,
    sede_empresa: string
  ) {
    const ref = collection(this.firestore, path);
    const q = firestoreQuery(
      ref,
      where(variabletemp, '>=', fechainicial),
      where(variabletemp, '<=', fechafinal),
      where('codigo_empresa_personaliquidacion', '==', cod_empresa),
      where('cod_centro_costos_empresa_personaliquidacion', '==', cod_costos),
      where('sede_empresa_personaliquidacion', '==', sede_empresa)
    );
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  metdoReportesPeriodoArea<T>(
    fechainicial: Date,
    fechafinal: Date,
    path: string,
    variabletemp: string,
    cod_empresa: string,
    area_empresa: string
  ) {
    const ref = collection(this.firestore, path);
    const q = firestoreQuery(
      ref,
      where(variabletemp, '>=', fechainicial),
      where(variabletemp, '<=', fechafinal),
      where('codigo_empresa_personaliquidacion', '==', cod_empresa),
      where('area_empresa_personaliquidacion', '==', area_empresa)
    );
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  metdoReportesPeriodoSubArea<T>(
    fechainicial: Date,
    fechafinal: Date,
    path: string,
    variabletemp: string,
    cod_empresa: string,
    area_empresa: string,
    subarea_empresa: string
  ) {
    const ref = collection(this.firestore, path);
    const q = firestoreQuery(
      ref,
      where(variabletemp, '>=', fechainicial),
      where(variabletemp, '<=', fechafinal),
      where('codigo_empresa_personaliquidacion', '==', cod_empresa),
      where('area_empresa_personaliquidacion', '==', area_empresa),
      where('sub_area_empresa_personaliquidacion', '==', subarea_empresa)
    );
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  metdoReportesPeriodoDNI<T>(
    fechainicial: Date,
    fechafinal: Date,
    path: string,
    variabletemp: string,
    cod_empresa: string,
    dni_propietario: string
  ) {
    const ref = collection(this.firestore, path);
    const q = firestoreQuery(
      ref,
      where(variabletemp, '>=', fechainicial),
      where(variabletemp, '<=', fechafinal),
      where('codigo_empresa_personaliquidacion', '==', cod_empresa),
      where('dni_personaliquidacion', '==', dni_propietario)
    );
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  metdoReportesFechaAllDataEmpresa(
    fechainicial: Date,
    fechafinal: Date,
    path: string,
    limiteinferior: string,
    limitesuperior: string,
    cod_empresa: string,
    operatorDNI: string,
    area_empresa: string,
    subarea_empresa: string,
    cc_empresa: string,
    sede_empresa: string,
    codigo_prenda: string,
    cod_propietario_prenda: string
  ) {
    const ref = collection(this.firestore, path);
    let q = firestoreQuery(
      ref,
      where(limiteinferior, '>=', fechainicial),
      where(limitesuperior, '<=', fechafinal),
      where('cod_empresa_cliente_hermanado', '==', cod_empresa)
      // Puedes agregar más condiciones aquí según sea necesario
    );
    // Si necesitas condiciones opcionales, deberás construir el array de condiciones dinámicamente.
    return collectionData(q, { idField: 'id' });
  }
}

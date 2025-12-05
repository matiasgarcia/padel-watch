import { MatchHistoryEntry } from '../types/matchHistory';

export const CURRENT_VERSION = 1;

/**
 * Migra datos desde una versión específica a la versión objetivo
 */
export const migrateToVersion = (
  targetVersion: number,
  data: any,
  currentVersion: number
): MatchHistoryEntry[] => {
  if (currentVersion === targetVersion) {
    return data;
  }

  if (currentVersion > targetVersion) {
    console.warn(
      `Cannot migrate backwards from version ${currentVersion} to ${targetVersion}. Returning data as-is.`
    );
    return data;
  }

  let migratedData = data;
  let version = currentVersion;

  // Ejecutar migraciones en cadena hasta alcanzar la versión objetivo
  while (version < targetVersion) {
    const nextVersion = version + 1;
    migratedData = migrateFromVersion(version, nextVersion, migratedData);
    version = nextVersion;
  }

  return migratedData;
};

/**
 * Migra datos desde una versión específica a la siguiente
 */
const migrateFromVersion = (
  fromVersion: number,
  toVersion: number,
  data: any
): MatchHistoryEntry[] => {
  console.debug(`Migrating from version ${fromVersion} to ${toVersion}`);
  console.debug(`Data: ${JSON.stringify(data)}`);
  switch (fromVersion) {
    case 0:
      if (toVersion === 1) {
        return migrateFromV0ToV1(data);
      }
      // Si estamos en versión 0 pero queremos ir a una versión > 1,
      // necesitamos migrar primero a 1, luego a 2, etc.
      // Esto se maneja en el bucle while de migrateToVersion
      throw new Error(`Migration from version ${fromVersion} to ${toVersion} requires intermediate migrations`);
    case 1:
      if (toVersion === 2) {
        return migrateFromV1ToV2(data);
      }
      // Si estamos en versión 1 pero queremos ir a una versión > 2,
      // necesitamos migrar primero a 2, luego a 3, etc.
      // Esto se maneja en el bucle while de migrateToVersion
      throw new Error(`Migration from version ${fromVersion} to ${toVersion} requires intermediate migrations`);
    // Agregar más casos aquí cuando se necesiten nuevas migraciones
    // case 2:
    //   if (toVersion === 3) {
    //     return migrateFromV2ToV3(data);
    //   }
    //   throw new Error(`Migration from version ${fromVersion} to ${toVersion} requires intermediate migrations`);
    default:
      console.warn(
        `No migration path found from version ${fromVersion} to ${toVersion}. Returning data as-is.`
      );
      return data;
  }
};

/**
 * Migración de versión 0 a versión 1
 * Convierte datos sin versión (arrays directos) al formato versionado
 */
const migrateFromV0ToV1 = (data: any): MatchHistoryEntry[] => {
  // Los datos en versión 0 son arrays directos de MatchHistoryEntry
  // La migración a versión 1 simplemente valida y retorna los datos
  // ya que el formato de datos no cambia, solo se agrega el wrapper de versión
  if (Array.isArray(data)) {
    return data as MatchHistoryEntry[];
  }
  // Si no es un array, intentar extraer los datos
  if (typeof data === 'object' && data !== null && 'data' in data) {
    return Array.isArray(data.data) ? (data.data as MatchHistoryEntry[]) : [];
  }
  // Fallback: retornar array vacío
  return [];
};

/**
 * Migración de versión 1 a versión 2
 * Esta es una función placeholder para futuras migraciones
 * Por ahora, simplemente retorna los datos sin cambios
 */
const migrateFromV1ToV2 = (data: MatchHistoryEntry[]): MatchHistoryEntry[] => {
  // Ejemplo de migración: aquí se pueden transformar los datos si es necesario
  // Por ejemplo, agregar campos nuevos, renombrar campos, etc.
  // return data.map(match => ({
  //   ...match,
  //   newField: defaultValue,
  // }));
  return data;
};


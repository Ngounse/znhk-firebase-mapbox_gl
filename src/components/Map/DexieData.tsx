import db from 'src/db';
import {useLiveQuery} from 'dexie-react-hooks';

export function PolygonsList() {
  const data = useLiveQuery(() => db.polygons.toArray());
  return data;
}

export function PointsList() {
  const data = useLiveQuery(() => db.points.toArray());
  return data;
}

export function LinesList() {
  const data = useLiveQuery(() => db.lines.toArray());
  return data;
}

export function DeleteFeature(id: any, dbName: any) {
  dbName.delete(id);
  return;
}

export async function AddFeature(feature: any, dbName: any) {
  try {
    if (!feature) return;
    // console.log('dbName:::', dbName);

    //  feature id already exists in the database
    const isExist = await dbName.where('id').equals(feature?.id).count();

    if (!!isExist) {
      dbName.update(feature?.id, {
        type: feature?.type,
        properties: feature?.properties,
        geometry: {
          type: feature?.geometry?.type,
          coordinates: feature?.geometry?.coordinates,
        },
      });
      return;
    }

    // Add the new feature!
    if (!isExist) {
      await dbName.add({
        id: feature?.id,
        type: feature?.type,
        properties: feature?.properties,
        geometry: {
          type: feature?.geometry?.type,
          coordinates: feature?.geometry?.coordinates,
        },
      });
      return;
    }
  } catch (error) {
    console.log('error addPoint ::', error);
  }
}

// db.ts
import Dexie, {Table} from 'dexie';

export interface Type {
  id: string;
  idIn?: number;
  type: string;
  properties: {};
  geometry: {
    type: string;
    coordinates: number[];
  };
}

export class MySubClassedDexie extends Dexie {
  // 'points' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  points!: Table<Type>;
  polygons!: Table<Type>;
  lines!: Table<Type>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      points: '++idIn, id, type, properties, geometry',
      polygons: '++idIn, id,type, properties, geometry',
      lines: '++idIn, id,type, properties, geometry',
    });
  }
}

export const db = new MySubClassedDexie();

// db.ts
import Dexie, {Table} from 'dexie';

export interface Point {
  id: string;
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
  points!: Table<Point>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      points: 'id, type, properties, geometry',
    });
  }
}

export const db = new MySubClassedDexie();

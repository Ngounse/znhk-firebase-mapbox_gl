import {Button, IconButton, Stack} from '@mui/material';
import * as turf from '@turf/turf';
import db from 'src/db';
import DeleteIcon from '@mui/icons-material/Delete';
// import useStates from 'src/hook/useState';

export function MapDraw(map: any, draw: any) {
  //   const [state, setState]: any = useStates({});

  if (!!draw) {
    console.log('!!draw::', draw);

    map.current.addControl(draw);
    map.current.on('draw.create', updateArea);
    map.current.on('draw.delete', updateArea);
    map.current.on('draw.update', updateArea);
  }

  async function updateArea(e: any) {
    const data = draw.getAll();
    console.log('updateArea::', data);

    const answer = document.getElementById('calculated-area') || '';
    if (data.features.length > 0) {
      const lastArr = data.features[data.features.length - 1];
      console.log('updateArea draw::', lastArr);

      addPoint(lastArr);
      const countPoints = (await db.points.count()) + 1 || 0;

      answer.innerHTML = `<p><strong>${countPoints}</strong></p><p>points </p>`;
      //   const area = turf.area(data);
      //   // Restrict the area to 2 decimal points.
      //   const rounded_area = Math.round(area * 100) / 100;
      //   answer.innerHTML = `<p><strong>${rounded_area}</strong></p><p>square meters</p>`;
      // } else {
      //   answer.innerHTML = '';
      //   if (e.type !== 'draw.delete') alert('Click the map to draw a polygon.');
    }
  }

  async function addPoint(feature: any) {
    try {
      if (!feature) return;
      //  feature id already exists in the database
      const isExist = await db.points.where('id').equals(feature?.id).count();
      // console.log('isExist::', !!isExist);

      if (!!isExist) {
        db.points.update(feature?.id, {
          type: feature?.type,
          properties: feature?.properties,
          geometry: {
            type: feature?.geometry?.type,
            coordinates: feature?.geometry?.coordinates,
          },
        });
        return;
      }

      // Add the new point!
      if (!isExist) {
        await db.points.add({
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

      //   setStatus(`Friend ${name} successfully added. Got id ${id}`);
    } catch (error) {
      console.log('error addPoint ::', error);

      //   setStatus(`Failed to add ${name}: ${error}`);
    }
  }
}

export async function DeleteFeature(id: any) {
  await db.points.delete(id);
  return;
}

interface IProps {
  isDelete: boolean;
  onSelected: () => void;
}
export const DeleteButton = (props: IProps) => {
  const {isDelete, onSelected} = props;

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        position: 'absolute',
        top: 39,
        right: 4,
        zIndex: 3,
        backgroundColor: 'white',
      }}>
      <IconButton aria-label="delete" onClick={onSelected}>
        <DeleteIcon
          fontSize="inherit"
          color={isDelete ? 'error' : 'disabled'}
        />
      </IconButton>
    </Stack>
  );
};

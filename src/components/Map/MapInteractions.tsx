import {Checkbox, FormControlLabel, FormGroup, Stack} from '@mui/material';
import React, {useEffect} from 'react';
import useStates from 'src/hook/useState';

interface IProps {
  map: any;
}
const MapInteractions = React.memo((props: IProps) => {
  const {map} = props;
  const [state, setState]: any = useStates({
    scrollZoom: true,
    dragPan: false,
    boxZoom: true,
    dragRotate: true,
    keyboard: true,
    doubleClickZoom: true,
    touchZoomRotate: true,
  });

  const {} = state;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, checked} = event.target;
    console.log('name::', name);

    setState({[name]: checked});
    if (checked) {
      map.current[name].enable();
    } else {
      map.current[name].disable();
    }
  };
  return (
    <Stack>
      <FormGroup id="interactions">
        {InteractionsList?.map((item: any) => {
          return (
            <FormControlLabel
              sx={{
                '&:hover': {
                  color: 'primary.main',
                },
              }}
              key={item.id}
              control={
                <Checkbox
                  size="small"
                  onChange={handleChange}
                  name={item.id}
                  // defaultChecked
                  checked={state[item.id]}
                />
              }
              label={item.label}
            />
          );
        })}
      </FormGroup>
    </Stack>
  );
});

const InteractionsList = [
  {
    id: 'scrollZoom',
    label: 'Scroll Zoom',
  },
  {
    id: 'boxZoom',
    label: 'Box Zoom',
  },
  {
    id: 'dragRotate',
    label: 'Drag Rotate',
  },
  {
    id: 'dragPan',
    label: 'Drag Pan',
  },
  {
    id: 'keyboard',
    label: 'Keyboard',
  },
  {
    id: 'doubleClickZoom',
    label: 'Double Click Zoom',
  },
  {
    id: 'touchZoomRotate',
    label: 'Touch Zoom Rotate',
  },
];

export default MapInteractions;

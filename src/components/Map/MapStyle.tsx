import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material';
import useStates from 'src/hook/useState';

interface IProps {
  map: any;
}

const MapStyle = (porps: IProps) => {
  const {map} = porps;
  const [state, setState]: any = useStates({
    layer: 'light-v10',
  });

  const {layer} = state;

  const handleLayer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const layerId = (event.target as HTMLInputElement).value;
    map.current.setStyle('mapbox://styles/mapbox/' + layerId);
    setState({layer: layerId});
  };

  return (
    <Stack id="menu">
      <FormControl>
        {/* <FormLabel id="map-layers">Layers</FormLabel> */}
        <RadioGroup
          row
          sx={{
            '& .MuiTypography-root': {
              fontSize: '0.9rem',
            },
          }}
          defaultValue={'light-v10'}
          onChange={handleLayer}
          name="radio-buttons-group">
          {LayersList.map((item, index) => {
            return (
              <FormControlLabel
                sx={{
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
                key={index}
                value={item.id}
                control={<Radio size="small" />}
                label={item.label}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </Stack>
  );
};

const LayersList = [
  {
    id: 'satellite-streets-v12',
    label: 'Satellite',
  },
  {
    id: 'light-v10',
    label: 'Default',
  },
  {
    id: 'dark-v11',
    label: 'Dark',
  },
  {
    id: 'streets-v12',
    label: 'Streets',
  },
  {
    id: 'outdoors-v12',
    label: 'Outdoors',
  },
  {
    id: 'light-v11',
    label: 'Light',
  },
];

export default MapStyle;

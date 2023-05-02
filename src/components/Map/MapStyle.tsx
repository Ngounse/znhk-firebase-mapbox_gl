import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material';
import useStates from 'src/hook/useState';

interface IProps {
  onChange: () => void;
}

const MapStyle = (porps: IProps) => {
  const {onChange} = porps;

  // const {layer} = state;

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
          onChange={onChange}
          name="radio-buttons-group">
          {StylesList.map((item, index) => {
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

export const StylesList = [
  {
    id: 'satellite-streets-v12',
    label: 'Satellite',
  },
  {
    id: 'light-v11',
    label: 'Light',
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
];

export default MapStyle;

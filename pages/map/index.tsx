import Head from 'next/head';
import mapboxgl from 'mapbox-gl'; // , {Marker} // or "const mapboxgl = require('mapbox-gl');"
import 'mapbox-gl/dist/mapbox-gl.css';
import type {NextPage} from 'next';
import {useEffect, useRef} from 'react';
import {Box} from '@mui/material';
import {useAuth} from 'src/context/AuthContext';
import MapStyle, {StylesList} from 'src/components/Map/MapStyle';
import MapInteractions from 'src/components/Map/MapInteractions';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import {
  DeleteButton,
  DeleteFeature,
  MapDraw,
  PointsList,
  PolygonsList,
} from 'src/components/Map';
import useStates from 'src/hook/useState';
import db from 'src/db';
import {
  LoadPoints,
  LoadPolygons,
  OnMousemovePolygon,
  PopupHover,
  PopupPoint,
  PopupPolygon,
} from 'src/components/Map/LayerFeature';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from '@mui/material';

const Map: NextPage = () => {
  var mapContainer = useRef<any>(null);
  var map = useRef<mapboxgl.Map | any>(null);
  const [state, setState]: any = useStates({
    isSelect: false,
    isDelete: false,
    data: {},
    layer: 'light-v11',
  });

  const {isSelect, isDelete, data, layer} = state;

  const handelSelected = () => {
    setState({isDelete: !isDelete});
  };

  //  if not auth push to login page
  const {currentUser} = useAuth();
  if (!currentUser) {
    window.location.href = '/auth/login';
  }

  const _pointList = PointsList();
  const _polygonsList = PolygonsList();

  const geojsonPoint = {
    type: 'FeatureCollection',
    features: _pointList?.map((marker) => ({
      geometry: {
        type: marker.geometry.type,
        coordinates: [
          marker.geometry.coordinates[0],
          marker.geometry.coordinates[1],
        ],
        properties: {
          id: marker.id,
        },
      },
    })),
  };

  const geojsonPolygons = {
    type: 'FeatureCollection',
    features: _polygonsList?.map((marker: any) => ({
      type: 'Feature',
      id: marker.idIn,
      properties: {
        id: marker.id,
      },
      geometry: {
        type: marker.geometry.type,
        coordinates: [marker.geometry.coordinates[0]],
      },
    })),
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '';
    let zoom = map.current?.getZoom() || 12.5;
    let center = map.current?.getCenter() || [104.991, 12.5657];

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${layer}`,
      center: center, // center map on Chad longitude, latitude
      zoom: zoom,
      attributionControl: false, // hide mapbox AttributionControl
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        point: true,
        // line_string: true,
        polygon: true,
        trash: true,
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      // defaultMode: 'draw_polygon',
    });

    MapDraw(map, draw);

    map.current.on('load', async () => {
      // console.log('geojson:::', geojson);
      // check if addSource is aleady exist
      const isSourcePoint = !!map.current.getSource('point');
      const isSourcePolygon = !!map.current.getSource('polygon');
      const isGeoPolygon = geojsonPolygons.features?.length;
      const isGeoPoint = geojsonPoint.features?.length;
      if (!isSourcePolygon && isGeoPolygon) {
        map.current.addSource('polygon', {
          type: 'geojson',
          data: geojsonPolygons,
        });
        LoadPolygons(map, 'polygon');
        // map.current.removeSource('point');
      }

      const source = 'polygon';
      const addLayerId = 'maine-layer';
      OnMousemovePolygon(map, source, addLayerId);

      if (!isSourcePoint && isGeoPoint) {
        map.current.addSource('point', {
          type: 'geojson',
          data: geojsonPoint,
          cluster: true,
          // clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
        });
        LoadPoints(map, 'point');
        // map.current.removeSource('point');
      }
      // console.log(map.current);
    });

    PopupPoint(map, isDelete, mapboxgl);
    PopupHover(map, mapboxgl);
    PopupPolygon(map, mapboxgl, 'polygon');
    [map];

    map.current.addControl(new mapboxgl.FullscreenControl());
  });

  const handleLayer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const layerId = (event.target as HTMLInputElement).value;
    setState({layer: layerId});
  };

  return (
    <>
      <Head>
        <title>Map</title>
      </Head>

      <Box ref={mapContainer} minWidth={'100%'} minHeight={'100%'}>
        {/* <MapStyle map={map} layer={layer} /> */}
        <Stack id="menu">
          <FormControl>
            <RadioGroup
              row
              sx={{
                '& .MuiTypography-root': {
                  fontSize: '0.9rem',
                },
              }}
              defaultValue={'light-v11'}
              onChange={handleLayer}
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
        <MapInteractions map={map} />
        <Box className="calculation-box">
          {/* <p>Click the map to draw a polygon.</p> */}
          <div id="calculated-area"></div>
        </Box>
        {/* <DeleteButton isDelete={isDelete} onSelected={handelSelected} /> */}
      </Box>
    </>
  );
};

export default Map;

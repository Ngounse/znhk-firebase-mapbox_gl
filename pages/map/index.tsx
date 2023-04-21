import Head from 'next/head';
import mapboxgl from 'mapbox-gl'; // , {Marker} // or "const mapboxgl = require('mapbox-gl');"
import 'mapbox-gl/dist/mapbox-gl.css';
import type {NextPage} from 'next';
import {useEffect, useRef} from 'react';
import {Box} from '@mui/material';
import {useAuth} from 'src/context/AuthContext';
import MapStyle from 'src/components/Map/MapStyle';
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
  PopupPoint,
} from 'src/components/Map/LayerFeature';

const Map: NextPage = () => {
  var mapContainer = useRef<any>(null);
  var map = useRef<mapboxgl.Map | any>(null);
  const [state, setState]: any = useStates({
    isSelect: false,
    isDelete: false,
    data: {},
  });

  const {isSelect, isDelete, data} = state;

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

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [104.991, 12.5657], // center map on Chad longitude, latitude
      zoom: zoom,
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
      const isGeoPolygon = geojsonPolygons.features?.length > 0;
      const isGeoPoint = geojsonPoint.features?.length > 0;

      if (!isSourcePolygon && isGeoPolygon) {
        map.current.addSource('polygon', {
          type: 'geojson',
          data: geojsonPolygons,
        });
        LoadPolygons(map, 'polygon');
        // map.current.removeSource('point');
      }

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

    // !! add marker
    const AddMarker = (marker: any) => {
      const markerIcon = document.createElement('div');
      markerIcon.className = 'location-marker';
      markerIcon.style.backgroundImage = 'url(/location-marker.png)';

      new mapboxgl.Marker(markerIcon).setLngLat(marker).addTo(map.current);
      // new mapboxgl.Marker(markerIcon).setLngLat(marker);
    };

    PopupPoint(map, isDelete, mapboxgl);

    [];
  });

  return (
    <>
      <Head>
        <title>Map</title>
      </Head>

      <Box ref={mapContainer} minWidth={'100%'} minHeight={'100%'}>
        <MapStyle map={map} />
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

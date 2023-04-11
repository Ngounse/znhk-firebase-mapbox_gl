import Head from 'next/head';
import mapboxgl, {Marker} from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import 'mapbox-gl/dist/mapbox-gl.css';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import type {NextPage} from 'next';
import {useEffect, useRef} from 'react';
import {Box} from '@mui/material';
import {useAuth} from 'src/context/AuthContext';
import useStates from 'src/hook/useState';

const Map: NextPage = () => {
  var mapContainer = useRef<any>(null);
  var map = useRef<mapboxgl.Map | any>(null);
  const [state, setState]: any = useStates({});

  //  if not auth push to login page
  const {currentUser} = useAuth();
  if (!currentUser) {
    window.location.href = '/auth/login';
  }

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '';
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [104.991, 12.5657], // center map on Chad longitude, latitude
      zoom: 6.5,
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        point: true,
        line_string: true,
        polygon: true,
        trash: true,
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      // defaultMode: 'draw_polygon',
    });

    console.log('draw::', draw);

    if (!!draw) {
      console.log('!!draw::', draw);

      map.current.addControl(draw);
      map.current.on('draw.create', updateArea);
      map.current.on('draw.delete', updateArea);
      map.current.on('draw.update', updateArea);
    }

    function updateArea(e: any) {
      const data = draw.getAll();
      console.log('updateArea draw::', draw);
      const answer = document.getElementById('calculated-area') || '';
      if (data.features.length > 0) {
        const area = turf.area(data);
        // Restrict the area to 2 decimal points.
        const rounded_area = Math.round(area * 100) / 100;
        answer.innerHTML = `<p><strong>${rounded_area}</strong></p><p>square meters</p>`;
      } else {
        answer.innerHTML = '';
        if (e.type !== 'draw.delete') alert('Click the map to draw a polygon.');
      }
    }

    document.getElementById('listing-group').addEventListener('change', (e) => {
      const handler = e.target.id;
      console.log('handler:::', handler);

      if (e.target.checked) {
        map.current[handler].enable();
      } else {
        map.current[handler].disable();
      }
    });

    [];
  });

  const geojson = {
    type: 'Feature',
    features: markers.map((marker) => ({
      geometry: {
        type: 'Point',
        coordinates: {
          lat: marker.latCoord,
          lng: marker.longCoord,
        },
      },
      properties: {
        country: marker.country,
        city: marker.city,
      },
    })),
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '';
    const canvas = map.current.getCanvasContainer();

    function onMove(e: any) {
      const coords = e.lngLat;

      // Set a UI indicator for dragging.
      canvas.style.cursor = 'grabbing';
      console.log('onMove:::', coords);

      // Update the Point feature in `geojson` coordinates
      // and call setData to the source layer `point` on it.
      geojson.geometry.coordinates = [coords.lng, coords.lat];
      map.current.getSource('point').setData(geojson);
    }

    function onUp(e: any) {
      const coords = e.lngLat;

      // Print the coordinates of where the point had
      // finished being dragged to on the map.
      coordinates.style.display = 'block';
      coordinates.innerHTML = `Longitude: ${coords.lng}<br />Latitude: ${coords.lat}`;
      canvas.style.cursor = '';

      // Unbind mouse/touch events
      map.current.off('mousemove', onMove);
      map.current.off('touchmove', onMove);
    }
  });

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '';
    map.current.on('load', () => {
      // map.current.addSource('point', {
      //   type: 'geojson',
      //   data: geojson,
      // });

      map.current.addLayer({
        id: 'point',
        type: 'circle',
        source: 'point',
        paint: {
          'circle-radius': 10,
          'circle-color': '#F84C4C', // red color
        },
      });

      geojson.features.forEach((marker) => {
        // create a DOM element for the marker
        const markerIcon = document.createElement('div');
        markerIcon.className = 'location-marker';
        markerIcon.style.backgroundImage = 'url(/location-marker.png)';
        // console.log('marker:::', marker);

        new mapboxgl.Marker(markerIcon)
          .setLngLat(marker.geometry.coordinates)
          .addTo(map.current);

        new mapboxgl.Marker(markerIcon)
          .setLngLat(marker.geometry.coordinates)
          .setPopup(
            new mapboxgl.Popup({offset: 25}) // add popups
              .setHTML(
                `<h3>${marker.properties.country}</h3><p>${marker.properties.city}</p>`,
              ),
          )
          .addTo(map.current);
      });
    });
    [];
  });

  return (
    <>
      <Head>
        <title>Map</title>
      </Head>

      <Box ref={mapContainer} minWidth={'100%'} minHeight={'100%'}>
        <Box className="calculation-box">
          <p>Click the map to draw a polygon.</p>
          <div id="calculated-area"></div>
        </Box>
      </Box>
      <nav id="listing-group" className="listing-group">
        <input type="checkbox" id="scrollZoom" defaultChecked />
        <label htmlFor="scrollZoom">Scroll zoom</label>
        <input type="checkbox" id="boxZoom" defaultChecked />
        <label htmlFor="boxZoom">Box zoom</label>
        <input type="checkbox" id="dragRotate" defaultChecked />
        <label htmlFor="dragRotate">Drag rotate</label>
        <input type="checkbox" id="dragPan" defaultChecked />
        <label htmlFor="dragPan">Drag pan</label>
        <input type="checkbox" id="keyboard" defaultChecked />
        <label htmlFor="keyboard">Keyboard</label>
        <input type="checkbox" id="doubleClickZoom" defaultChecked />
        <label htmlFor="doubleClickZoom">Double click zoom</label>
        <input type="checkbox" id="touchZoomRotate" defaultChecked />
        <label htmlFor="touchZoomRotate">Touch zoom rotate</label>
      </nav>
    </>
  );
};

export default Map;

export const markers: Marker[] = [
  // {
  //   city: 'Sydney',
  //   country: 'Australia',
  //   latCoord: -33.8688,
  //   longCoord: 151.2093,
  // },
  // {
  //   city: 'Amsterdam',
  //   country: 'Netherlands',
  //   latCoord: 52.3676,
  //   longCoord: 4.9041,
  // },
  {
    city: 'Seoul',
    country: 'South Korea',
    latCoord: 37.5665,
    longCoord: 126.978,
  },
  {
    city: 'Phnom Penh',
    country: 'Cambodia',
    latCoord: 11.55,
    longCoord: 104.9167,
  },
];

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
import {DeleteButton, DeleteFeature, MapDraw} from 'src/components/Map';
import db from 'src/db';
import {useLiveQuery} from 'dexie-react-hooks';
import useStates from 'src/hook/useState';

export function PointsList() {
  const points = useLiveQuery(() => db.points.toArray());
  return points;
}

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
  console.log('_pointList:::', _pointList);

  const geojson = {
    type: 'FeatureCollection',
    features: _pointList?.map((marker) => ({
      geometry: {
        type: marker.geometry.type,
        // coordinates: {
        //   lat: marker.geometry.coordinates[1],
        //   lng: marker.geometry.coordinates[0],
        // },
        coordinates: [
          marker.geometry.coordinates[0],
          marker.geometry.coordinates[1],
        ],
      },
      properties: {
        // country: marker.country,
        // city: marker.city,
        id: marker.id,
      },
    })),
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? '';
    let zoom = map.current?.getZoom() || 12.5;

    console.log('map.current:::', map.current);

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [104.991, 12.5657], // center map on Chad longitude, latitude
      zoom: zoom,
    });

    // map.current.on('zoom', () => {
    //   zoom = map.current.getZoom();
    // });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        point: true,
        // line_string: true,
        // polygon: true,
        trash: true,
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      // defaultMode: 'draw_polygon',
    });

    MapDraw(map, draw);

    map.current.on('load', async () => {
      console.log('geojson:::', geojson);
      // check if addSource is aleady exist
      const isSource = !!map.current.getSource('point');
      // console.log('map getSource(point):::', isSource);
      // console.log('isGeoFeature:::', isGeoFeature);

      const LoadPoint = async () => {
        map.current.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'point',
          filter: ['has', 'point_count'],
          paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              5,
              '#f1f075',
              10,
              '#f28cb1',
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40,
            ],
          },
        });
        map.current.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'point',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
          },
        });
        map.current.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'point',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
          },
        });
        return;
      };

      if (!isSource) {
        // console.log('added Source:::');
        map.current.addSource('point', {
          type: 'geojson',
          data: geojson,
          cluster: true,
          // clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
        });
        LoadPoint();
        return;
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

    // inspect a cluster on click
    map.current.on('click', 'clusters', (e: any) => {
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      });
      const clusterId = features[0].properties.cluster_id;
      map.current
        .getSource('point')
        .getClusterExpansionZoom(clusterId, (err: any, zoom: any) => {
          if (err) return;

          map.current.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.current.on('click', 'unclustered-point', (e: any) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      console.log('coordinates:::', coordinates);

      const mag = e.features[0].properties.mag;
      const tsunami = e.features[0].properties.tsunami === 1 ? 'yes' : 'no';

      // Ensure that if the map is zoomed out such that
      // multiple copies of the feature are visible, the
      // popup appears over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // AddMarker(coordinates);
      if (isDelete) {
        const id = e.features[0].properties.id;
        DeleteFeature(id);
      } else {
        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`)
          .addTo(map.current);
      }
    });

    map.current.on('mouseenter', 'clusters', () => {
      // console.log('mouseenter====');
      map.current.getCanvas().style.cursor = 'pointer';
    });
    map.current.on('mouseleave', 'clusters', () => {
      // console.log('mouseleave====');
      map.current.getCanvas().style.cursor = '';
    });

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
        <DeleteButton isDelete={isDelete} onSelected={handelSelected} />
      </Box>
    </>
  );
};

export default Map;

import db from 'src/db';
import {DeleteFeature} from './DexieData';

export const LoadPolygons = async (map: any, source: string) => {
  // Add a new layer to visualize the polygon.
  map.current.addLayer({
    id: 'maine',
    type: 'fill',
    source: source, // reference the data source
    layout: {},
    paint: {
      'fill-color': '#0080ff', // blue color fill
      'fill-opacity': 0.5,
    },
  });
  // Add a black outline around the polygon.
  map.current.addLayer({
    id: 'outline',
    type: 'line',
    source: source,
    layout: {},
    paint: {
      'line-color': '#000',
      'line-width': 3,
    },
  });
  return;
};

export const LoadPoints = async (map: any, source: string) => {
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
      'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
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

export const PopupPoint = (map: any, isDelete: boolean, mapboxgl: any) => {
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
      DeleteFeature(id, db.points);
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
};

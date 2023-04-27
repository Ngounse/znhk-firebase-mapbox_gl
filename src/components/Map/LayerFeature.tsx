import db from 'src/db';
import {DeleteFeature} from './DexieData';

export const LoadPolygons = async (map: any, source: string) => {
  // Add a new layer to visualize the polygon.
  map.current.addLayer({
    id: 'maine-layer',
    type: 'fill',
    source: source, // reference the data source
    layout: {},
    paint: {
      'fill-color': '#fad4a5', // color fill
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        1,
        0.2,
      ],
    },
  });
  // Add a black outline around the polygon.
  map.current.addLayer({
    id: 'outline',
    type: 'line',
    source: source,
    layout: {},
    paint: {
      'line-color': '#11b4da',
      'line-width': 2,
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
      'circle-radius': 6,
      'circle-stroke-width': 2,
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

    // selected point.map center
    map.current.flyTo({
      center: e.features[0].geometry.coordinates,
    });

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

export const PopupHover = (map: any, mapboxgl: any) => {
  // Add a layer showing the places.

  // map.current.addLayer({
  //   id: 'places',
  //   type: 'circle',
  //   source: 'point',
  //   paint: {
  //     'circle-color': '#4264fb',
  //     'circle-radius': 6,
  //     'circle-stroke-width': 2,
  //     'circle-stroke-color': '#ffffff',
  //   },
  // });

  // Create a popup, but don't add it to the map yet.
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.current.on('mouseenter', 'unclustered-point', (e: any) => {
    // Change the cursor style as a UI indicator.
    map.current.getCanvas().style.cursor = 'pointer';

    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
  });

  map.current.on('mouseleave', 'unclustered-point', () => {
    map.current.getCanvas().style.cursor = '';
    popup.remove();
  });
};

export const PopupPolygon = (map: any, mapboxgl: any, source: any) => {
  // When a click event occurs on a feature in the states layer,
  // open a popup at the location of the click, with description
  // HTML from the click event's properties.
  map.current.on('click', 'maine-layer', (e: any) => {
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(e.features[0].properties.name)
      .addTo(map.current);

    // map.current.removeSource('point');

    // map.current.addLayer({
    //   id: 'click-outline',
    //   type: 'line',
    //   source: source,
    //   layout: {},
    //   paint: {
    //     'line-color': '#e1e40d',
    //     'line-width': 2,
    //   },
    // });
  });

  // Change the cursor to a pointer when
  // the mouse is over the states layer.
  map.current.on('mouseenter', 'maine-layer', () => {
    map.current.getCanvas().style.cursor = 'pointer';
  });

  // Change the cursor back to a pointer
  // when it leaves the states layer.
  map.current.on('mouseleave', 'maine-layer', () => {
    map.current.getCanvas().style.cursor = '';
  });
};

export const OnMousemovePolygon = (map: any, source: any, addLayerId: any) => {
  let hoveredStateId: any = null;
  // When the user moves their mouse over the state-fill layer, we'll update the
  // feature state for the feature under the mouse.
  map.current.on('mousemove', addLayerId, (e: any) => {
    if (e.features.length > 0) {
      if (hoveredStateId !== null) {
        map.current.setFeatureState(
          {source: source, id: hoveredStateId},
          {hover: false},
        );
      }

      hoveredStateId = e.features[0].id;
      map.current.setFeatureState(
        {source: source, id: hoveredStateId},
        {hover: true},
      );
    }
  });

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
  map.current.on('mouseleave', addLayerId, () => {
    if (hoveredStateId !== null) {
      map.current.setFeatureState(
        {source: source, id: hoveredStateId},
        {hover: false},
      );
    }
    hoveredStateId = null;
  });
};

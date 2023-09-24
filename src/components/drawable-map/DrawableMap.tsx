/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { LoadScript, GoogleMap, DrawingManager, Polygon } from '@react-google-maps/api';
import Iconify from '../iconify/Iconify';
import styles from './DrawableMap.module.css';

type props = {
  setServiceArea: Function;
  serviceArea: any;
};

export default function DrawableMap({ setServiceArea, serviceArea }: props) {
  // Store Polygon path in state
  const lisbonCoordinates = { lat: 38.736946, lng: -9.142685 };
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [fetchedPolygons, setFetchedPolygons] = useState<Array<any>>([]);
  const [drawingMode, setDrawingMode] = useState<any>();
  const [center, setCenter] = useState<{ lat: number; lng: number }>(lisbonCoordinates);
  const [showDeletePolygonButton, setShowDeletePolygonButton] = useState<{
    show: boolean;
    polygon: any;
    id: number | string | undefined;
  }>({
    show: false,
    polygon: undefined,
    id: undefined,
  });

  useEffect(() => {
    const polygonsArray: any = [];
    serviceArea?.coordinates?.forEach((arr: any) => {
      arr.forEach((polygons: any) => {
        polygonsArray.push(
          polygons.map((c: any) => {
            return { lat: c[0], lng: c[1] };
          })
        );
      });
    });

    setFetchedPolygons(polygonsArray);
  }, []);

  const onPolygonComplete = polygon => {
    // Handle the completed polygon, e.g., save the coordinates
    const coordinatesToAdd = polygon
      .getPath()
      .getArray()
      .map(c => {
        return [c.lat(), c.lng()];
      });

    // add the first coordinate to the end of the array to close the polygon
    coordinatesToAdd.push(coordinatesToAdd[0]);

    setServiceArea(prev => {
      let prevCoordinates = [];
      if (prev?.coordinates) {
        prevCoordinates = prev?.coordinates;
      }
      return {
        type: prev?.type || 'MultiPolygon',
        coordinates: [...prevCoordinates, [coordinatesToAdd]],
      };
    });

    setDrawingMode(undefined);
    // Add a click event listener to the polygon
    polygon.addListener('click', () => {
      setShowDeletePolygonButton({ show: true, polygon, id: undefined });
    });
  };

  const handleDeletePolygonClick = polygon => {
    const newCoordinates = serviceArea.coordinates.filter(p => p !== polygon?.getPath().getArray());
    setServiceArea(prev => {
      return { type: prev.type, coordinates: newCoordinates };
    });
    polygon?.setMap(null);
    setShowDeletePolygonButton({ show: false, polygon: undefined, id: undefined });
  };

  const polygonOptions = {
    fillColor: '#2e9edd', // Fill color of the polygon
    fillOpacity: 0.5, // Opacity of the fill
    // strokeColor: '#212b36', // Color of the polygon border
    strokeColor: '#2e9edd', // Color of the polygon border
    strokeOpacity: 1.0, // Opacity of the border
    strokeWeight: 3, // Thickness of the border
  };
  const onMapClick = event => {
    // Update the map center when the map is clicked
    setCenter({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };
  // Define refs for Polygon instance and listeners
  const polygonRef = useRef(null);
  const listenersRef = useRef([]);

  // Call setPath with new edited path

  // Bind refs to current Polygon and listeners

  // Clean up refs
  const onUnmount = useCallback(() => {
    listenersRef.current.forEach((lis: any) => lis.remove());
    polygonRef.current = null;
  }, []);

  const removeFromServiceArea = deleteId => {
    const newCoordinates = serviceArea?.coordinates.filter((c, id) => id !== deleteId);
    const newFetchedPolygons = fetchedPolygons?.filter((p, id) => id !== deleteId);
    setFetchedPolygons(newFetchedPolygons);
    setServiceArea(prev => {
      return { type: prev.type, coordinates: newCoordinates };
    });
    setShowDeletePolygonButton({ show: false, polygon: undefined, id: undefined });
  };

  return (
    <div className={styles.container}>
      <LoadScript
        id="script-loader"
        libraries={['drawing']}
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
        language="en"
        region="us">
        <GoogleMap
          onClick={onMapClick}
          mapContainerClassName={styles.map}
          center={center}
          zoom={10}
          onLoad={() => setMapLoaded(true)}
          options={{
            minZoom: 7,
            streetViewControl: false,
          }}>
          {mapLoaded && (
            <>
              <DrawingManager
                drawingMode={drawingMode}
                onPolygonComplete={onPolygonComplete}
                options={{
                  drawingControlOptions: {
                    drawingModes: [google.maps.drawing.OverlayType.POLYGON], // Allow only polygons
                    position: undefined,
                  },
                  polygonOptions,
                  drawingControl: false,
                }}
              />
              {fetchedPolygons?.map((polygon, id) => {
                return (
                  <Polygon
                    key={id}
                    onClick={e =>
                      setShowDeletePolygonButton({ show: true, polygon: undefined, id })
                    }
                    path={polygon}
                    options={polygonOptions}
                    onUnmount={onUnmount}
                  />
                );
              })}
            </>
          )}
        </GoogleMap>
      </LoadScript>
      {showDeletePolygonButton?.show && (
        <div
          onClick={() => {
            if (showDeletePolygonButton.polygon)
              handleDeletePolygonClick(showDeletePolygonButton.polygon);
            if (showDeletePolygonButton.id || showDeletePolygonButton.id === 0)
              removeFromServiceArea(showDeletePolygonButton.id);
          }}
          className={styles.map__button}
          style={{ position: 'absolute', top: '10px', right: '70px' }}>
          <Iconify icon="eva:trash-2-outline" color="red" />
        </div>
      )}

      <div className={styles.drawing__buttons__container}>
        <div className={styles.map__button} onClick={() => setDrawingMode(undefined)}>
          <Iconify icon="clarity:cursor-hand-grab-line" color="text.secondary" />
        </div>
        <div
          className={styles.map__button}
          onClick={() => setDrawingMode(google.maps.drawing.OverlayType.POLYGON)}>
          <Iconify icon="mdi:pencil" color="text.secondary" />
        </div>
      </div>
    </div>
  );
}

import { useState, useCallback, memo } from 'react';
import Map from 'react-map-gl';
// components
import { MapControl, MapBoxProps } from 'src/components/map';
//
import ControlPanel from './control-panel';

// ----------------------------------------------------------------------

interface Props extends MapBoxProps {
  themes: {
    [key: string]: string;
  };
}

function MapChangeTheme({ themes, ...other }: Props) {
  const [selectTheme, setSelectTheme] = useState('outdoors');

  const handleChangeTheme = useCallback((value: string) => setSelectTheme(value), []);

  return (
    <Map
      initialViewState={{
        latitude: 38.736946,
        longitude: -9.142685,
        zoom: 9,
        bearing: 0,
        pitch: 0,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      {...other}>
      <MapControl />
    </Map>
  );
}

export default memo(MapChangeTheme);

import React, { useEffect, useRef, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import MapComponent from '../MapComponent/MapComponent';

type DisplayedPoint = {
  point: google.maps.LatLngLiteral;
  isCluster?: boolean;
  count?: number;
};

type MapProps = {
  center: google.maps.LatLngLiteral,
  points: google.maps.LatLngLiteral[],
  route: string[]
}

const Map = ({ center, points, route } : MapProps) => {
  const [currentZoom, setCurrentZoom] = useState<number | undefined>(13);
  const [currentCenter, setCurrentCenter] = useState<google.maps.LatLng>();

  const displayedPoints = useRef<DisplayedPoint[]>([]);

  const handleIdle = (map: google.maps.Map) => {
    setCurrentZoom(map.getZoom());
    setCurrentCenter(map.getCenter());
  };

  const mapPoints = useRef<any[]>([]);

  const handleUpdatePoints = () => {
    console.log('points will be updated', mapPoints.current);
    mapPoints.current.forEach((point) => (point.map = null));
    mapPoints.current = [];
    displayedPoints.current.forEach((point) => {
      if (point.isCluster) {
        const container = document.createElement('div');
        container.innerHTML = "<span class='cluster-icon'>" + point.count + '</span>';
        // @ts-ignore
        let currentMarker = new google.maps.marker.AdvancedMarkerElement({
          position: point.point,
          gmpClickable: true,
          content: container,
          map
        });
        google.maps.event.addListener(currentMarker, 'gmp-click', () => {
          if (currentZoom && currentMarker.position) {
            map?.setZoom(currentZoom + 2);
            map?.setCenter(currentMarker.position);
          }
        });
        mapPoints.current.push(currentMarker);
      } else {
        const container = document.createElement('div');
        container.innerHTML = "<span class='map-icon'></span>";
        // @ts-ignore
        let currentMarker = new google.maps.marker.AdvancedMarkerElement({
          position: point.point,
          gmpClickable: true,
          content: container,
          map
        });
        mapPoints.current.push(currentMarker);
      }
    });
  };

  useEffect(() => {
    if (currentZoom) {
      let zoomInKm = (40000 / Math.pow(2, currentZoom)) * 2;
      let zoomInDeg = zoomInKm / 80;
      let currentCenterLat = currentCenter?.lat();
      let currentCenterLng = currentCenter?.lng();
      if (currentCenterLat && currentCenterLng) {
        let radius = zoomInDeg;
        let filteredPoints = points.filter((point) => {
          if (currentCenterLat && currentCenterLng) {
            return (
              Math.abs(point.lat - currentCenterLat) <= radius &&
              Math.abs(point.lng - currentCenterLng) <= radius
            );
          }
          return false;
        });
        let fromLat = -90;
        let toLat = 90;
        let fromLng = -180;
        let toLng = 180;

        const NUMBER_OF_SECTORS = 2 * Math.pow(2, currentZoom);
        const CLUSTER_THRESHOLD = 3;

        let buckets: any = {};

        if (toLat - fromLat !== 0 && filteredPoints.length > 0) {
          filteredPoints.forEach((point) => {
            let nearestLat = Math.floor(
              ((point.lat - fromLat) * NUMBER_OF_SECTORS) / (toLat - fromLat)
            );
            let nearestLng = Math.floor(
              ((point.lng - fromLng) * NUMBER_OF_SECTORS) / (toLng - fromLng)
            );
            let key = JSON.stringify(nearestLat) + ' ' + JSON.stringify(nearestLng);
            if (!(key in buckets)) {
              buckets[key] = [];
            }
            buckets[key].push(point);
          });
        }

        console.log(buckets);

        let visiblePoints: DisplayedPoint[] = [];
        (Object.entries(buckets) as any).forEach((value: [string, any[]]) => {
          let bucket = value[1];
          if (bucket.length > CLUSTER_THRESHOLD) {
            let centerPoint = bucket.reduce(
              (acc, current) => {
                return {
                  lat: acc.lat + current.lat,
                  lng: acc.lng + current.lng
                };
              },
              { lat: 0, lng: 0 }
            );
            centerPoint.lat /= bucket.length;
            centerPoint.lng /= bucket.length;
            visiblePoints.push({
              isCluster: true,
              count: bucket.length,
              point: centerPoint
            });
          } else {
            bucket.forEach((point) => visiblePoints.push({ point: point }));
          }
        });
        displayedPoints.current = visiblePoints;
        handleUpdatePoints();
      }
    }
  }, [currentZoom, currentCenter]);

  const [map, setMap] = React.useState<google.maps.Map>();

  // const [apiToken, setApiToken] = useState<string>('')
  //
  // useEffect(() => {
  //   axios.get('/token', {})
  // }, []);

  return (
    <div className="Map">
      <div className="Map__Content">
        <Wrapper
          apiKey={'AIzaSyCllS8bOprdLh7eMPd0DcM2ZNYe2TrNS9I'}
          libraries={['marker', 'maps', 'geocoding', 'routes']}
          version="beta"
        >
          <MapComponent
            map={map}
            setMap={setMap}
            center={center}
            zoom={6}
            onIdle={handleIdle}
            route={route}
          ></MapComponent>
        </Wrapper>
      </div>
      <div className="Map__Item"></div>
    </div>
  );
};

export default Map;
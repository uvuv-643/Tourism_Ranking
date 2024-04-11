import React, {useEffect, useRef} from 'react';

type MapProps = {
    center: google.maps.LatLngLiteral;
    zoom: number;
    children?: React.ReactNode;
    onClick?: (e: google.maps.MapMouseEvent) => void;
    onIdle?: (map: google.maps.Map) => void;
    map?: google.maps.Map;
    setMap: (map: google.maps.Map) => void;
    route?: string[],
    // @ts-ignore
} & google.maps.marker.AdvancedMarkerElementOptions;

function MapComponent({center, zoom, children, onClick, onIdle, map, setMap, route}: MapProps) {

    const ref = React.useRef<HTMLDivElement>(null);

    const directionsService = useRef<google.maps.DirectionsService>()
    const directionsRenderer = useRef<google.maps.DirectionsRenderer>()

    useEffect(() => {
        directionsService.current = new google.maps.DirectionsService()
        directionsRenderer.current = new google.maps.DirectionsRenderer()
        directionsRenderer.current.setMap(map)
    }, [map]);

    useEffect(() => {
        console.log(route.slice(1, route.length - 1))
        if (route.length > 2 && directionsService.current) {
            directionsService.current.route({
                travelMode: google.maps.TravelMode.WALKING,
                waypoints: route.slice(1, route.length - 1).map((el : any) => { return { location: el }}),
                origin: {
                    query: route[0],
                },
                destination: {
                    query: route[route.length - 1],
                },
            }, (response) => {
                if (directionsRenderer.current) {
                    console.log("response", response)
                    directionsRenderer.current.setDirections(response);
                }
            })
        }

    }, [route]);

    React.useEffect(() => {
        if (map) {
            ['click', 'idle'].forEach((eventName) => google.maps.event.clearListeners(map, eventName));
            if (onClick) {
                map.addListener('click', onClick);
            }
            if (onIdle) {
                map.addListener('idle', () => onIdle(map));
            }
        }
    }, [map, onClick, onIdle]);

    React.useEffect(() => {
        if (ref.current && !map) {
            setMap(
                new window.google.maps.Map(ref.current, {
                    center,
                    zoom,
                    // @ts-ignore
                    mapId: 'DEMO_MAP_ID' // d5f70aa737c73675
                })
            );
        }
    }, [ref, map]);

    return (
        <>
            <div ref={ref} id="map"/>
        </>
    );
}

export default MapComponent;
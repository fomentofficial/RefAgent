'use client';

import { useEffect, useRef } from 'react';
import { KakaoMapLocation } from '@/types';
import { loadKakaoMapScript } from '@/lib/kakao-map';

interface KakaoMapProps {
  location: KakaoMapLocation;
  hallName: string;
}

export default function KakaoMap({ location, hallName }: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
      if (!appKey) {
        console.error('Kakao Map API key is not set');
        return;
      }

      try {
        await loadKakaoMapScript(appKey);

        const mapOption = {
          center: new window.kakao.maps.LatLng(location.lat, location.lng),
          level: 3,
        };

        const map = new window.kakao.maps.Map(mapContainer.current, mapOption);
        mapInstance.current = map;

        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(
          location.lat,
          location.lng
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);

        // 인포윈도우 생성
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px;text-align:center;min-width:150px;">${hallName}</div>`,
        });
        infowindow.open(map, marker);
      } catch (error) {
        console.error('Failed to initialize Kakao Map:', error);
      }
    };

    initializeMap();
  }, [location, hallName]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[300px] rounded-lg border border-gray-300"
    />
  );
}

import { KakaoMapLocation } from '@/types';

declare global {
  interface Window {
    kakao: any;
  }
}

export async function geocodeAddress(
  address: string
): Promise<KakaoMapLocation | null> {
  return new Promise((resolve) => {
    if (!window.kakao || !window.kakao.maps) {
      console.error('Kakao Maps API not loaded');
      resolve(null);
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result: any[], status: string) => {
      if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
        resolve({
          lat: parseFloat(result[0].y),
          lng: parseFloat(result[0].x),
          address: result[0].address_name || address,
        });
      } else {
        resolve(null);
      }
    });
  });
}

export function loadKakaoMapScript(appKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve();
      });
    };

    script.onerror = () => {
      reject(new Error('Failed to load Kakao Maps API'));
    };

    document.head.appendChild(script);
  });
}

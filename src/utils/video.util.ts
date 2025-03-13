import ky from 'ky';

import type { LessonVideoData } from '#/lesson/models/lesson.model';

const VITE_YOUTUBE_API_BASE_URL = import.meta.env.VITE_YOUTUBE_API_BASE_URL;

// Converts ISO 8601 format (PT1H2M30S) to HH:MM:SS
function formatDuration(isoDuration: string): string | null {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  if (!match) return null;

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function getVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : null;
}

export async function getVideoData(url: string): Promise<LessonVideoData> {
  try {
    const videoId = getVideoId(url);

    if (!videoId) {
      return { duration: null, embeddable: false };
    }

    const apiUrl = `${VITE_YOUTUBE_API_BASE_URL}${videoId}`;
    const res = await ky(apiUrl);
    const json = await res.json<any>();

    if (json.items.length <= 0) {
      return { duration: null, embeddable: false };
    }

    return {
      duration: formatDuration(json.items[0].contentDetails.duration),
      embeddable: json.items[0].status.embeddable,
    };
  } catch (error) {
    return { duration: null, embeddable: false };
  }
}

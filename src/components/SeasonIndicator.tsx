'use client';

import { CURRENT_SEASON, SEASON_INFO, getSeasonName } from '@/lib/seasonConfig';

/**
 * 季節指示器元件
 * 顯示當前活躍的季節（SS 或 FW）
 */
export default function SeasonIndicator() {
  const seasonInfo = SEASON_INFO[CURRENT_SEASON];

  return (
    <div
      className="mb-6 border-l-4 p-4 rounded"
      style={{
        backgroundColor: `${seasonInfo.color}15`,
        borderColor: seasonInfo.color
      }}
    >
      <p className="font-semibold text-gray-900">
        當前季節：<span style={{ color: seasonInfo.color }}>{getSeasonName(CURRENT_SEASON)}</span>
      </p>
      <p className="text-sm text-gray-700 mt-1">
        {seasonInfo.description}
      </p>
    </div>
  );
}

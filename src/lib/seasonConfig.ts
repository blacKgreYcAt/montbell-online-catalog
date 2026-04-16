/**
 * 季節配置管理
 * 控制系統當前活躍的季節（SS 春夏 或 FW 秋冬）
 */

export type Season = "SS" | "FW";

/**
 * 當前活躍季節（從環境變數讀取）
 * 環境變數：NEXT_PUBLIC_CURRENT_SEASON
 * 預設值：SS (春夏)
 */
export const CURRENT_SEASON: Season = (
  process.env.NEXT_PUBLIC_CURRENT_SEASON as Season
) || "SS";

/**
 * 季節信息和顯示標籤
 */
export const SEASON_INFO = {
  SS: {
    label: "春夏 (SS)",
    color: "#22c55e",
    description: "春夏商品季節"
  },
  FW: {
    label: "秋冬 (FW)",
    color: "#f97316",
    description: "秋冬商品季節"
  }
};

/**
 * 驗證季節值是否有效
 */
export function isValidSeason(value: any): value is Season {
  return value === "SS" || value === "FW";
}

/**
 * 獲取季節的中文名稱
 */
export function getSeasonName(season: Season): string {
  return SEASON_INFO[season].label;
}

/**
 * 獲取季節的顯示顏色
 */
export function getSeasonColor(season: Season): string {
  return SEASON_INFO[season].color;
}

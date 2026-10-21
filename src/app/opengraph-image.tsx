import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { readThemeTokens } from "@/lib/theme-tokens";

export const alt = `${siteConfig.name} mobile app`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const theme = await readThemeTokens();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: theme.primary,
          color: theme["primary-foreground"],
        }}
      >
        <div style={{ fontSize: 120, fontWeight: 700 }}>{siteConfig.name}</div>
        <div style={{ fontSize: 44, marginTop: 24 }}>{siteConfig.tagline}</div>
      </div>
    ),
    size,
  );
}

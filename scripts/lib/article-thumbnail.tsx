import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { splitTitle } from "./article-utils";
import sharp from "sharp";

type RenderArticleThumbnailOptions = {
  title: string;
  tags: string[];
  date: string;
  backgroundDataUrl: string;
  regularFont: Buffer;
  boldFont: Buffer;
};

export async function renderArticleThumbnail({
  title,
  tags,
  date,
  backgroundDataUrl,
  regularFont,
  boldFont,
}: RenderArticleThumbnailOptions) {
  const titleLines = splitTitle(title);

  const svg = await satori(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        borderRadius: "32px",
        fontFamily: "NotoSansJP",
      }}
    >
      <img
        src={backgroundDataUrl}
        width={1200}
        height={630}
        style={{
          position: "absolute",
          inset: "0",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: "0",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.22) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              borderRadius: "9999px",
              border: "1px solid rgba(191,217,247,0.95)",
              background: "rgba(255,255,255,0.74)",
              color: "#7AAEE0",
              fontSize: "28px",
              fontWeight: 600,
            }}
          >
            uvu1.me
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "780px",
          }}
        >
          {titleLines.map((line, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                color: "#5B79A8",
                fontSize: "68px",
                lineHeight: 1.18,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                textShadow: "0 6px 24px rgba(255,255,255,0.28)",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "10px 18px",
                  borderRadius: "9999px",
                  border: "1px solid rgba(191,217,247,0.95)",
                  background: "rgba(255,255,255,0.74)",
                  color: "#7AAEE0",
                  fontSize: "24px",
                }}
              >
                #{tag}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              padding: "10px 18px",
              borderRadius: "9999px",
              border: "1px solid rgba(191,217,247,0.95)",
              background: "rgba(255,255,255,0.74)",
              color: "#7A8AA0",
              fontSize: "24px",
            }}
          >
            {date}
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "NotoSansJP",
          data: regularFont,
          weight: 400,
          style: "normal",
        },
        {
          name: "NotoSansJP",
          data: boldFont,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  const png = new Resvg(svg).render().asPng();
  const webp = await sharp(png)
    .webp({ quality: 82, effort: 6 })
    .toBuffer();
  return webp;
}

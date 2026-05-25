import { Box } from "@mui/material";

export const HeroGlow = () => (
  <Box
    sx={{
      overflow: "hidden",
      width: "100%",
      height: 660,
      left: 0,
      right: 0,
      top: 0,
      position: "absolute",
      pointerEvents: "none",
      zIndex: 0,
    }}>
    <svg
      width="1440"
      height="660"
      preserveAspectRatio="none"
      viewBox="0 0 1440 660"
      style={{
        display: "block",
        height: 660,
        left: "calc((100% - 100vw)/2)",
        maxWidth: "none",
        position: "absolute",
        top: 0,
        width: "100vw",
      }}>
      <defs>
        {[
          "matrix(-16.0002 318.99999 -526.52012 -26.40887 840 0)",
          "matrix(-285.9981 330.00227 -720.00433 -623.99532 1428 0)",
          "matrix(218 0 0 314 -67 330)",
          "rotate(93.468 241.5 227.307) scale(198.363 432.793)",
          "rotate(179.182 770.094 202.507) scale(280.028 284.085)",
        ].map((transform, i) => (
          <radialGradient
            key={i}
            id={`hero-glow-${i}`}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform={transform}>
            <stop stopColor="#378EE5" />
            <stop offset="1" stopColor="#378EE5" stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} fill={`url(#hero-glow-${i})`} fillOpacity=".2" d="M0 0H1440V660H0z" />
      ))}
    </svg>
  </Box>
);

export const FooterGlow = () => (
  <Box
    sx={{
      overflow: "hidden",
      width: "100%",
      height: 660,
      left: 0,
      right: 0,
      bottom: 0,
      position: "absolute",
      pointerEvents: "none",
      zIndex: 0,
    }}>
    <svg
      width="1440"
      height="660"
      preserveAspectRatio="none"
      viewBox="0 0 1440 660"
      style={{
        display: "block",
        height: 660,
        left: "calc((100% - 100vw)/2)",
        maxWidth: "none",
        position: "absolute",
        bottom: 0,
        width: "100vw",
      }}>
      <defs>
        {[
          "matrix(-16.0002 318.99999 -526.52012 -26.40887 840 0)",
          "matrix(-339 354.00031 -772.36694 -739.63888 1428 0)",
          "matrix(218 0 0 314 -67 330)",
          "rotate(93.468 241.5 227.307) scale(198.363 432.793)",
          "matrix(-269.99953 -7.99925 6.86566 -231.73732 1543 394)",
          "matrix(-92.00031 555.99983 -411.38423 -68.07102 921 -302)",
        ].map((transform, i) => (
          <radialGradient
            key={i}
            id={`footer-glow-${i}`}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform={transform}>
            <stop stopColor="#378EE5" />
            <stop offset="1" stopColor="#378EE5" stopOpacity="0" />
          </radialGradient>
        ))}
        <radialGradient
          id="footer-glow-right-edge"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(480 0 0 260 1440 420)">
          <stop stopColor="#378EE5" />
          <stop offset="1" stopColor="#378EE5" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Группа с поворотом на 180 градусов — как на ton.org */}
      <g transform="rotate(180 720 330)">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} fill={`url(#footer-glow-${i})`} fillOpacity=".2" d="M0 0H1440V660H0z" />
        ))}
      </g>
      <path fill="url(#footer-glow-right-edge)" fillOpacity=".12" d="M0 0H1440V660H0z" />
    </svg>
  </Box>
);

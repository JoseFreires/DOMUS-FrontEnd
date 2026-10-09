"use client";
/**
 * @param {number} width  - largura real do elemento em px (meça no DevTools)
 * @param {number} height - altura real do elemento em px (meça no DevTools)
 * @param {number} radius - border-radius do elemento, em px
 * @param {number} inset  - espessura da borda "espelhada" do vidro, em px
 * @param {number} scale  - intensidade da distorção (maior = mais curvo)
 * @param {string} id     - id do filtro, usado no CSS como url(#id)
 */
export default function LiquidGlassFilter({
  width = 480,
  height = 620,
  radius = 20,
  inset = 9,
  scale = 100,
  id = "lg-filter",
}) {
  const innerW = width - inset * 2;
  const innerH = height - inset * 2;
 
  // Mapa de deslocamento: fundo cinza médio (neutro, sem deslocamento),
  // com um retângulo mais claro/escuro (bordas internas borradas) que
  // concentra a distorção perto das bordas do "vidro".
  const displacementSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="Y" x1="0" x2="0" y1="2%" y2="98%">
        <stop offset="0%" stop-color="#0F0"/>
        <stop offset="100%" stop-color="#000"/>
      </linearGradient>
      <linearGradient id="X" x1="1%" x2="99%" y1="0" y2="0">
        <stop offset="0%" stop-color="#F00"/>
        <stop offset="100%" stop-color="#000"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="#808080"/>
    <g filter="blur(2px)">
      <rect width="${width}" height="${height}" fill="#000080"/>
      <rect width="${width}" height="${height}" fill="url(#Y)" style="mix-blend-mode:screen"/>
      <rect width="${width}" height="${height}" fill="url(#X)" style="mix-blend-mode:screen"/>
      <rect x="${inset}" y="${inset}" width="${innerW}" height="${innerH}" rx="${radius}" ry="${radius}" fill="#808080" filter="blur(8px)"/>
    </g>
  </svg>`;
 
  const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(displacementSvg)}`;
 
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feImage x="0" y="0" width={width} height={height} href={dataUri} result="displacementMap" />
        <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale={scale} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}

function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="600"
      height="388"
      fill="#000"
      viewBox="0 0 600 388" // Ajuste o tamanho do viewBox com base na área real ocupada pelo g e paths
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform="translate(0,388) scale(0.1,-0.1)" stroke="none">
        <path d="M3860 3020 c0 -7 56 -108 124 -224 68 -116 146 -251 173 -301 28 -49 59 -105 70 -123 l21 -33 19 28 c11 15 37 60 58 98 21 39 92 162 158 275 159 273 159 272 153 277 -2 3 -178 7 -390 10 -315 5 -386 4 -386 -7z" />
        <path d="M1371 2988 c55 -79 331 -464 499 -698 508 -706 782 -1090 979 -1376 36 -52 26 -51 369 -44 l262 5 -342 480 c-189 264 -460 644 -602 845 -143 201 -302 424 -353 495 -52 72 -117 164 -145 205 -91 134 -46 120 -390 120 l-299 0 22 -32z" />
        <path d="M2520 3013 c0 -5 17 -30 38 -58 42 -56 301 -417 766 -1067 88 -123 179 -250 203 -283 99 -139 259 -365 301 -425 131 -189 188 -267 206 -287 19 -23 21 -23 308 -23 224 0 288 3 288 13 0 6 -52 84 -116 172 -63 88 -194 273 -292 410 -97 138 -332 468 -522 735 -190 267 -399 560 -465 653 l-118 167 -299 0 c-164 0 -298 -3 -298 -7z" />
        <path d="M1652 1393 c-49 -87 -114 -198 -143 -248 -89 -153 -149 -260 -149 -267 0 -5 175 -8 390 -8 367 0 389 1 383 18 -4 9 -41 76 -83 147 -72 122 -218 378 -270 473 -13 23 -27 42 -31 42 -4 0 -48 -71 -97 -157z" />
      </g>
    </svg>
  );
}

export default Logo;

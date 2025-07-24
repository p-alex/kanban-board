import { SvgType } from ".";

function ChevronDown(svgProps: SvgType) {
  return (
    <svg
      fill="none"
      strokeWidth="1.5"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      ></path>
    </svg>
  );
}

export default ChevronDown;

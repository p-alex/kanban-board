import { SvgType } from ".";

function ChevronUp(svgProps: SvgType) {
  return (
    <svg
      fill="none"
      strokeWidth="1.5"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
      {...svgProps}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 15.75 7.5-7.5 7.5 7.5"
      ></path>
    </svg>
  );
}

export default ChevronUp;

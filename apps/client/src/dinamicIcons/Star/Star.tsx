import { StarIconFill, StarIconOutline } from "../../icons/index.js";

interface Props {
  isFull: boolean;
  size?: number;
}

function Star({ isFull = false, size = 24 }: Props) {
  return (
    <>
      {isFull && (
        <StarIconFill
          style={{ width: `${size}px`, height: `${size}px` }}
          className="text-yellow-400"
          data-testid="filledStar"
        />
      )}
      {!isFull && (
        <StarIconOutline
          style={{ width: `${size}px` }}
          className="text-yellow-400"
          data-testid="emptyStar"
        />
      )}
    </>
  );
}

export default Star;

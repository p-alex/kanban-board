import { ClosedLockIcon, OpenedLockIcon } from "../../icons";

interface Props {
  isClosed: boolean;
  size?: number;
}

function Lock({ isClosed = false, size = 24 }: Props) {
  return (
    <>
      {isClosed && (
        <ClosedLockIcon
          style={{ width: `${size}px`, height: `${size}px` }}
          data-testid="closedLock"
        />
      )}
      {!isClosed && (
        <OpenedLockIcon
          style={{ width: `${size}px` }}
          data-testid="openedLock"
        />
      )}
    </>
  );
}

export default Lock;

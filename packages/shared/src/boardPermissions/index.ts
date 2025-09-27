export enum BoardPermission {
  VIEW_BOARD = "view_board",
  UPDATE_BOARD = "update_board",
  CREATE_BOARD_LIST = "create_board_list",
}

type BoardMemberRole = "admin" | "member" | "viewer" | "guest";
export type BoardRole = BoardMemberRole | "guest";

const boardRolePermissions: Record<BoardRole, BoardPermission[]> = {
  guest: [BoardPermission.VIEW_BOARD],
  viewer: [BoardPermission.VIEW_BOARD],
  member: [BoardPermission.VIEW_BOARD, BoardPermission.CREATE_BOARD_LIST],
  admin: [
    BoardPermission.VIEW_BOARD,
    BoardPermission.CREATE_BOARD_LIST,
    BoardPermission.UPDATE_BOARD,
  ],
};

export function isBoardActionAllowed(
  role: BoardRole,
  permission: BoardPermission
) {
  return boardRolePermissions[role].includes(permission);
}

export type IsBoardActionAllowed = typeof isBoardActionAllowed;

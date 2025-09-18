import { BoardDto } from "@kanban/dtos/BoardDtoTypes";
import { QueryClient } from "@tanstack/react-query";

class BoardCacheUpdater {
  updateOneInGetBoardsCache = (
    queryClient: QueryClient,
    boardDto: BoardDto
  ) => {
    const oldCache = queryClient.getQueryData<BoardDto[]>(["get-boards"]);
    if (!oldCache) return;
    const newCache = oldCache.map((oldBoardDto) => {
      if (oldBoardDto.id === boardDto.id) {
        return boardDto;
      }
      return oldBoardDto;
    });
    queryClient.setQueryData(["get-boards"], newCache);
  };

  updateGetBoardCache = (queryClient: QueryClient, boardDto: BoardDto) => {
    const oldCache = queryClient.getQueryData<BoardDto>([
      "get-board-" + boardDto.id,
    ]);
    queryClient.setQueryData(["get-board-" + boardDto.id], {
      ...oldCache,
      ...boardDto,
    });
  };
}

export default BoardCacheUpdater;

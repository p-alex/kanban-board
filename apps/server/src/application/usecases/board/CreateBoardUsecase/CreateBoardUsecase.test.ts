import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import BoardRepository from "../../../../infrastructure/repositories/board/BoardRepository.js";
import CreateBoardUsecase from "./CreateBoardUsecase.js";
import { mockBoard } from "../../../../__fixtures__/board/index.js";
import BoardFactory, {
  BoardFactoryData,
} from "../../../../domain/board/BoardFactory.js";

describe("CreateBoardUsecase.ts", () => {
  let boardFactory: BoardFactory;

  let boardRepository: Mocked<BoardRepository>;

  let createBoardUsecase: CreateBoardUsecase;

  const mockBoardFactoryData: BoardFactoryData = {
    title: "title",
    status: "public",
    user_id: "user_id",
  };

  const modifiedBoardMock = { ...mockBoard, ...mockBoardFactoryData };

  beforeEach(() => {
    boardFactory = {
      create: vi.fn().mockReturnValue(modifiedBoardMock),
    } as unknown as BoardFactory;

    boardRepository = {
      create: vi.fn().mockResolvedValue(modifiedBoardMock),
    } as unknown as Mocked<BoardRepository>;

    createBoardUsecase = new CreateBoardUsecase(boardFactory, boardRepository);
  });

  it("should create a board using the boardFactory function", async () => {
    await createBoardUsecase.execute(mockBoardFactoryData);

    expect(boardFactory.create).toHaveBeenCalledWith(mockBoardFactoryData);
  });

  it("should call boardRepository.create with correct arguments", async () => {
    await createBoardUsecase.execute(mockBoardFactoryData);

    expect(boardRepository.create).toHaveBeenCalledWith(modifiedBoardMock, {
      transactionQuery: undefined,
    });
  });

  it("should return the created board", async () => {
    const result = await createBoardUsecase.execute(mockBoardFactoryData);

    expect(result).toEqual(modifiedBoardMock);
  });

  it("boardRepository.create should use transactionQuery if it is passed to execute", async () => {
    const transactionQueryMock = vi.fn();

    await createBoardUsecase.execute(
      mockBoardFactoryData,
      transactionQueryMock
    );

    expect(boardRepository.create).toHaveBeenCalledWith(modifiedBoardMock, {
      transactionQuery: transactionQueryMock,
    });
  });
});

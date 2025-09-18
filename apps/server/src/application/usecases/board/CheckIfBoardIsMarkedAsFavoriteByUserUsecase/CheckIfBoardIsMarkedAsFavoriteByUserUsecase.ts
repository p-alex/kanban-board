import { QueryDb } from "../../../../db/index.js";
import FavoriteBoardRepository from "../../../../infrastructure/repositories/favoriteBoard/FavoriteBoardRepository.js";

class CheckIfBoardIsMarkedAsFavoriteByUserUsecase {
  constructor(
    private readonly _favoriteBoardRepository: FavoriteBoardRepository
  ) {}

  execute = async (
    user_id: string,
    board_id: string,
    transactionQuery?: QueryDb
  ) => {
    const favoriteBoard = await this._favoriteBoardRepository.findOne(
      user_id,
      board_id,
      {}
    );
    return favoriteBoard !== undefined;
  };
}

export default CheckIfBoardIsMarkedAsFavoriteByUserUsecase;

import IFavoriteBoard from "./IFavoriteBoard.js";

class FavoriteBoardFactory {
  create = (data: IFavoriteBoard): IFavoriteBoard => {
    return {
      user_id: data.user_id,
      board_id: data.board_id,
    };
  };
}

export default FavoriteBoardFactory;

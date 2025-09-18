import { queryDb } from "../../../db/index.js";
import FavoriteBoardRepository from "./FavoriteBoardRepository.js";

const favoriteBoardRepository = new FavoriteBoardRepository(queryDb);

export default favoriteBoardRepository;

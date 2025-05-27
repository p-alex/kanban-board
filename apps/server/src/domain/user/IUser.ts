interface IUser {
  id: string;
  username: string;
  encrypted_email: string;
  hashed_email: string;
  password: string;
  is_verified: boolean;
  created_at: string;
}

export default IUser;

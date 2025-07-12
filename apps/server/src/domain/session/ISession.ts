interface ISession {
  id: string;
  user_id: string;
  token: string;
  created_at: string;
  last_accessed_at: string;
  expires_at: string;
}

export default ISession;

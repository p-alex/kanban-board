create table
	users (
		id varchar(255) primary key,
		username varchar(16) unique,
		encrypted_email varchar(255) not null,
		hashed_email varchar(255) unique,
		password varchar(255) not null,
		is_verified boolean default false,
		created_at timestamptz default CURRENT_TIMESTAMP
	);

create table
	verification_codes (
		id varchar(255) primary key,
		user_id varchar(255) REFERENCES users (id) ON DELETE CASCADE,
		code varchar(255) unique,
		type varchar(255) NOT NULL CHECK (type IN ('email_verification')),
		created_at timestamptz default CURRENT_TIMESTAMP,
		expires_at timestamptz not null
	);
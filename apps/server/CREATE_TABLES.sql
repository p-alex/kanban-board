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
		type varchar(255) NOT NULL CHECK (type IN ('user_verification')),
		created_at timestamptz default CURRENT_TIMESTAMP,
		expires_at timestamptz not null
	);

create table
	sessions (
		id varchar(255) primary key,
		user_id varchar(255) REFERENCES users (id) ON DELETE CASCADE,
		token varchar(255) unique,
		created_at timestamptz default CURRENT_TIMESTAMP,
		last_accessed_at timestamptz not null,
		expires_at timestamptz not null
	);

create table
	boards (
		id varchar(255) primary key,
		title varchar(255) NOT NULL,
		is_private boolean default false,
		created_at timestamptz default CURRENT_TIMESTAMP
	);

create table
	favorite_boards (
		user_id varchar(255) NOT NULL REFERENCES users (id) ON DELETE CASCADE,
		board_id varchar(255) NOT NULL REFERENCES boards (id) ON DELETE CASCADE,
		PRIMARY KEY (user_id, board_id)
	);

CREATE TYPE board_role AS ENUM ('admin', 'member', 'viewer', 'guest');
create table
	board_members (
		user_id varchar(255) REFERENCES users (id) ON DELETE CASCADE,
		board_id varchar(255) REFERENCES boards (id) ON DELETE CASCADE,
		role board_role NOT NULL DEFAULT 'guest'::board_role,
		joined_at timestamptz default CURRENT_TIMESTAMP,
		PRIMARY KEY (user_id, board_id)
	);

create table
	board_lists (
		id varchar(255) primary key,
		board_id varchar(255) REFERENCES boards (id) ON DELETE CASCADE,
		title varchar(255) NOT NULL,
		index INT NOT NULL,
		created_at timestamptz default CURRENT_TIMESTAMP
	);

create table
	board_cards (
		id varchar(255) primary key,
		board_list_id varchar(255) REFERENCES board_lists (id) ON DELETE CASCADE,
		is_done BOOLEAN DEFAULT false,
		title varchar(255) NOT NULL,
		description TEXT NOT NULL,
		cover TEXT DEFAULT NULL,
		index INT NOT NULL,
		created_at timestamptz default CURRENT_TIMESTAMP
	);

create table
	board_card_stats (
		board_card_id varchar(255) primary key REFERENCES board_cards (id) ON DELETE CASCADE unique,
		attachments INT DEFAULT 0,
		checklist_items INT DEFAULT 0,
		checklist_items_done INT DEFAULT 0,
		has_description BOOLEAN DEFAULT false
	);

create table
	board_card_checklists (
		id varchar(255) primary key,
		board_card_id varchar(255) UNIQUE REFERENCES board_cards (id) ON DELETE CASCADE,
		title varchar(255) NOT NULL,
		index INT NOT NULL,
		created_at timestamptz default CURRENT_TIMESTAMP
	);

create table
	board_card_checklist_items (
		id varchar(255) primary key,
		board_card_checklist_id varchar(255) REFERENCES board_card_checklists (id) ON DELETE CASCADE,
		title varchar(255) NOT NULL,
		is_done BOOLEAN DEFAULT FALSE,
		index INT NOT NULL,
		created_at timestamptz default CURRENT_TIMESTAMP
	);
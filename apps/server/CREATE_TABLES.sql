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

create table sessions (
	id varchar(255) primary key,
	user_id varchar(255) REFERENCES users (id) ON DELETE CASCADE,
	token varchar(255) unique,
	created_at timestamptz default CURRENT_TIMESTAMP,
	last_accessed_at timestamptz not null,
	expires_at timestamptz not null
	);

create table workspaces (
	id varchar(255) primary key,
	user_id varchar(255) REFERENCES users (id) ON DELETE CASCADE,
	title varchar(255) NOT NULL,
	logo TEXT DEFAULT NULL,
	description TEXT DEFAULT "",
	created_at timestamptz default CURRENT_TIMESTAMP
);

create table boards (
	id varchar(255) primary key,
	user_id varchar(255) REFERENCES users(id) ON DELETE CASCADE,
	title varchar(255) NOT NULL,
	is_favorite BOOLEAN DEFAULT false,
	status varchar(255) NOT NULL CHECK (status IN ('public', 'private')),
	created_at timestamptz default CURRENT_TIMESTAMP,
	last_accessed_at timestamptz not null
);

create table board_cards (
	id varchar(255) primary key,
	board_column_id varchar(255) REFERENCES board_columns(id) ON DELETE CASCADE,
	is_done BOOLEAN DEFAULT false,
	title varchar(255) NOT NULL,
	description varchar(255) NOT NULL,
	cover TEXT DEFAULT NULL,
	index INT NOT NULL,
	created_at timestamptz default CURRENT_TIMESTAMP
);

create table board_card_stats (
	board_card_id varchar(255) primary key REFERENCES board_cards(id) ON DELETE CASCADE unique,
	attachments INT DEFAULT 0,
	checklist_items INT DEFAULT 0,
	checklist_items_done INT DEFAULT 0,
	has_description BOOLEAN DEFAULT false,
);

create table board_columns (
	id varchar(255) primary key,
	board_id varchar(255) REFERENCES boards(id) ON DELETE CASCADE,
	title varchar(255) NOT NULL,
	index INT NOT NULL,
	created_at timestamptz default CURRENT_TIMESTAMP
);

create table board_card_checklists (
	id varchar(255) primary key,
	board_card_id varchar(255) UNIQUE REFERENCES board_cards(id) ON DELETE CASCADE,
	title varchar(255) NOT NULL,
	index INT NOT NULL,
	created_at timestamptz default CURRENT_TIMESTAMP
);

create table board_card_checklist_items (
	id varchar(255) primary key,
	board_card_checklist_id varchar(255) REFERENCES board_card_checklists(id) ON DELETE CASCADE,
	title varchar(255) NOT NULL,
	is_done BOOLEAN DEFAULT FALSE,
	index INT NOT NULL,
	created_at timestamptz default CURRENT_TIMESTAMP
);
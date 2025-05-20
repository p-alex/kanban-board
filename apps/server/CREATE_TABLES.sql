create table users (
	id varchar(255) primary key,
	username varchar(16) unique,
	email varchar(255) unique,
	password varchar(255) not null,
	created_at timestamptz default CURRENT_TIMESTAMP
)
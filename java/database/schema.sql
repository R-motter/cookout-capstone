BEGIN TRANSACTION;

DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS menu_item;
DROP TABLE IF EXISTS cookouts;
DROP TABLE IF EXISTS users;
--DROP TABLE IF EXISTS hosts;
--DROP TABLE IF EXISTS chefs;
DROP TABLE IF EXISTS menu;
--DROP TABLE IF EXISTS attendees;
DROP TABLE IF EXISTS invite;
DROP TABLE IF EXISTS roles;

CREATE TABLE users (
	user_id SERIAL,
	username varchar(50) NOT NULL UNIQUE,
	password_hash varchar(200) NOT NULL,
	role varchar(50),
	email_address VARCHAR (150),

	CONSTRAINT PK_user PRIMARY KEY (user_id)
);

CREATE TABLE roles (
host_id SERIAL UNIQUE,
chef_id SERIAL UNIQUE,
attendee_id SERIAL UNIQUE,
user_id INT NOT NULL UNIQUE,

CONSTRAINT FK_role_user FOREIGN KEY (user_id) references users(user_id)
);

CREATE TABLE cookouts (
cookout_id SERIAL,
host_id INT,
chef_id INT,
cookout_name VARCHAR (150),
cookout_date DATE,
cookout_location VARCHAR(250),

cookout_time TIME,

CONSTRAINT PK_cookout PRIMARY KEY (cookout_id),
CONSTRAINT FK_cookout_host FOREIGN KEY (host_id) references roles(host_id),
CONSTRAINT FK_cookout_chef FOREIGN KEY (chef_id) references roles(chef_id)

);


CREATE TABLE menu_item (
menu_item_id SERIAL,
menu_item_name VARCHAR (100),
item_description VARCHAR (200),

CONSTRAINT PK_menu_item PRIMARY KEY (menu_item_id)

);


CREATE TABLE cookout_menu (
cookout_id INT REFERENCES cookouts(cookout_id) ON DELETE CASCADE,
menu_item_id INT REFERENCES menu_item(menu_item_id) ON DELETE CASCADE,

PRIMARY KEY (menu_item_id, cookout_id)
);

--CREATE TABLE menu (
--id SERIAL,
--cookout_id INT,
--item_one_id int,
--item_two_id int,
--item_three_id int,
--item_four_id int,

--CONSTRAINT PK_menu PRIMARY KEY (id),
--CONSTRAINT FK_menu FOREIGN KEY (cookout_id) references cookouts(cookout_id)

--);


CREATE TABLE orders (
order_id SERIAL,
menu_item_id INT,
attendee_id INT,
cookout_id INT,
quantity INT DEFAULT 1,
completed_order BOOLEAN,

CONSTRAINT PK_orders PRIMARY KEY (order_id),
CONSTRAINT FK_order_menu_item FOREIGN KEY (menu_item_id) references menu_item(menu_item_id),
CONSTRAINT FK_order_role FOREIGN KEY (attendee_id) references roles(attendee_id),
CONSTRAINT FK_order_cookout FOREIGN KEY (cookout_id) references cookouts(cookout_id)
);

CREATE TABLE invite (
invite_id SERIAL,
attendee_id INT,
cookout_id INT,

CONSTRAINT PK_invite_attendee PRIMARY KEY (attendee_id, cookout_id),
CONSTRAINT FK_attendee_role FOREIGN KEY (attendee_id) references roles(attendee_id),
CONSTRAINT FK_invite_cookout FOREIGN KEY (cookout_id) references cookouts(cookout_id)
);

COMMIT TRANSACTION;



-- Created tables for host, chef & attendee

--CREATE TABLE chefs (
--    chef_id INT,
--    cookout_id INT,
--
--CONSTRAINT PK_chefs PRIMARY KEY (chef_id, cookout_id),
--CONSTRAINT FK_chef_user FOREIGN KEY (chef_id) references users(user_id),
--CONSTRAINT FK_chef_cookout FOREIGN KEY (cookout_id) references cookouts(cookout_id)
--);

--CREATE TABLE hosts (
--    host_id INT,
--    cookout_id INT,
--
--    CONSTRAINT PK_hosts PRIMARY KEY (host_id, cookout_id),
--    CONSTRAINT FK_host_user FOREIGN KEY (host_id) references users(user_id),
--    CONSTRAINT FK_host_cookout FOREIGN KEY (cookout_id) references cookouts(cookout_id)
--
--);

--CREATE TABLE attendees (
--cookout_id INT,
--attendee_id INT,
--
--CONSTRAINT PK_attendees PRIMARY KEY (cookout_id, attendee_id),
--CONSTRAINT FK_attendee_cookout FOREIGN KEY (cookout_id) references cookouts(cookout_id),
--CONSTRAINT FK_attendee_user FOREIGN KEY (attendee_id) references users(user_id)
--);

--CREATE TABLE attendees (
--cookout_id INT,
--attendee_id INT,
--
--CONSTRAINT PK_attendees PRIMARY KEY (cookout_id, attendee_id),
--CONSTRAINT FK_attendees_cookout FOREIGN KEY (cookout_id) references cookouts(cookout_id),
--CONSTRAINT FK_attendees_roles FOREIGN KEY (attendee_id) references roles(attendee_id)
--);
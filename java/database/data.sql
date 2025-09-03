BEGIN TRANSACTION;

-- the password for both users is "password"
INSERT INTO users (username,password_hash,role) VALUES ('user','$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC','ROLE_USER');
INSERT INTO users (username,password_hash,role) VALUES ('admin','$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC','ROLE_ADMIN');
INSERT INTO users (username,password_hash,role) VALUES ('rachael','$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC','ROLE_USER');
INSERT INTO users (username,password_hash,role) VALUES ('steven','$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC','ROLE_USER');
INSERT INTO users (username,password_hash,role) VALUES ('michael','$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC','ROLE_USER');
INSERT INTO users (username,password_hash,role) VALUES ('garrett','$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC','ROLE_USER');
INSERT INTO users (username,password_hash,role) VALUES ('odin','$2a$08$UkVvwpULis18S19S5pZFn.YHPZt3oaqHZnDwqbCW9pft6uFtkXKDC','ROLE_USER');

INSERT INTO roles(user_id) VALUES (1);
INSERT INTO roles(user_id) VALUES (2);
INSERT INTO roles(user_id) VALUES (3);
INSERT INTO roles(user_id) VALUES (4);
INSERT INTO roles(user_id) VALUES (5);
INSERT INTO roles(user_id) VALUES (6);
INSERT INTO roles(user_id) VALUES (7);

INSERT INTO menu_item(menu_item_name, item_description) VALUES ('Hot Dogs', '100% Beef Hot Dogs');
INSERT INTO menu_item(menu_item_name, item_description) VALUES ('Burger', 'Plain, or with cheese');
INSERT INTO menu_item(menu_item_name, item_description) VALUES ('Pulled Pork', 'Smoked and served with barbeque sauce');
INSERT INTO menu_item(menu_item_name, item_description) VALUES ('Baby Back Ribs', 'I want my Baby Back Baby Back Baby Back Ribs');
INSERT INTO menu_item(menu_item_name, item_description) VALUES ('Bratwurst', 'German pork sausage');
INSERT INTO menu_item(menu_item_name, item_description) VALUES ('Sausage', 'Like Grandma used to make it');
INSERT INTO menu_item(menu_item_name, item_description) VALUES ('Fried Chicken', 'Crispy and golden');
INSERT INTO menu_item(menu_item_name, item_description) VALUES ('Grilled Chicken', 'Grilled white meat breasts');
INSERT INTO menu_item(menu_item_name, item_description) VALUES ('Steak', 'New York Strip');
INSERT INTO menu_item(menu_item_name, item_description) VALUES ('Pork Chops', 'Grilled chops');




COMMIT TRANSACTION;

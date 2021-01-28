CREATE DATABASE a_quora_clone;

CREATE TABLE users
(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- insert fake users
INSERT INTO users
  (user_name, user_email, password)
VALUES
  ('henry', 'henryly213@gmail.com', 'password');
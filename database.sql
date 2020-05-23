-- CREATE DATABASE
  -- TASK 1 - CREATE DATABASE
  CREATE DATABASE launchstoredb;

  -- TASK 2 - CREATE TABLE
  CREATE TABLE "products_with_deleted" (
    "id" SERIAL PRIMARY KEY,
    "category_id" int,
    "user_id" int,
    "name" text NOT NULL,
    "description" text NOT NULL,
    "old_price" int,
    "price" int NOT NULL,
    "quantity" int DEFAULT 0,
    "status" int DEFAULT 1,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now()),
    "deleted_at" timestamp 

  );

  CREATE TABLE "categories" (
    "id" SERIAL PRIMARY KEY,
    "name" text NOT NULL
  );

  CREATE TABLE "files" (
    "id" SERIAL PRIMARY KEY,
    "name" text,
    "path" text NOT NULL,
    "product_id" int
  );

  CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "email" text UNIQUE NOT NULL,
    "password" text NOT NULL,
    "cpf_cnpj" text UNIQUE NOT NULL,
    "cep" text,
    "address" text,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now()),
    "reset_token" text,
    "reset_token_expires" text
  );

  CREATE TABLE "orders" (
    "id" SERIAL PRIMARY KEY,
    "seller_id" int NOT NULL,
    "buyer_id" int NOT NULL,
    "product_id" int NOT NULL,
    "price" int NOT NULL,
    "quantity" int DEFAULT 0,
    "total" int NOT NULL,
    "status" text NOT NULL,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now())
  );

  CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
  )
  WITH (OIDS=FALSE);

  CREATE INDEX "IDX_session_expire" ON "session" ("expire");

  -- TASK 3 - CREATE FOREIGN KEY
  ALTER TABLE "products_with_deleted" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");
  ALTER TABLE "products_with_deleted" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE;
  ALTER TABLE "files" ADD FOREIGN KEY ("product_id") REFERENCES "products_with_deleted" ("id") ON DELETE CASCADE;
  ALTER TABLE "orders" ADD FOREIGN KEY ("seller_id") REFERENCES "users" ("id");
  ALTER TABLE "orders" ADD FOREIGN KEY ("buyer_id") REFERENCES "users" ("id");
  ALTER TABLE "orders" ADD FOREIGN KEY ("product_id") REFERENCES "products_with_deleted" ("id");

  -- TASK 4 - CREATE CONSTRAINT
  ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

  -- TASK 5 - CREATE PROCEDURES
  CREATE FUNCTION trigger_set_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  -- TASK 6 - CREATETRIGGERS
  CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON products_with_deleted
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

  CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

  CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();

  -- TASK 7 - INSERT DATA IN TABLE 'categories'
  INSERT INTO categories(name) VALUES ('Comida');
  INSERT INTO categories(name) VALUES ('Eletrônicos');
  INSERT INTO categories(name) VALUES ('Automovéis');

  -- TASK 8 - CREATE SOFT DELETE
  CREATE OR REPLACE RULE delete_product AS
  ON DELETE TO products_with_deleted DO INSTEAD
  UPDATE products_with_deleted
  SET deleted_at = now()
  WHERE products_with_deleted.id = old.id

  -- TASK 9 - CREATE VIEW
  CREATE VIEW products AS 
  SELECT * FROM products_with_deleted WHERE deleted_at IS NULL;

-- Se DATABASE já existir
  -- TASK 1
  DROP SCHEMA public CASCADE;

  -- TASK 2
  CREATE SCHEMA public;

  -- TASK 3
  DROP DATABASE IF EXISTS launchstoredb;

  -- Usar antes de criar os SEEDS
  -- 1 TASK
  DROP RULE delete_product ON products_with_deleted;

  -- 2 TASK
  DELETE FROM orders;
  DELETE FROM products;
  DELETE FROM files;
  DELETE FROM users;

  -- 3 TASK - RESTART SEQUENCE FROM AUTO INCREMENT TABLES IDS
  ALTER SEQUENCE users_id_seq RESTART WITH 1;
  ALTER SEQUENCE products_with_deleted_id_seq RESTART WITH 1;
  ALTER SEQUENCE files_id_seq RESTART WITH 1;
  ALTER SEQUENCE orders_id_seq RESTART WITH 1;

  -- 4 TASK - RECREATE DELETE RULE
  CREATE OR REPLACE RULE delete_product AS
  ON DELETE TO products DO INSTEAD
  UPDATE products
  SET deleted_at = now()
  WHERE products.id = old.id
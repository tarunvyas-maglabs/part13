CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT, 
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO "blogs" (author, url, title)
VALUES ('Dan Abramov', 'http://danabramov.com', 'On let vs const');

INSERT INTO "blogs" (author, url, title)
VALUES ('Matti Luukkainen', 'http://mattiluukkainen.com', 'Kun MOOCit Helsingin yliopistoon tulivat');
DROP TABLE IF EXISTS Todos;

CREATE TABLE Todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  todo TEXT NOT NULL
);

INSERT INTO Todos (todo) 
VALUES 
  ("Test todo system"),
  ("Run kubernetes"),
  ("Write scripts");
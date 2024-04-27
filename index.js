const express = require("express");

const app = express();
app.use(express.json());

const repl = require("repl");
const replServer = repl.start();

let notes = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(notes);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  const note = notes.find((x) => x.id === id);
  console.log(note);

  if (note) {
    response.json(note);
  } else {
    response.status(404).json({ message: "There is no note with such id"})
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

app.get("/info", (request, response) => {
  const peopleNumber = notes.length;
  const date = new Date();
  const ans = `<p>Phonebook has info for ${peopleNumber} people.<br/><br/>
                  ${date}
              </p>`;
  response.send(ans);
});





const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`)
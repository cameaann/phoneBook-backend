const express = require("express");
var bodyParser = require('body-parser')

const app = express();
app.use(express.json());

const repl = require("repl");
const replServer = repl.start();

// create application/json parser
let jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })


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



const generatedId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

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

app.post("/api/persons", jsonParser, (request, response)=>{
  const body = request.body;
  console.log(body);

  if (!body) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const person = {
    id: generatedId(),
    name: body.name,
    number: body.number
  }

  notes = notes.concat(person)
  response.json(person)
})

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
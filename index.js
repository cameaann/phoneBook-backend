const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors());

morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :response-time - :total-time ms :body'));


const repl = require("repl");
const replServer = repl.start();

// // create application/json parser
// let jsonParser = bodyParser.json();

// // create application/x-www-form-urlencoded parser
// let urlencodedParser = bodyParser.urlencoded({ extended: false });

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

const nameExists = name => {
  return notes.some(n => n.name === name);
}

app.get("/api/persons", (request, response) => {
  response.json(notes);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  // console.log(id);
  const note = notes.find((x) => x.id === id);
  // console.log(note);

  if (note) {
    response.json(note);
  } else {
    response.status(404).json({ message: "There is no note with such id" });
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  // console.log(body);

  if (!body) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name and number must be not empty string"
    })
  }
  if (nameExists(body.name)) {
    return response.status(400).json({
      error: "name must be unique."
    })
  }

  const person = {
    id: generatedId(),
    name: body.name,
    number: body.number,
  };
  notes = notes.concat(person);
  response.json(person);
});

app.put("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const body = request.body;
  const updatedNote  = {
    id: id,
    name: body.name,
    number: body.number
  }

  notes = notes.map((note) => {
    if(note.id === id){
      note = updatedNote
    }
    return note;
});
  response.json(updatedNote)
});


app.get("/info", (request, response) => {
  const peopleNumber = notes.length;
  const date = new Date();
  const ans = `<p>Phonebook has info for ${peopleNumber} people.<br/><br/>
                  ${date}
              </p>`;
  response.send(ans);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);

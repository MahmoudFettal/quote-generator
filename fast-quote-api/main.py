from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from random import randint
import uvicorn
import pandas as pd
import csv

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:2000",
    "http://localhost:3001",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/get_quote")
def get_quote():
    with open('quotes.csv', encoding="utf-8") as quotes:
        quotes = list(csv.reader(quotes))
        index = randint(0, len(quotes))
        return {
            'id': index,
            'quote': quotes[index][1],
            'author': quotes[index][2]
        }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)


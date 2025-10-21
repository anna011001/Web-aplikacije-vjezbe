const express = require("express");

const app = express();

const PORT = 3000;

app.listen(PORT, (error) => {
    if (error) {
    console.error('Greska prilikom pokretanja servera');
  } else {
    console.log(`Express.js poslužitelj sluša na portu ${PORT}`);
  }
});


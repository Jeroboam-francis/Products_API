import express from "express";

const app = express();

let port = 3000;
if (process.env.PORT) {
  port = process.env.PORT;
} else {
  port = 3000;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

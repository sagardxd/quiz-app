const express = require('express');
const cors = require('cors');
const adminRoute = require('./routes/admin')
const userRoute = require('./routes/user')
const app = express();

app.use(cors());

app.use(express.json());
app.use("/admin", adminRoute);
app.use("/user", userRoute);

app.listen(3000, ()=> {console.log("Port running in 3000")});

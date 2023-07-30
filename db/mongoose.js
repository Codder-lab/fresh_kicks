const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

mongoose.connect("mongodb://127.0.0.1:27017/fresh_kicks", {useNewUrlParser: true,})
.then(() => {
    console.log("mongodb connected");
})

.catch((error) => {
    console.log("Failed to connect", error);
})
const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("mongodb connected");
})

.catch((error) => {
    console.log("Failed to connect", error);
})
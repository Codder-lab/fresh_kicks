const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("Database connected successfully");
})

.catch((error) => {
    console.log("Failed to connect", error);
})
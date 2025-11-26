import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URL);

// Export mongoose here so that wherever we import a model we'll always have a connection to use
export default mongoose;

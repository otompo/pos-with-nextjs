var mongoose = require('mongoose');

const dbConnect = () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  mongoose
    .connect(process.env.DB_URL, {})
    .then((con) => console.log('Connected to database'));
};

export default dbConnect;

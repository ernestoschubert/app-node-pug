import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import db from './config/db.js';

// initialize app
const app = express();

// enable reading form data
app.use(express.urlencoded({ extended: true }))

// enable cookie parser
app.use(cookieParser())

// enable csrf
app.use(csrf({ cookie: true }))

// authenticate connection to the database
try {
    await db.authenticate();
    db.sync()
    console.log('Success connection to the Database');
} catch (error) {
    console.log(error);
};

// initialize pug
app.set('view engine', 'pug');
app.set('views', './views');

// asign static public folder
app.use(express.static('public'));

// routing
app.use('/auth', userRoutes);
app.use('/', propertyRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})
import Express from 'express';
import multer from 'multer';

import mongoose from 'mongoose';

import {
  registerValidation,
  LoginValidation,
  postCreateValidation,
} from './validations.js';

import { UserController, PostController } from './controllers/index.js';

import { checkAuth, hendlValidationsErrors } from './utils/index.js';

mongoose
  .connect(
    'mongodb+srv://admin:wwwwww@cluster0.q0hljwm.mongodb.net/blog?retryWrites=true&w=majority'
  )
  .then(() => console.log('DB Ok'))
  .catch((err) => console.log('DB error', err));

const app = Express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(Express.json());
app.use('/uploads', Express.static('uploads'));

app.post(
  '/auth/login',
  LoginValidation,
  hendlValidationsErrors,
  UserController.login
);
app.post(
  '/auth/register',
  registerValidation,
  hendlValidationsErrors,
  UserController.register
);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `./uploads/${req.file.originalname}`,
  });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post(
  '/posts',
  checkAuth,
  postCreateValidation,
  hendlValidationsErrors,
  PostController.create
);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});

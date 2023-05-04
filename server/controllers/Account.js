const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => { res.render('login', { csrfToken: req.csrfToken() }); };

// get rid og the session if you logout
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// authenticate the login info and redirect if it is correct
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are reqired! ' });
  }
  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }
    req.session.account = Account.toAPI(account);
    return res.json({ redirect: '/app' });
  });
};

// make sure the info for the new user works,
// is able to be used then encrypts the password onto the database
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/app' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use. ' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

// changes the password after checing it works after encrypting it
const changePass = async (req, res) => {
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }
  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }
  try {
    const hash = await Account.generateHash(pass);
    await Account.findByIdAndUpdate(req.session.account._id, { password: hash }).exec();
    return res.status(201).json({ message: 'updated password' });
  } catch (err) {
    return res.status(400).json({ error: 'An error occured' });
  }
};
// get a csrf token
const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });

module.exports = {
  loginPage,
  getToken,
  login,
  logout,
  signup,
  changePass,
};

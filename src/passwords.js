const bcrypt = require('bcryptjs');

const hashPassword = (plain) => bcrypt.hash(plain, 10);
const verifyPassword = (plain, hash) => (hash ? bcrypt.compare(plain, hash) : false);

module.exports = { hashPassword, verifyPassword };

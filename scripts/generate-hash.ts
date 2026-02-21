import bcrypt from 'bcryptjs';

const password = 'PopEvents@2026!';
const hash = bcrypt.hashSync(password, 10);
console.log('Password hash for ADMIN_PASSWORD_HASH:');
console.log(hash);

import bcrypt from 'bcrypt';

const createHash = async (password) => {
    const salts = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salts);
}

const validatePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}

export default {
    createHash,
    validatePassword
}
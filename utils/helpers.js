const Users = require('../authentication/controller');
const Posts = require('../posts/controller');

// uuid generation
const checkIdType = typeOfId => {
    switch(typeOfId) {
        case 'user':
        case 'post':
        case 'comment':
            return typeOfId;
        default:
            console.log('Not a valid type. Choose user or post.')
            return
    }
}
const generateId = async typeOfId => {
    const max32 = Math.pow(2, 32) - 1;
    const type = checkIdType(typeOfId);
    let id;
    const user = Users.getUserById;
    const post = Posts.getPostById;
    const comment = Posts.getCommentById;    
    do {
        id = Math.floor(Math.random() * max32);
    } while(
        type === 'user' ? await user(id) : 
            type === 'post' ? await post(id) 
                : await comment(id)
        );

    return id;
}
// const generateId = () => {
//     let uid = '';

//     for(let i = 0; i < 20; i++) {
//         const randomNumber = String.fromCharCode(Math.floor(Math.random() * 10) + 48);
//         const randomLower = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
//         const randomUpper = String.fromCharCode(Math.floor(Math.random() * 26) + 65);

//         const getRandom = Math.floor(Math.random() * 3) + 1;

//         switch(getRandom) {
//             case 1:
//                 uid += randomNumber;
//                 break;
//             case 2:
//                 uid += randomLower;
//                 break;
//             case 3:
//                 uid += randomUpper;
//                 break;
//         }
//     }
//     return uid;
// }

// helper functions
const isEmpty = input => {
    if (!input) return true;
    return false;
}
const isValidLength = (input, length, condition) => {
    switch(condition) {
        case 'greaterOrEqual':
            return input.length >= length;
        case 'lessOrEqual':
        default:
            return input.length <= length;
    }
}
const isValidHandle = input => {
    const regex = /^[a-zA-Z0-9-_]+$/;
    if (input.match(regex)) return true;
    return false;
}
const handleExists = userHandle => {
    const exists = Users.getUserBy({ userHandle });
    return exists;
}
const isValidEmail = input => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (input.match(regex)) return true;
    return false
}
const emailExists = async email => {
    const exists = await Users.getUserBy({ email });
    return exists;
}

// validation functions for login and register
const validateRegister = async data => {
    const errors = {}

    // validating the users handle
    if (isEmpty(data.userHandle)) {
        errors.userHandle = 'Handle must be at least 1 character.';
    } else if (!isValidHandle(data.userHandle)) {
        errors.userHandle = 'This handle is invalid. Characters must be: A-Z, a-z, 0-9, - or _';
    } else if (await handleExists(data.userHandle)) {
        errors.userHandle = `Sorry, ${data.userHandle} already exists. Please chose another handle.`
    } else if (!isValidLength(data.userHandle, 20, 'lessOrEqual')) {
        errors.userHandle = 'Handle must be 20 characters or less.'
    }

    // validating the users email
    if (isEmpty(data.email)) {
        errors.email = 'Email is required.';
    } else if (!isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email.'
    } else if (await emailExists(data.email)){
        errors.email = 'That email is already in use.'
    } 

    // validating the users password
    if (isEmpty(data.password)) {
        errors.password = 'Password is required.'; 
    } else if (!isValidLength(data.password, 6, 'greaterOrEqual') || !isValidLength(data.password, 14, 'lessOrEqual')) { 
        errors.password = 'Password must be between 6 and 14 characters.'; 
    }
    if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords must match.';

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    }
}

const validateLogin = data => {
    const errors = {}

    if(isEmpty(data.userHandle)) {
        errors.userHandle = 'Handle is required.';
    }
    if(isEmpty(data.password)) {
        errors.password = 'Password is required.';
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    }
}

module.exports = {
    generateId,
    isEmpty,
    isValidLength,
    isValidHandle,
    handleExists,
    isValidEmail,
    emailExists,
    validateRegister,
    validateLogin
}
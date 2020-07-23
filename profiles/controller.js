const database = require('../config/dbConfig');

const getSpecificProfile = async userHandle => {
    const user = await database('users')
        .select(
            'id',
            'userHandle',
            'bio',
            'location',
            'site',
            'joinedOn'
        )
        .where({ userHandle })
        .first();
    const posts = await database('posts')
            .where({ userId: user.id })
    return {
        ...user,
        posts
    }
}

module.exports = {
    getSpecificProfile
}
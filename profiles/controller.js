const database = require('../config/dbConfig');

const getSpecificProfile = async userHandle => {
    const profile = await database('users')
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
            .where({ userId: profile.id })

    return {
        ...profile,
        posts
    }
}

module.exports = {
    getSpecificProfile
}
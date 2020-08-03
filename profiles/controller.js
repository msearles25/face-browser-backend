const database = require('../config/dbConfig');
const { getSpecificUsersPosts } = require('../posts/controller');

const getSpecificProfile = async userHandle => {
    const user = await database('users')
        .select(
            'id',
            'userHandle',
            'bio',
            'location',
            'site',
            'imageUrl',
            'joinedOn'
        )
        .where({ userHandle })
        .first();
    // const posts = await database('posts')
    //         .where({ userId: user.id })
    const posts = await getSpecificUsersPosts(user.userHandle);
    return {
        ...user,
        posts
    }
}

const getProfileInfo = id => {
    return database('users')
        .where({ id })
        .select(
            'id',
            'userHandle',
            'email',
            'joinedOn',
            'bio',
            'location',
            'site',
            'imageUrl'
        )
        .first();
}

const updateProfile = async (updatedInfo, id) => {
    await database('users')
        .update(updatedInfo)
        .where({ id })
    return getProfileInfo(id)
}

module.exports = {
    getSpecificProfile,
    getProfileInfo,
    updateProfile
}
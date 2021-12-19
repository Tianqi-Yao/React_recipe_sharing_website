const dbConnection = require('../config/mongoConnection')
const data = require('../data/')
const users = data.users
const posts = data.posts
const recipes = data.recipes


async function main() {
    const db = await dbConnection()

    await db.dropDatabase()

    // firebase default user testuser1@email.com testuser2@email.com, pass 123456
    const testUser1 = await users.addNewUser("JfX3Kuv8y1gLJt8UhdROrbGYOt22", "testuser1")
    const testUser2 = await users.addNewUser("tUNPj9UVGqPjNgW3icOnxxCjcGr2", "testuser2")
    const testUser3 = await users.addNewUser("mIHxaOKW3cODb7TgMs6aRmz6LZS2", "testuser3")

    // const patrick = await users.addUser('Patrick', 'Hill')
    // const id = patrick._id

    // await posts.addPost('Hello, class!', 'Today we are creating a blog!', [], id)

    // await posts.addPost(
    //     'Using the seed',
    //     'We use the seed to have some initial data so we can just focus on servers this week',
    //     [],
    //     id
    // )
    // await posts.addPost(
    //     'Using routes',
    //     'The purpose of today is to simply look at some GET routes',
    //     [],
    //     id
    // )

    // const aiden = await users.addUser('Aiden', 'Hill')
    // await posts.addPost(
    //     "Aiden's First Post",
    //     "I'm 6 months old, I can't blog1",
    //     [],
    //     aiden._id
    // )
    // await posts.addPost(
    //     "Aiden's Second Post",
    //     "I'm still 6 months old, I told you already, I can't blog1",
    //     [],
    //     aiden._id
    // )

    let p1 = await recipes.addPost("1", "111")
    let p2 = await recipes.addPost("1", "111")
    let p3 = await recipes.addPost("1", "111")
    let p4 = await recipes.addPost("1", "111")

    // let u1 = await users.addUser("user", "123", [p1._id, p2._id, p3._id, p4._id], [p1._id, p2._id, p3._id, p4._id])
    // console.log(u1)

    await db.serverConfig.close()
    console.log('Done!')

    // console.log('Done seeding database')
    // await db.serverConfig.close()
}

main().catch((error) => {
    console.error(error)
    return dbConnection().then((db) => {
        return db.serverConfig.close()
    })
})

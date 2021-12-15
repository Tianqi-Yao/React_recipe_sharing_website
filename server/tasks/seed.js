const connection = require('../config/mongoConnection');
const users = require('../data/users');
const recipes = require('../data/recipes');
const { ObjectId } = require('mongodb');

async function main() {
    const db = await connection();
    await db.dropDatabase();

    let p1 = await recipes.addPost("1", "111");
    let p2 = await recipes.addPost("1", "111");
    let p3 = await recipes.addPost("1", "111");
    let p4 = await recipes.addPost("1", "111");

    let u1 = await users.addUser("user", "123", [p1._id, p2._id, p3._id, p4._id], [p1._id, p2._id, p3._id, p4._id]);
    console.log(u1);

    await db.serverConfig.close();
    console.log('Done!');
}

main().catch((error) => {
    console.log(error);
});
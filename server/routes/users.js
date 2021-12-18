const express = require('express')
const router = express.Router()
const data = require('../data')
const userData = data.users;


router.get('/:id', async (req, res) => {
    let uid = req.params.id;
    try {
        if(typeof uid !== 'string') {
            throw 'userId is invalid';
        }
        const user = await userData.getUserById(uid);
        res.json(user)
    } catch (e) {
        res.status(404).json({"ERROR": e.name + ": " + e.message});
    }
});

router.patch('/updateProfile', async (req, res) => {
    let id = req.body.params.id;
    let userInfo = {
        userName: req.body.params.userName,
        password: req.body.params.password
    };
    let updateInfo = {};
    try {
        const preUser = await userData.getUserById(id);
        if (preUser.userName !== userInfo.userName) {
            updateInfo.userName = userInfo.userName;
        }
        if (preUser.password !== userInfo.password) {
            updateInfo.password = userInfo.password;
        }
    } catch (error) {
        res.status(404).json({ error: 'User Not Found' });
    }
    if (Object.keys(updateInfo).length !== 0) {
        try {
            const newUser = await userData.updateUserInfo(id, updateInfo);
            res.json(newUser);
        } catch (e) {
            res.status(500).json({"ERROR": e.name + ": " + e.message});
        }
    } else {
        res.status(400).json({
            error:
                'No fields have been changed from their inital values, so no update has occurred'
        });
    }

});

router.get('/recipe/:id', async (req, res) => {
    let uid = req.params.id;
    try {
        if(typeof uid !== 'string') {
            throw 'userId is invalid';
        }
        const userRecipe = await userData.getRecipeByUid(uid);
        res.json(userRecipe);
    } catch (error) {
        res.status(404).json({"ERROR": e.name + ": " + e.message});
    }
});

router.delete('/deleteRecipe', async (req, res) => {
    let uid = req.query.uid;
    let rid = req.query.rid;
    try {
        if(!req.query.uid || typeof uid !== 'string') {
            throw 'You must provide a valid userId';
        }
        if(!req.query.rid || typeof rid !== 'string') {
            throw 'You must provide a valid postId';
        }
        const userRecipe = await userData.removeRecipeFromUser(uid, rid);
        res.json(userRecipe);
    } catch (error) {
        res.status(500).json({ e: error });
    }
});

router.get('/wishlist/:id', async (req, res) => {
    let id = req.params.id;
    try {
        if(typeof id !== 'string') {
            throw 'userId is invalid';
        }
        const wishList = await userData.getLikesFromUser(id);
        res.json(wishList);
    } catch (e) {
        res.status(404).json({"ERROR": e.name + ": " + e.message});
    }
});

router.patch('/unlike', async (req, res) => {
    let uid = req.query.uid;
    let rid = req.query.rid;

    try {
        if(!req.query.uid || typeof uid !== 'string') {
            throw 'You must provide a valid userId';
        }
        if(!req.query.rid || typeof rid !== 'string') {
            throw 'You must provide a valid postId';
        }
        const wishList = await userData.removeLikesFromUser(uid, rid);
        res.json(wishList);
    } catch (error) {
        res.status(500).json({ e: error });
    }
});

router.patch('/uploadimg', async (req, res) => {
    let img = req.body.params.img;
    let uid = req.body.params.uid;

    try {
        const user = await userData.uploadUserImg(uid, img);
        res.json(user);
    } catch (error) {
        res.status(500).json({ e: error });
    }
});



router.get('/', async (req, res) => {
    try {
        const userList = await userData.getAllUsers()
        res.json(userList)
    } catch (e) {
        // Something went wrong with the server!
        res.status(500).send()
    }
})

router.post('/', async (req, res) => {
    // Not implemented
    const { uid, userName } = req.body
    try {
        const user = await userData.addUserByUidAndUsername(uid, userName)
        return res.json(user)
    } catch (e) {
        console.log(e)
        res.status(501).send()
    }
})

module.exports = router;
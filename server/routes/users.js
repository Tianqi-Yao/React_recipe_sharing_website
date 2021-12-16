const express = require('express')
const router = express.Router()
const data = require('../data')
const userData = data.users

router.get('/:id', async (req, res) => {
    let uid = req.params.id;
    try {
        const user = await userData.getUserById(uid)
        res.json(user)
    } catch (e) {
        res.status(404).json({ message: 'Not Found!' });
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
        } catch (error) {
            res.status(500).json({ e: error });
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
        const userRecipe = await userData.getRecipeByUid(uid);
        res.json(userRecipe);
    } catch (error) {
        res.status(404).json({ message: 'Not Found!' });
    }
});

router.delete('/deleteRecipe', async (req, res) => {
    let uid = req.query.uid;
    let rid = req.query.rid;
    // let recipeInfo = req.params;
    // const {uid, rid} = recipeInfo;

    try {
        const userRecipe = await userData.removeRecipeFromUser(uid, rid);
        res.json(userRecipe);
    } catch (error) {
        res.status(500).json({ e: error });
    }
});

router.get('/wishlist/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const wishList = await userData.getLikesFromUser(id);
        res.json(wishList);
    } catch (error) {
        res.status(500).json({ e: error });
    }
});

router.patch('/unlike', async (req, res) => {
    let uid = req.query.uid;
    let rid = req.query.rid;

    try {
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



module.exports = router;
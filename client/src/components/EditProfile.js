import React from "react";
import { Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import '../App.css';
import axios from "axios";
import * as imageCmp from 'imagecmp';
var fs = require('fs')
    , gm = require('gm').subClass({ imageMagick: true });

function EditProfile(props) {
    const [imgData, setImgData] = useState(undefined);
    const [imgUrlData, setImgUrlData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    // const [formData, setFormData] = useState({ task: '', taskDesc: '' });
    // const handleChange = (e) => {
    //     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // };
    const getImgUrl = () => {
        let img = document.getElementById('img').files[0];
        // gm(img, 'img.jpg')
        //     .write('../img/to/resize.png', function (err) {
        //         if (!err) console.log('done');
        //     });
        imageCmp.compressAccurately(img, 50).then(res => {
            console.log(res);
            imageCmp.filetoDataURL(res).then(res => {
                console.log("dataURL", res);
                setImgUrlData(res)
                // imgFile = res;
            })
        })
    }
    const ChangeProfile = async () => {
        let newImg = await axios.patch(`http://localhost:4000/users/uploadimg`, { params: { uid: props.match.params.uid, img: imgUrlData } });
        setImgData(newImg.data.Photo);
    };


    useEffect(
        () => {
            console.log("useEffect fired")
            async function fetchData() {
                try {
                    const { data } = await axios.get(`http://localhost:4000/users/${props.match.params.uid}`);
                    setImgData(data.Photo);
                } catch (e) {
                    console.log(e);
                } finally {
                    setLoading(false);
                }
            }
            fetchData();
        },
        [props.match.params.uid]
    );

    if (loading) {
        return (
            <div>loading...</div>
        );
    } else {
        return (
            <div className="add">
                <div className="input-selection">
                    <Image className="userIcon" src={imgData} thumbnail />
                    <br/>
                    <label>
                        upload picture:
                        <input type="file" id="img" name="img" accept="image/*" onChange={getImgUrl} />
                    </label>
                </div>
                <button onClick={ChangeProfile}>Submit</button>
                <button>Cancel</button>
            </div>
        );
    }


}

export default EditProfile;
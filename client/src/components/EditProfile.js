import React from "react";
import { Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import '../App.css';
import axios from "axios";
import * as imageCmp from 'imagecmp';
import defaultIcon from '../img/image.jpg';
import { Link } from "react-router-dom";

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
        // let img = document.getElementById('img');
        let img = document.getElementById('img').files[0];
        // var readStream = fs.createReadStream(img.path);//创建可读流
        // var writeStrea, = fs.createWriteStream(newName );
        // readStream.pipe(writeStrea);


        // const localUrl = URL.createObjectURL(img)
        // gm(localUrl, 'img.jpg')
        //     .write('../img/to/resize.png', function (err) {
        //         if (!err) console.log('done');
        //     });
        imageCmp.compressAccurately(img, 50).then(res => {
            console.log(res);
            imageCmp.filetoDataURL(res).then(res => {
                console.log("dataURL", res);
                setImgUrlData(res);
                gm(res).resize(240, 240).noProfile().write('../img/to/resize.png', function (err) {
                        if (!err) console.log('done');
                    });
                // gm(localUrl, 'img.jpg')
                //     .write('../img/to/resize.png', function (err) {
                //         if (!err) console.log('done');
                //     });
                // imgFile = res;
            })
        })



    }
    const ChangeProfile = async () => {
        let newImg = await axios.patch(`http://localhost:3001/users/uploadimg`, { params: { uid: props.match.params.uid, img: imgUrlData } });
        setImgData(newImg.data.Photo);
    };


    useEffect(
        () => {
            console.log("useEffect fired")
            async function fetchData() {
                try {
                    const { data } = await axios.get(`http://localhost:3001/users/${props.match.params.uid}`);
                    if(!data.Photo) {
                        setImgData(data.Photo);
                    } else{
                        setImgData(defaultIcon);
                    }
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
                    <Image className="userIcon" src={imgData} thumbnail multiple="multiple" />
                    
                    <br />
                    <label>
                        upload picture:
                        <input type="file" id="img" name="img" accept="image/*" onChange={getImgUrl} />
                    </label>
                </div>
                <button onClick={ChangeProfile}>Submit</button>
                {/* <button to={`/userprofile/${props.match.params.uid}`}>Cancel</button> */}
                <Link to={`/userprofile/${props.match.params.uid}`}>Cancel</Link>
            </div>
        );
    }


}

export default EditProfile;
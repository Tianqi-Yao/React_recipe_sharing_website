import React from "react";
import { Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import '../App.css';
import axios from "axios";
import * as imageCmp from 'imagecmp';
import noImg from '../img/download.jpeg';
import { Link } from "react-router-dom";
import database from "../config/awsUrl"

// var fs = require('fs')
//     , gm = require('gm').subClass({ imageMagick: true });

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
        imageCmp.compressAccurately(img, 50).then(res => {
            console.log(res);
            imageCmp.filetoDataURL(res).then(res => {
                console.log("dataURL", res);
                setImgUrlData(res);
            })
        })
    }
    const ChangeProfile = async () => {
        let newImg = await axios.patch(`${database}/users/uploadimg`, { params: { uid: props.match.params.uid, img: imgUrlData } });
        setImgData(newImg.data.Photo);
    };


    useEffect(
        () => {
            console.log("useEffect fired")
            async function fetchData() {
                try {
                    const { data } = await axios.get(`${database}/users/${props.match.params.uid}`);
                    if(data.Photo) {
                        setImgData(data.Photo);
                    } else{
                        setImgData(noImg);
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
                    {}
                    <Image className="userIcon" src={imgData} thumbnail multiple="multiple" alt="No Img" />

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
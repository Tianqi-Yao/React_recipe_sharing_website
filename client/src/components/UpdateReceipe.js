import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
// import ImageUploading from "react-images-uploading";
import * as imageCmp from 'imagecmp';
import { useAuth } from "../contexts/AuthContext"
import noImage from '../img/download.jpeg';
import database from "../config/awsUrl"

const UpdateReceipe = (props) => {
    const [post, setPost] = useState(undefined);
    const [id, setID] = useState([]);
    const [fields, setFields] = useState([]);
    const [imageUrl, setImageUrl] = useState(undefined);
    const [updateImage, setUpdateImage] = useState(false);
    const [userID, setUserID] = useState(undefined);
    const { currentUser, updatePassword, updateEmail } = useAuth()
    // const [images, setImages] = React.useState([]);
    // const maxNumber = 1;
    let receipeID = "c77d9075-afc6-4f2e-adaa-d20b11e85335"  // ! for test  props.match.params.id
    let url = `${database}/receipe/mongodb/` + receipeID

    useEffect(() => {

        if (currentUser === null) {
            alert("please login");
            window.history.back(-1);
            return 
        }
        setUserID(currentUser.multiFactor.user.uid);
        setUpdateImage(false);

        const getData = async () => {
            const { data } = await axios.get(url, {
                headers: { Accept: 'application/json' }
            });
            setPost(data)
            setImageUrl(data.image)
            let fields = data.ingredients;
            setFields(fields)
            setID(data._id)
            console.log("post", data);
            console.log("id: ", data._id);
        }
        getData();

    }, []);



    const imageCmpFunc = () => {

        const file = document.getElementById('image').files[0];
        console.log("imageCmp ", typeof file, file);
        if (file == null) {
            setImageUrl(undefined);
            return;
        }
        imageCmp.compressAccurately(file, 50).then(res => {
            console.log(res);
            imageCmp.filetoDataURL(res).then(res => {
                console.log("dataURL", res);
                setImageUrl(res)
                setUpdateImage(true);
            })
        })
        

    }

    const showImage = () => {
        return (
            <img src={imageUrl === undefined ? noImage : imageUrl} alt="" />
        );
    }

    let ingredientsView = () => {
        return (
            <div className="App">
                {fields.map((field, idx) => {
                    return (
                        <div key={`${idx}`}>
                            <label>
                                Ingredient {idx}:
                                <input
                                    id={idx}
                                    type="text"
                                    defaultValue={field}
                                    onChange={e => handleChange(idx, e)}
                                />
                            </label>
                            <button type="button" className="showlink" onClick={() => handleRemove(idx)}>
                                remove
                            </button>
                        </div>
                    );
                })}
                <button type="button" className="showlink"  onClick={() => handleAdd()}>
                    add a ingredient
                </button>
            </div>
        );
    }

    function handleChange(i, event) {
        //event.preventDefault();
        const values = [...fields];
        values[i] = event.target.value;
        setFields(values);
    }

    function handleAdd() {
        const values = [...fields];
        values.push(undefined)
        // console.log("values",values);
        setFields(values);
    }

    function handleRemove(j) {
        let values = [...fields];
        for (let i = 0; i < values.length - 1; i++) {
            if (i >= j) {
                // console.log(values[i]);
                let temp = values[i]
                values[i] = values[i + 1];
                values[i + 1] = null
                // console.log(values, temp);
            }
        }
        values.length = values.length - 1
        console.log("log:", j, typeof values[0], values);
        for (let i = 0; i < values.length; i++) {
            document.getElementById(i).value = values[i];
        }

        setFields(values);
    }

    const formSubmit = async (e) => {
        //disable form's default behavior
        e.preventDefault();
        //get references to form fields.
        let title = document.getElementById('title').value;
        let image = undefined
        if (updateImage) {
            image = imageUrl;
        }
        let cookingMinutes = document.getElementById('cookingMinutes').value;
        let instructionsReadOnly = document.getElementById('instructionsReadOnly').value;
        let ingredients = [];

        fields.map((item, i) => {
            ingredients.push(document.getElementById(i).value);
        });

        let post = {
            id,
            title,
            image,
            cookingMinutes,
            instructionsReadOnly,
            ingredients,
            userID
        };


        setPost(post);
        console.log("222:",post.image);
        const { data } = await axios.patch(`${database}/receipe/update`, post, {
            headers: { Accept: 'application/json' }
        });
        console.log("data", data, fields);
        alert(JSON.stringify(post));
        window.location.href = "/";
    };


    return (
        <div className="container">
            <form id="simple-form" onSubmit={formSubmit}>
                <div className="receipeTitle">
                    <label>
                        Title:
                        <input
                            id="title"
                            name="title"
                            type="text"
                            defaultValue={post && post.title}
                            required
                        />
                    </label>
                </div>
                <div className="receipeImage">
                    <div className="imageInput">
                        <label>
                            image:
                            <input id="image" type="file" onChange={imageCmpFunc} />
                        </label>
                    </div>
                    <div className="img">
                        {showImage()}
                    </div>
                </div>
                <div className="receipeDetile">
                    <div className="min">
                        <label>
                            Cooking Minutes:
                            <input
                                id="cookingMinutes"
                                name="cookingMinutes"
                                type="text"
                                defaultValue={post && post.cookingMinutes}
                            />
                        </label>
                    </div>
                    <div className="instruction">
                        <label>
                            Instructions:
                        </label>
                        <textarea
                            id="instructionsReadOnly"
                            name="instructionsReadOnly"
                            type="text"
                            defaultValue={post && post.instructionsReadOnly}
                            required
                            rows="5" cols="33"
                        />

                    </div>
                </div >
                <div className="ingredident">
                    {ingredientsView()}
                </div>
                <br />
                <input type="submit" className="showlink" value="Submit" />
            </form >
        </div >
    );
}

export default UpdateReceipe
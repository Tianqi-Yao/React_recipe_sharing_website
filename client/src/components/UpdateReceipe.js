import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
// import ImageUploading from "react-images-uploading";
import * as imageCmp from 'imagecmp';
import { useAuth } from "../contexts/AuthContext"
import noImage from '../img/download.jpeg';
import database from "../config/awsUrl"

const UpdateReceipe = () => {
    const [post, setPost] = useState(undefined);
    const [id, setID] = useState([]);
    const [fields, setFields] = useState([]);
    const [imageUrl, setImageUrl] = useState(undefined);
    const { currentUser, updatePassword, updateEmail } = useAuth()
    // const [images, setImages] = React.useState([]);
    // const maxNumber = 1;
    let receipeID = "3ce9608b-0743-4cb5-b301-2607b0fd35ab"  // ! for test
    let url = `${database}/receipe/mongodb/` + receipeID

    useEffect(() => {

        // if (currentUser === null) {
        //     alert("please login");
        //     window.history.back(-1);
        // }

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


    // const onChange = (imageList, addUpdateIndex) => {
    //     // data for submit
    //     console.log(imageList, addUpdateIndex);
    //     setImages(imageList);
    // };

    const imageCmpFunc = () => {
        // const dataURL = document.getElementById('image').src;
        // console.log("dataURL",dataURL);
        // const file = imageCmp.dataURLtoFile(dataURL);
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
            })
        })
        // console.log("fileCmp",fileCmp);
        // const dataURL = imageCmp.filetoDataURL(fileCmp)
        // setImageUrl(dataURL)
    }

    const showImage = () => {
        return (
            <img src={imageUrl === undefined ? noImage : imageUrl} alt="" />
        );
    }

    // const loadimageView = () => {
    //     return (
    //         <div className="App">
    //             <ImageUploading
    //                 multiple
    //                 value={images}
    //                 onChange={onChange}
    //                 maxNumber={maxNumber}
    //                 dataURLKey="data_url"
    //             >
    //                 {({
    //                     imageList,
    //                     onImageUpload,
    //                     onImageRemoveAll,
    //                     onImageUpdate,
    //                     onImageRemove,
    //                     isDragging,
    //                     dragProps
    //                 }) => (
    //                     // write your building UI
    //                     <div className="upload__image-wrapper">
    //                         <button
    //                             style={isDragging ? { color: "red" } : null}
    //                             onClick={(e) => {
    //                                 e.preventDefault();
    //                                 onImageUpload();
    //                             }}
    //                             {...dragProps}
    //                         >
    //                             Click or Drop here
    //                         </button>
    //                         {imageList.map((image, index) => (
    //                             <div key={index} className="image-item">
    //                                 <img src={image.data_url} alt="" width="100" />
    //                                 <div className="image-item__btn-wrapper">
    //                                     <button onClick={(e) => {
    //                                         e.preventDefault();
    //                                         setImageUrl(image.data_url)
    //                                     }}>upload</button>
    //                                     <button onClick={(e) => {
    //                                         e.preventDefault();
    //                                         onImageUpdate(index)
    //                                         setImageUrl(undefined)
    //                                     }}>Edit</button>
    //                                     <button onClick={(e) => {
    //                                         e.preventDefault();
    //                                         onImageRemove(index)
    //                                         setImageUrl(undefined)
    //                                     }}>Remove</button>
    //                                 </div>
    //                             </div>
    //                         ))}
    //                     </div>
    //                 )}
    //             </ImageUploading>
    //         </div>
    //     );
    // }

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
        // values = values.filter(e=> e.key != i)
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
        // let image = document.getElementById('image').value;
        let image = imageUrl;
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
            ingredients
        };

        //   let receipeData = {
        //     id,
        //     title,
        //     image,
        //     instructionsReadOnly,
        //     cookingMinutes,
        //     ingredients,
        //     author
        //   }

        setPost(post);
        const { data } = await axios.patch(`${database}/receipe/update`, post, {
            headers: { Accept: 'application/json' }
        });
        console.log("data", data, fields);
        // setPostData(data);
        alert(JSON.stringify(post));
        // document.getElementById('title').value = '';
        // document.getElementById('image').value = '';
        // document.getElementById('cookingMinutes').value = '';
        // document.getElementById('instructionsReadOnly').value = '';
        // fields.map((item, i) => {
        //     document.getElementById(i).value = '';
        // });
        // setFields([undefined]);
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
                        {/* {loadimageView()} */}
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
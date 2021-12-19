import React, {useState, useEffect} from 'react'
import axios from 'axios'
import '../App.css'
// import ImageUploading from "react-images-uploading";
import * as imageCmp from 'imagecmp';
import { useAuth } from "../contexts/AuthContext"
import noImage from '../img/download.jpeg'; 
import database from "../config/awsUrl"

const CreateReceipe = () => {
    const [post, setPost] = useState(undefined);
    const [fields, setFields] = useState([{ value: null }]);
    const [imageUrl, setImageUrl] = useState(undefined);
    const [userID, setUserID] = useState(undefined);
    const { currentUser, updatePassword, updateEmail } = useAuth()
    

    useEffect(() => {
        if (currentUser === null){
            alert("please login");
            window.history.back(-1);
            return 
        }
        console.log("currentUser",currentUser);
        console.log("currentUserID",currentUser.multiFactor.user.uid);
        setUserID(currentUser.multiFactor.user.uid);
    }, []);

    const imageCmpFunc = () => {
        const file = document.getElementById('image').files[0];
        console.log("imageCmp ", typeof file, file);
        if (file == null) {
            setImageUrl(undefined);
            return;
        }

        imageCmp.compressAccurately(file, 50).then(res => {
            console.log(res)
            imageCmp.filetoDataURL(res).then(res => {
                console.log("dataURL", res)
                setImageUrl(res)
            })
        })
    }

    const showImage = () => {
        return (
            <img src={imageUrl === undefined ? noImage : imageUrl} alt="" />
        );
    }


    const ingredientsView = () => {
        return (
            <div className="App">
                {fields.map((field, idx) => {
                    return (
                        <div key={`${field}-${idx}`}>
                            <label>
                                Ingredient {idx}:
                                <input
                                    id={idx}
                                    type="text"
                                    placeholder="Enter text"
                                    onChange={e => handleChange(idx, e)}
                                />
                            </label>
                            <button type="button" className="showlink" onClick={() => handleRemove(idx)}>
                                remove
                            </button>
                        </div>
                    )
                })}
                <button type="button" className="showlink" onClick={() => handleAdd()}>
                    add a ingredient
                </button>
            </div>
        )
    }

    function handleChange(i, event) {
        const values = [...fields]
        values[i].value = event.target.value
        setFields(values)
    }

    function handleAdd() {
        const values = [...fields]
        values.push({value: null})
        setFields(values)
    }

    function handleRemove(j) {
        let values = [...fields]
        for (let i = 0; i < values.length - 1; i++) {
            if (i >= j) {
                console.log(values[i])
                let temp = values[i]
                values[i] = values[i + 1]
                values[i + 1] = null
                console.log(values, temp)
            }
        }
        values.length = values.length - 1
        // values = values.filter(e=> e.key != i)
        console.log("log:", j, typeof values[0], values)
        for (let i = 0; i < values.length; i++) {
            document.getElementById(i).value = values[i].value
        }

        setFields(values)
    }

    const formSubmit = async (e) => {
        //disable form's default behavior
        e.preventDefault()
        //get references to form fields.
        let title = document.getElementById('title').value
        let image = imageUrl
        console.log("imgae", image)
        // let image = document.getElementById('image').value;
        let cookingMinutes = document.getElementById('cookingMinutes').value
        let instructionsReadOnly = document.getElementById('instructionsReadOnly').value
        let ingredients = []

        console.log("fields,", fields)
        fields.map((item, i) => {
            ingredients.push(document.getElementById(i).value)
        })

        let post = {
            title,
            image,
            cookingMinutes,
            instructionsReadOnly,
            ingredients,
            userID
        }

        console.log("post", post)

        setPost(post)
        const {data} = await axios.post(`${database}/receipe/create`, post, {
            headers: {Accept: 'application/json'}
        })
        console.log("ddddd", data)
        // setPostData(data);
        // alert(JSON.stringify(post))
        document.getElementById('title').value = ''
        // document.getElementById('image').value = '';
        document.getElementById('cookingMinutes').value = '';
        document.getElementById('instructionsReadOnly').value = '';
        document.getElementById('image').value = null;
        fields.map((item, i) => {
            document.getElementById(i).value = '';
        });
        setImageUrl(undefined);
        setFields([{ value: null }]);
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
                            placeholder="Receipe name (must input)"
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
                                placeholder="optional"
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
                            placeholder="must input"
                            required
                            rows="5" cols="33"
                        />

                    </div>
                </div>
                <div className="ingredident">
                    {ingredientsView()}
                </div>
                <input className="showlink" type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default CreateReceipe
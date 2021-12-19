import React, {useState, useEffect} from 'react'
// import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios'  // query server router
import {Link, useHistory} from 'react-router-dom'  // for URL synchronization
import database from "../config/awsUrl"
// import { Card } from 'react-bootstrap';
import '../App.css'
import SearchForm from './SearchForm'
import SubmitForm from './SubmitForm'

import {Card, CardContent, Grid, Typography, makeStyles} from '@material-ui/core'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'

// for userId
import {useAuth} from "../contexts/AuthContext"


const useStyles = makeStyles({
    card: {
        maxWidth: 250,
        height: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5,
        border: '1px solid #1e8678',
        boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
    },
    titleHead: {
        borderBottom: '1px solid #1e8678',
        fontWeight: 'bold'
    },
    grid: {
        flexGrow: 1,
        flexDirection: 'row'
    },
    media: {
        height: '100%',
        width: '100%'
    },
    button: {
        color: '#1e8678',
        fontWeight: 'bold',
        fontSize: 12
    }
})


const ReceipePage = (props) => {
    const apiKey = '01378051ff2c4d99846649b53b91835a'
    // 1 - For fetch data
    const classes = useStyles()  // for using '@material-ui/core'
    const [loading, setLoading] = useState(true)  // ❤ setting my initial state is just like constructor(props) in Class-Based Compoennt
    const [initialData, setInitialData] = useState(undefined)
    const [pageData, setPageData] = useState(undefined)
    // For search
    const [searchData, setSearchData] = useState(undefined)
    const [receipeTerm, setReceipeTerm] = useState('')
    let card = null

    // 2 - For pagination
    props.match.params.page = parseInt(props.match.params.page)  // ❤
    const history = useHistory()  // update URL with button. https://stackoverflow.com/questions/66721132/trying-to-update-url-parameter-with-onclick-in-react
    const [lastPageNum, setLastPageNum] = useState(undefined)

    // 3 - For userId
    const {currentUser} = useAuth()


    // 1 - initial loading data
    useEffect(() => {
        // console.log('Initial loading useeffect() in PokemonPage.js');
        async function fetchData() {
            try {
                const {data} = await axios.get(`${database}/receipe/page/0`)
                // console.log(data.data.results);
                setInitialData(data.results)
                setLoading(false)
                setLastPageNum(Math.floor(data.totalResults / data.number))  // set last page number. //! actually last page number could be 30, after that will repeat
            } catch (e) {
                console.log(e)
            }
        }

        fetchData()  // call fetchData()
    }, [])


    // 2. receipeTerm in 'SearchForm' fire this
    useEffect(() => {  // search form keyword fire this
        async function fetchData() {
            try {
                // const urlSearchForm = baseUrl + '?nameStartsWith=' + receipeTerm + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
                console.log(`search: ${receipeTerm}`)
                const {data} = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${receipeTerm}`)
                setSearchData(data.results)
                setLoading(false)
            } catch (e) {
                console.log(e)
            }
        }

        if (receipeTerm) {
            fetchData()
        }
    }, [receipeTerm])


    // 3 - 'props.match.params.page' fire this
    useEffect(() => {
        // console.log(`'props.match.params.page' useEffect() fired'`);
        async function fetchData() {
            try {
                // console.log(props.match.params.page);
                const {data} = await axios.get(`${database}/receipe/page/${props.match.params.page}`)
                // console.log('-------- pagenum useEffect data -----------');
                // console.log(data);
                setPageData(data.results)
                setLoading(false)
            } catch (e) {
                console.log(e)
            }
        }

        if (props.match.params.page) {
            fetchData()
        }
    }, [props.match.params.page])


    const decrePageNum = async () => {
        props.match.params.page = props.match.params.page - 1
    }

    const increPageNum = async () => {
        props.match.params.page = props.match.params.page + 1
    }

    const buttonChangeUrl = async () => {
        history.push(`/receipe/page/${props.match.params.page}`)
    }

    const searchReceipeTerm = async (searchTerm) => {  // SearchForm
        setReceipeTerm(searchTerm)
    }


    // get likes from database
    const [likes, setLikes] = useState([])  // state is immutable, you cannot directly change it, only use setTask() to change it

    useEffect(() => {
        async function fetchData() {
            try {
                let likesArrayInUser = await axios.get(`${database}/likes/${currentUser.uid}`)  // currentUser.uid is userId.
                console.log('likesOfUser: ', likesArrayInUser)
                setLikes(likesArrayInUser.data)
            } catch (e) {
                console.log(e)
            }
        }

        fetchData()
    }, [])

    const addReceipeToUser = async (receipeId) => {
        receipeId = receipeId.toString()   //! receipeId store in MongoDB with String type
        console.log("addReceipeToUser() ", receipeId)
        let likesOfUser = await axios.get(`${database}/likes/${currentUser.uid}`)  // currentUser.uid is userId.
        console.log('likesOfUser: ', likesOfUser)

        setLikes([...likes, receipeId])

        let newLikeObj = await axios.post(`${database}/likes/${currentUser.uid}`, {
            params: {   // currentUser.uid is userId
                receipeIdNeedToBeAdded: receipeId
            }
        })  // uid is name in server side. This will be passed to corresponding router in Server Side './routes/todos.js'
        console.log('newLikeObj: ', newLikeObj)
    }


    const deleteReceipeFromUserLikes = async (receipeId) => {
        receipeId = receipeId.toString()
        console.log("deleteReceipeFromUserLikes() ", receipeId)
        let likesOfUser = await axios.get(`${database}/likes/${currentUser.uid}`)  // currentUser.uid is userId.
        console.log('likesOfUser: ', likesOfUser)

        setLikes(likes.filter((like) => like.id !== receipeId))  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

        let deleteLikeObj = await axios.delete(`${database}/likes/${receipeId}`, {
            params: {   // currentUser.uid is userId
                userId: currentUser.uid
            }
        })  // uid is name in server side. This will be passed to corresponding router in Server Side './routes/todos.js'
        console.log('newLikeObj: ', deleteLikeObj)
    }

    // const submitReceipeTerm = async (submitTerm) => {  //! SubmitForm, I need a hook that is triggered by 'submitTerm', and in this hook, I need axios to call /search in server side and store returned json
    //   setReceipeTerm(submitTerm);
    // }

    // let likesArrayInUser = await axios.get(`${database}/likes/${currentUser.uid}`);  // currentUser.uid is userId.
    // console.log('likesOfUser: ', likesOfUser);

    // card UI
    const buildCard = (receipe) => {
        //! for toggle button between Collect and UnCollect
        console.log('likes of user in buildCard:', likes)
        const isReceipeIdInLikes = likes && likes.findIndex(x => x === receipe.id)  // is ReceipeId in Likes ?
        console.log('isReceipeIdInLikes:', isReceipeIdInLikes)

        return (
            <Grid item xs={12} sm={4} md={2} lg={2} xl={2} key={receipe.id}>
                <Card className={classes.card} variant="outlined">
                    <Link to={`/receipe/${receipe.id}`}>
                        <img
                            className="card-img-top"
                            src={receipe.image}
                            alt={receipe.title}
                        ></img> {/* https://stackoverflow.com/questions/34097560/react-js-replace-img-src-onerror */}

                        <CardActionArea>
                            <CardContent>
                                <Typography className={classes.titleHead} gutterBottom variant="h6" component="h2">
                                    {receipe.title}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Link>

                    <CardActions>
                        {/* {isReceipeIdInLikes !=-1 ?
              <button onClick={() => { deleteReceipeFromUserLikes(receipe.id);}}>Uncollect</button> :  */}
                        <button onClick={() => {
                            addReceipeToUser(receipe.id)
                        }}>Collect
                        </button>
                        <button onClick={() => {
                            deleteReceipeFromUserLikes(receipe.id)
                        }}>Uncollect
                        </button>
                    </CardActions>
                </Card>
            </Grid>
        )
    }


    if (receipeTerm) {
        card = searchData && searchData.map((char) => {
            return buildCard(char)
        })
    } else if (props.match.params.page && props.match.params.page >= 0) {
        card = pageData && pageData.map((receipe) => {
            // console.log('page data:\n');
            return buildCard(receipe)
        })
        console.log('pageData:', card)
    } else {
        // console.log(initialData)
        // console.log('initial data:\n');
        // {
        //   "id": 716426,
        //   "title": "Cauliflower, Brown Rice, and Vegetable Fried Rice",
        //   "image": "https://spoonacular.com/recipeImages/716426-312x231.jpg",
        //   "imageType": "jpg"
        // },
        card = initialData && initialData.map((receipe) => {
            // let likesArrayInUser = await axios.get(`${database}/likes/${currentUser.uid}`);  // currentUser.uid is userId.
            // console.log('likesOfUser: ', likesArrayInUser);
            // setLikes(likesArrayInUser);
            return buildCard(receipe)
        })
        // console.log('initialData:', card);
    }

    // Error Component
    function ErrorComponent() {
        return (
            <div>
                <h1>404 - You're out of Receipe Page List</h1>
            </div>
        )
    }


    if (loading) {
        return (
            <div>
                <h2>Loading....</h2>
            </div>
        )
    } else {
        if (props.match.params.page < 0 || props.match.params.page > lastPageNum) {
            return (
                <ErrorComponent></ErrorComponent>
            )
        } else if (props.match.params.page === 0) {  // 1st page
            return <div>
                <SearchForm searchValue={searchReceipeTerm}/>
                <button onClick={() => {
                    increPageNum()
                    buttonChangeUrl()
                }} className="btn">
                    Next Page
                </button>
                <br/>
                <br/>
                <Grid container className={classes.grid} spacing={5}>
                    {card}
                </Grid>
            </div>
        } else if (props.match.params.page === lastPageNum) {  // last page
            return (
                <div>
                    <SearchForm searchValue={searchReceipeTerm}/>
                    <button onClick={() => {
                        decrePageNum()
                        buttonChangeUrl()
                    }} className="btn">
                        Previous Page
                    </button>
                    <br/>
                    <br/>
                    <Grid container className={classes.grid} spacing={5}>
                        {card}
                    </Grid>
                </div>
            )
        }

        return (
            <div>
                {props.match.params.page < lastPageNum && props.match.params.page > 0 && (
                    <div>
                        <SearchForm searchValue={searchReceipeTerm}/>
                        <button onClick={() => {
                            decrePageNum()
                            buttonChangeUrl()
                        }}
                                className="btn">   {/* https://upmostly.com/tutorials/multiple-onclick-events-in-react-with-examples#call-multiple-functions */}
                            Previous Page
                        </button>
                        &nbsp;&nbsp;
                        <button onClick={() => {
                            increPageNum()
                            buttonChangeUrl()
                        }} className="btn">
                            Next Page
                        </button>
                        <br/>
                        <br/>
                        <Grid container className={classes.grid} spacing={5}>
                            {card}
                        </Grid>
                    </div>
                )}
            </div>
        )
    }
}

export default ReceipePage


import React, {useRef, useState, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import './NewsFeed.css';
import Header from '../header/Header';
import axios from 'axios';
import News from './News';
import {stemmer} from 'stemmer'


function NewsFeed() {
    const auth = localStorage.getItem("authenticated");
    const user = localStorage.getItem("user");
    
    let [newsList, setNewsList] = useState([]);
    let [searchInput, setSearchInput] = useState('');
    let [recommendedArticle, setRecommendedArticle] = useState({});

    //////////////////////////////////////////////////////////////
    const searchNews = async () => {
        //once user presses search, should trigger the search for articles
        //first normalize the inputs

        // var str = input.toLowerCase();
        var str = searchInput;
        var words = str.split(" ");

        var wordPromises = [];
        var scorePromises = [];
        var queries = [];
        var stopWords = ["a", "all", "any", "but", "the", "and"];

        const keyCounts = new Map();
        const idScores = new Map();

        //stem each input word and add to the queries array
        let j = 0;
        for (var i = 0; i < words.length; i++) {
            if (!stopWords.includes(words[i])) {
                queries[j] = stemmer(words[i]); 
                j++; 
            }
        }

        //iterate through the query array and create a promise for each keyword query
        queries.forEach((query_new) => {
            //backend call to return the articleIDs associated with keyword
            const prom_fst = axios.post('http://localhost:8080/getArticleID', {keyword : query_new});
            wordPromises.push(prom_fst);
        })

        //execute all the promises, add the resulting ids to the hashmap with the number of appearances
        Promise.all(wordPromises).then(function(responses) {
            responses.forEach((res) => {
                res.data.forEach((id) => {
                    if (keyCounts.has(id)) {
                        keyCounts.set(id, keyCounts.get(id) + 1);
                    } else {
                        keyCounts.set(id, 1);
                    }
                })
            })

            for (const entry of keyCounts.entries()) {
                const prom_snd = axios.post('http://lcoalhost:8080/getArticleScore', {username: user, articleId: entry[0]});
                scorePromises.push(prom_snd);
            }

            //execute all the score promises
            Promise.all(scorePromises).then(function(scores) {
                //assumes that the adscoption backend call will return a json with the articleid and score
                //use the scores to order the final list of news articles if two articles have the same number of search terms
                scores.forEach((scoreRes) => {
                    if(scoreRes.data.score !== "0") {
                        idScores.set(scoreRes.data.articleId, parseFloat(scoreRes.data.score));//check that this is using correct format 
                    }
                })
                //sort the article ids first by number of keywords that appear in article, and then if they have the same 
                //occurrence number, use the adsorption score to break the tie
                const compareIds = (id) => idScores.get(id) ?? 0;

                //sortedArticles should now be a sorted map with article ids in order of relevance to user 
                let sortedArticles = new Map([...keyCounts.entries()].sort(function(a,b) {
                    if (a[1] > b[1]) {
                        return 1; // a before b
                    } else if (a[1] === b[1]) {
                        // break tie on end
                        if (compareIds(b[0]) < compareIds(a[0])) {
                            return -1; // b before a
                        } else {
                            return 1; // a before b
                        }
                    } else {
                        return -1; // b before a
                    }
                }
                ))

                //now take the sorted list of article keys and get all of the info for that news post
                var feedproms = [];

                for (const entry of sortedArticles.entries()) {
                    if (feedproms.length < 30) {
                        const prom_thrd = axios.post('http://lcoalhost:8080/getArticleInfo', {articleId: entry[0]});
                        feedproms.push(prom_thrd);
                    }
                }

                Promise.all(feedproms).then(function(articlePromise){

                        const newsComponents = articlePromise.map((temp) => (
                            {
                                headline: temp.data.headline,
                                authors: temp.data.authors,
                                id: temp.data.articleID,
                                category: temp.data.category,
                                date: temp.data.date,
                                short_description: temp.data.short_description,
                                url: temp.data.url,
                            }
                        ))
                        setNewsList(newsComponents);
                }).catch((error) => {
                    console.log(error)
                    });
            }).catch((error) => {
                console.log(error)
            });
        }).catch((error) => {
            console.log(error)
        });
    }

    //handles page refresh, creating new news article components 
    useEffect(() => {
        const otherUser = user;
        
        var user1 = {
            username : otherUser,
        };
        // get the recommended article of the day and render it here 
        axios.post('http://localhost:8080/getRecommendedArticle', user1).then((res) => {
            axios.post("http://localhost:8080/getArticleInfo", {articleId: res.data.articleId}).then((temp) => {
                setRecommendedArticle({
                    headline: temp.data.headline,
                    authors: temp.data.authors,
                    id: temp.data.articleID,
                    category: temp.data.category,
                    date: temp.data.date,
                    short_description: temp.data.short_description,
                    url: temp.data.url,
                });
            }).catch((error) => {
                console.log(error)
            })

        }).catch((error) => {
            console.log(error)
        });
	}, []);

    //method to change input value in serach bar
    const handleInputChange = (e) => {
        setSearchInput(e.target.value)
    }

    if (!auth) {
        return <Navigate to = "/login"/>;
    } else {
        return (

        <div className = "news-page">
            <Header />
            <div className = "news-module-container">
                <div className = "news-module-center">
                    <div className = "news-search-bar-container">
                        <div className = "news-feed-title">
                            News for {user}
                        </div>
                        <div className = "news-search-bar-wrapper">
                            <input 
                                type="news-text"
                                id="newsSearch"
                                value={searchInput}
                                placeholder="Search for News"
                                onChange={handleInputChange}
                                className = "news-search-bar"
                                onKeyPress={(event) => {
                                    event.key === "Enter" && searchNews();
                                }}
                            />
                            <button className= "newsButton" onClick={searchNews}> SEARCH </button>
                        </div>
                    </div>

                    <div className = "news-articles-container">
                        <News 
                                headline = {recommendedArticle.headline}
                                authors = {recommendedArticle.authors}
                                id = {recommendedArticle.id}
                                category = {recommendedArticle.category}
                                date = {recommendedArticle.date}
                                short_description = {recommendedArticle.short_description}
                                url = {recommendedArticle.url}
                                isLiked = {recommendedArticle.isLiked}
                                recommended = {true}
                        />
                        {newsList.map((news, index) => (
                                <News 
                                    key = {index}
                                    headline = {news.headline}
                                    authors = {news.authors}
                                    id = {news.id}
                                    category = {news.category}
                                    date = {news.date}
                                    short_description = {news.short_description}
                                    url = {news.url}
                                    isLiked = {news.isLiked}
                                />
                        ))}
                    </div>
                    
                </div>
            </div>
        </div>
        )
    }
	
}

export default NewsFeed;
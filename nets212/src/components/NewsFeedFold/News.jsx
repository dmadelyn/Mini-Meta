import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import "./News.css"

function News(props) {
  const {
    headline, 
    authors, 
    id,  
    category,
    date,
    short_description, 
    url,
    recommended,
  } = props;


  const [liked, setLiked] = useState(false);

  const params = {articleId: id, username: localStorage.getItem("user")}

  useEffect(() => {
    axios.post("http://3.236.144.208:80/getArticleLike", params).then((res) => {
      setLiked(res.data.liked === "True");
    })
  }, []);


  function toggleLike () {
    console.log("TOGGLINGGGGG LIKE");
    if (liked) {
      axios.post("http://3.236.144.208:80/deleteArticleLike", params).then((res) => {
        if (!res.data.error) {
          setLiked(false);
        }
      });
    } else {
      axios.post("http://3.236.144.208:80/postArticleLike", params).then((res) => {
        if (!res.data.error) {
          setLiked(true);
        }
      });
    }
  }
  
  return (
    <div className = "news-item-container">
      {recommended ? (
        <div className = "recommended-news-container">
          <div className = "recommended-news">
            Recommended Article:
          </div>
        </div>
      ) : ""}
      <div className = "news-item-header-container">
        <a href={url} className = "news-item-headline">
          {headline}
        </a>
        <div className = "news-item-subtitle">
          <div className = "news-item-date">
            {date}
          </div>
          <div className = "news-item-category">
            {category}
          </div>
          <div className = "news-item-authors">
            {authors}
          </div>
        </div>
      </div>
      <div className = "news-item-body-container">
        <div className = "news-item-descrip-wrapper">
          <div className = "news-item-descrip">
            {short_description}
          </div>
        </div>
        <div className = "news-item-like-wrapper">
          <div className = "news-item-like" onClick={() => toggleLike()}>
            {liked ? "❤" : "🖤"}
          </div>
        </div>
      </div>
    </div>

  );
}

    

News.propTypes = {
  headline: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  short_description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  isLiked: PropTypes.string.isRequired,
};

export default News ;
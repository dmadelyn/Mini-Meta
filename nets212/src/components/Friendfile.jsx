import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
 
function Friendfile(props) {
  const { url, name } = props;
  return (
    <div>
      <h1>{name}</h1>
      <Link to="/profile"><img src={url} alt="home/profile icon" /></Link>
    </div>
  );
}
 
Friendfile.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
 
export default Friendfile;
 


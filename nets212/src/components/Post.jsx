import React, { useState, useEffect } from 'react';
import { retrieve } from '../getPost';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./Post.css"
import { useSelector, useDispatch } from 'react-redux';
import Comment from './comment';

function Post(props) {
  const {
    username, 
    content, 
    likedUserIds,  
    recipient,
    commentList,
    timestamp
    // timestamp, recipient
  } = props;

  const LoginUserName = useSelector((state) => state.user.username);
  const likes = likedUserIds.includes(LoginUserName);
  const userIds = useSelector((state) => state.user.id);
  const [, setErrMsg] = useState('');
  const dispatch = useDispatch();
  const [person, setPeople] = useState([]);
  const [timeStampNew, setTimeStamp] = useState();
  const [commentList2, setCommentList2] = useState([]);
  var check = 1;

  
 
  useEffect(() => {
    setCommentList2(commentList);
    check = check + 1;

    let date2 = new Date(parseInt(timestamp));
    setTimeStamp(date2.toDateString());

  }, []);

  // Add comment to post after text input is submitted
  const postComment = async (e) => {
    e.preventDefault();
    const authorOfComment = localStorage.getItem("user");
    var postAuthor = username;
    var timestamp1 = timestamp;
    console.log(timestamp1)
    var key = postAuthor + "," + timestamp1;
    var content = e.target.comment.value;
    console.log("Key: " + key);
    console.log("Comment Author: " + authorOfComment);
    console.log("Content: " + content);

    var commentJson = {
      authorAndTimePost: key,
      authorOfComment : authorOfComment,
      timestamp: new Date().getTime().toString(),
      content : content,
    }
    
    axios.post('http://3.236.144.208:80/addCommentToPost', commentJson).then((res) => {
            console.log(res.data);
            
            e.target.comment.value = "";
        }).catch((error) => {
            console.log(error)
        });
  };

  const likePic = 'data:image/png;base64,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';
  const notLikePic = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPMAAADQCAMAAADlEKeVAAAAkFBMVEXt7e3+/v4AAAD////4+Pjx8fH09PT7+/v19fXr6+vo6Ojl5eXAwMDW1tapqand3d3IyMifn5/Nzc22trZhYWF8fHzCwsIyMjIsLCyQkJA+Pj7T09N0dHRLS0s4ODhXV1eEhIQLCwsUFBQeHh5eXl5paWkcHByMjIxMTEwlJSWBgYFDQ0OYmJhYWFitra11dXWsafbNAAASyElEQVR4nO2dCZOiuhaAwRhFUUFxt9VWm1Fb2/7//+6yKMJZ2HGZuXlVt+ZV7CQfWc+SE0WAJJVoqoP8OsiXsACQrzRBvgbyNZDfhAWU30KhRhIuMZqv4hJBAYgZ5DdAfgMUgJlLb+H/zP8z/89MlSgjK0SFzOE1zEmPYA5+dVsV3XrbRncw7ow7bjIHxnUBLZ/ZW82lvjC9mpwazYWhKwF6XYQbWApz9Aei7tbV6l7O3/ZwvTytJpPp9HicTubLH3vUNxUBeqEos5RCW/Q+7a/DfOJUdJxOJ6v5cv1lj2aXge42pgkKKHdse7tn1xodpttNjUyb3XI/Ntph7ALMzsfVB+f1cctUtj2ePnoLb3yVy+z/QLjEmmHOlnT94XT8tRbtoJzczM5o6uznydWtvsddGcIurZ+dInVrnwLYT8u9pctCzLI9Pn8xHYyxR71u84ZdErMzphf7ddoWeOk47BneEM/FLNvWxypLdbXlqKP50KUwO8SD4TFTC9y0PZ1d6hzMUrfWfzLX9+dgOTNbJc7bmZmFKsdfmRvgp12/q9yLZphVkBTDOuWsb35pE8yg/GTmpjr+YBbpNOnQV9wRd68ltp/dX2qWnb+62s+lATd4op/jJTVpzKYFmuCMcHvgLi73CjBzJOmjgvWNTMQMZUkJUr0ZSqLZSb1Us2ky0xtcBU6qh/Ia8pJ3WIfq6zdEpAaIqMAUWnKEaH8UboGb5tZ9u8YHu1Dl5rCU+k5G+CyKDrMxzM5qvS6lCU6adQNoViSQeq/YsL6niRVaJTIwi7qV4hCUNn1ZrSTmwW+BtRKk4/m+cqVnFmo/+5Yck6bn6/gGzNexLZXcGxSZNh+ayMostM8ym+CmwyKmn43fsqtbt0U2ZqGkQ97uXNFuPl9xsk84rS7uGZxibo1TrBybo1uVI7we053Rvgxf25CSWch90tya/PzO+hfLk+LH447VO38Ok5ag3achCWbZ7iedrXfr0blndcbm2FUaWJfeeTScJzVx6EGnY3bO17NtXGFHuzfo6tLTi6jKdYtX2oZp/SasAV9diZUQ7VF8x22HPbOrBycJ1debtI2FNYr/Vra3kKVk7vPlbFajhayrgf4rXKJ0GtKxd3HNmFsaZB7Enua3h4vRVpAS4qq+bxjn5TYG2v3AaZiF2mELmdiWvNGSK4SUwjivY0bdsedvndcinJNe3Hp9+hyo8OAUOTU53OPRia1v5nzhFMxCDLh9eb7vtDRK3A0n98zc/+ExtvvQeUGovUkM8dnVBOBeiQ4UTRmcuSVwZzXTzGehM3LNn5npbLEpVLOuTuUSc07/DoQ50exv2Z9NPeIE5bFwBTWpLHrMzD4tUjCrzTP91/ag5Q6yVOpod2k78zS27ouXohGzPfzqTW8OpVQed/d0fbaiJjILejIfLMWfVmnNDq5UyC7ih4UnVOvsQWQ79CXQ9MxSmjb5Ac/JzJJcUn4Xt4WkERGGadPpbVXtsCvy0kXiJpEzInshuR4xh+wmYYHcEfXJPa+LhMc6SNTI3p6VZvCDRjRpsIBwXvebG7sns26wyEOzod1LgRVooAVBRlO7ULPals1oAVHdkBBdYs3+06sHu1MKDVs4kxcPT31OVt7sjUjPpLW0uFPBJJq/s4B2CjDXv/HfTDrh/TijXVIusmq3lhbYkDNYWoQwDrjELz0KCZhNPDg2VkbLCMiXn7EHM5hsAzJlspyKLkHQi5i0osxC2+NGnK/rZ05mRdW4vZNI230LFZCe2VvmO3g2/bRjmA28u4wAVHabu2hSs4xMu4tGbARZ+tk95uByOzyzOkO/PhiZLZ2I2dlu0hkF5u62XdTPQEisuDyEB3eEWUi0v+162a27kNkr+TOFnO/Iu5QYlJWZGlYLltlCv7X1ehnMTkMTtWubkY6E0zzMTgvxGWPEMAuBtxWzLB8aUbe28cyza1NKYNbR952HOcP/NtCKZ1OqnMzMVycYM3bP6t8mUTFmzy4pe7D07YVh7sOD4sYshfmaIQa8fDm9BPthCf0sDSQ0jO7rUohZ1NF6Z+tl+IcFx1aVtYusrPuyUXgNc1rYQjM6tP+EmfGx7UJ+RcAM8mNEP+c0T+uBdp3Q7oCYYQUpmCU6Tx47JLMFt5P1glFHZ+vnUJ7QSU2QGWtSyz62FUUfwTr6QR1CCaRhrB/ZeyUC421eX+ZrNYQM4MowCQJ5JKXxZZY9uGDarZvQLe7ysw6n87RT1zQkHmswJf0AZJtwIZteGpkKSJePvu1qcZefg/5C2s61EtZC3BJwC8jeLWCq7XrtfAMnSGQLVaR26mBbuxzDnWrkidrlu+GakVr6sIJyHIUF2qJ7CFmRF/gjX26GVwmyMqt4+nXuc22zT1S8IBUeYFZp5vYW4Hy0YUFKC4rOW1342uNizMSS0+zc9ulTX8umbCKYmX4WcKoudcTchuqpiS+CV+BiLlTjMjqclnZv4RxFKnKCF3BJ3mFmHX6XoYgpsRCz2wtS13V/NaqKGU1orPPV4fif+XVXdJXguleqlV12EAvIPIYtkV34k06F/RxOVTG3IdAFMQ/QUHhzZgmF6DNiRmaq9rszwwPfN2KGU/6P8ubMGtT62IgZShgr+ebMdShafSFmeCRZvjtzEyquD4gZGqp+Gu/MLAjd/gkxw5Fga6mYc5gdQAH5lU3x/azCFWoetOTmOQ1lL1v6zs8acH7WgPs18o6G+Q2QH+e/7bUkawVcCxHzrSWBuIv6Wb91C9ZCRLulDHG3iEDOtRAxBy28DhSe+RHTL5xKWyDgfJ5fbcp3ZriGff0DzGhlf3dmpBA43FADZvhVVu/O3Iaz9QcxQ5vkziDd6t+HWYdKEBsxY7nq3ZmhEuQTMeuQufPezNKAetweYpZb8JPzmzObgKdmImYNms+Gb86MXGkMxIwssZO4Et+AGYrPWwmZVXQkdw3ub8zcgk4TBw0x44V79s7M2BS1b6KxLQyk4G4/hhlUUBIz8mgMjO6hflbghJ57g7u4uJvEXLifqRbq8EbInwXBjPQKG2+3ytrPmU1qyZdaQAFp+llacDr/6Hfme+PRz2zlkeLu/SNmFMix5VRgZVhtj82STupCr56jWYldEuRXMVmEAVm2PWxydxPyV9/Xqa9YwVCMY85jf8ZenKcBySyR49BRp8Z2uf1cxeYnJLr3QFjcvdRG3lv7N2VGhihuaBN72rZVeGw/Rb+NHLJWBo2sSGSyrZ3fkFkTY8QxYrrZOaOi7zM33pC5gW8x0SuYVx3yHap9w9+8PnOjhy6y/XDErrMB8jaeWu/GLBfYe9hiu9lZufEllCGY/S/PrOPoE2t0Zytc3xhf3+hHf//qzHKMrwP0eWIntfDdwc0i0uoXZ5Y6dhH/wV5SkT8xsYP1MOJM9uLMCr4JuO3HIivEobu2PbdC+a/NLC18penAnUeChPTcziEm7Ab8hHDZkJmXJeWCCB6BF23w1VXqmugwdJkWmsjhfQwVmchhBdBEDvKRjT2pgtDAaRCNP2BBDY6khkHcCPqu3+7GvrJuCLtTOOnPGFZAxUC8EFcbL8Ed6BdkDnIGxK21Tz1NrEuDCIg3NV+fWejEHfflQCYwC7dEfDmp5h5lxIszC0lE/tj2U8Y0xaae2n0de1Vm0aAinn200sZxbVEhJa4X3l+UWTTRbU8nTdwzZDpmOaAibMy8cDmvySwEedXY0wiljddLje5NL10E4CcwC2FSvfSr0y2kSyQEMleR1qzs+kQhZqFSy65/3zM9M3mIq00vzVdkFmJA7FK1yfXQmToWtexQ8Qcm1ksyIwuMl26iUYb428Q5zjXnJEd6fjRzs03en785b2';

  // <button type="button" className="comment-submit" onClick={newComment}>POST!</button>
  // {commentList.map((comment) => (
  // comment ))}
  
  return (
    <div className = "overcontainer">
      <div className = "wrap">
        <div className = "topDiv">
          <div className = "proPicLeft">
            <img className = "proimg" src={require("./noAvatar.png")}></img>
            <h3 className="usernameDisplay">{username}</h3> 
            <h3 className="dateDisplay">{timeStampNew}</h3>
            &ensp;  {">>>"}  
            <h3 className="usernameDisplay2">{recipient}'s page</h3>
          </div>
        </div>
        <div className="postBody">
            <span className="postContent">{content}</span>
        </div>
        <div className = "bottomDiv">
          <h3 className="comments-title">Comments</h3> 
          <div className= "commentSection2">
          {commentList.map(val => ( 
            <div className="comment"> 
               <p>
               <span class="gray"><i> {(new Date(parseInt(val.timestamp)).toDateString())} </i>  </span>
               &ensp;  <span class="black">|</span> &ensp;
               <span class="blue"> {val.author}  </span>: 
               <span class="black"> {val.content}  </span> 
               
               </p>
            </div>
            ))}
          <form onSubmit = {postComment}>
                <input className= "form3"
                  type="text"
                  name="comment"
                  id = "commentID1"
                  placeholder="Comment Here"
                />
                <button type="submit" className="submit3">Submit</button>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}

    

Post.propTypes = {
  id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  taggedUserIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  likedUserIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  commentList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    postId: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    commentUserId: PropTypes.string.isRequired,
    commentUsername: PropTypes.string.isRequired,
  })).isRequired,
};

export default Post;
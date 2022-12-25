/*import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { retrieve } from '../getPost';
import PropTypes from 'prop-types';

function comment(props) {
	const{
		comment
	} = props;
	const id = localStorage.getItem("user");
	const dispatch = useDispatch();
	//const currentUser = useSelector((state) => state.user.id);
	const [editComment, setComment] = useState(false);
	const [editInput, setInput] = useState(comment.content);
	
	const delComment = async (e) => {
		e.preventDefault();
		// backend call herre;
		dispatch(retrieve(id));
	};
	
	const edit = () => {
		setComment(true);
	};
	
	const makeEdit = async (e) => {
		e.preventDefault();
		const changes = {...comment };
		changes.content = editInput;
		await edit(changes._id, changes);
		setComment(false);
		dispatch(retrieve(id));
	};
	
	const del = (
		<>
		<img width="12" height= "10" onClick={edit} alt="edit" role="presentation" src="https://cdn-icons-png.flaticon.com/512/6065/6065488.png"/>
		<img width="12" height="10" onClick={delComment} alt="edit" role="presentation" src="https://t4.ftcdn.net/jpg/03/01/07/99/360_F_301079914_TDcwbIag3uOp7dwNRWb0bqpfWeOzb6Xu.jpg"/>
		</>
	);
	
	if (editComment) {
		return (
			<li>
			<onChange{...(e) => setInput(e.target.value)} type="text" value={editInput}/>
			<button type="button" onClick={makeEdit}>Submit</button>
			</li>
		);
	}
	return(
		<li>
		<p> {comment.usernameComm}</p>
		<p> {comment.content}</p>
		{id === comment.commId && del}
		</li>
	);
 	
}

Comment.propTypes = {
	comment: PropTypes.shape({
		_id: PropTypes.string.isRequires, 
		content: PropTypes.string.isRequired,
		commId: PropTypes.string.isRequired,
		usernameComm: PropTypes.string.isRequired,
	}).isRequired,
};
export default comment;

*/
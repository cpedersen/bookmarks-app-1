import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Rating from '../Rating/Rating';
import config from '../config';
import BookmarksContext from '../BookmarksContext';
import './BookmarkItem.css';

BookmarkItem.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  desciption: PropTypes.string,
  rating: PropTypes.number.isRequired,
  onClickDelete: PropTypes.func,
}

function deleteBookmarkRequest(bookmarkId, callback) {
  fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      'authorization': `bearer ${config.API_KEY}`
    }
  })
    .then(res => {
      if (!res.ok) {
        // get the error message from the response,
        console.error("Can't execute fetch in BookmarkItem.js")
        return res.json().then(error => {
          //Return error
          return res.json().then(error => Promise.reject(error))
          //throw error
        })
      }
      return res.json()
    })
    .then(data => {
      // call the callback when the request is successful
      // this is where the App component can remove it from state
      callback(bookmarkId)
    })
    .catch(error => {
      console.error(error)
    })
}


export default function BookmarkItem(props) {
  return (
    <BookmarksContext.Consumer>
      {(context) => (
      <li className='BookmarkItem'>
        <div className='BookmarkItem__row'>
          <h3 className='BookmarkItem__title'>
            <a
              href={props.url}
              target='_blank'
              rel='noopener noreferrer'>
              {props.title}
            </a>
          </h3>
          <Rating value={props.rating} />
        </div>
        <p className='BookmarkItem__description'>
          {props.description}
        </p>
        <div className='BookmarkItem__buttons'>
          <Link to={`/edit/${props.id}`}>
            Edit
          </Link>
          {' '}
          <button
            className='BookmarkItem__description'
            onClick={() => {
              deleteBookmarkRequest(
                props.id,
                context.deleteBookmark,
              )
            }}
          >
            Delete
          </button>
        </div>
      </li>
      )}
    </BookmarksContext.Consumer>
  )
}

BookmarkItem.defaultProps = {
  onClickDelete: () => {},
}



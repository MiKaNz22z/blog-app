import { Alert, Button, Textarea, Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

function CommentSection({postId}) {
    const {currentUser} = useSelector(state => state.user);
    const [ comment, setComment ] = useState('')
    const [ commentError, setCommentError ] = useState('');
    const [ comments, setComments ] = useState([]);
    const [ showModal, setShowModal] = useState(false);
    const [ commentToDelete, setCommentToDelete] = useState(null);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 200) {
          return;
        }
        try {
          const res = await fetch('/api/comment/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: comment,
              postId,
              userId: currentUser._id,
            }),
          });
          const data = await res.json();
          if (res.ok) {
            setComment('');
            setCommentError(null);
            setComments([data, ...comments]);
          }
        } catch (error) {
          setCommentError(error.message);
        }
      };

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`);
                if(res.ok){
                    const data = await res.json();
                    setComments(data);
                }
            } catch(error) {
                console.error(error.message);
            }
        }
        getComments();
    }, [postId])

    const handleLike = async (commentId) => {
        try {
            if(!currentUser) {
                navigate('/sign-in');
                return;
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: 'PUT',
            });
            if(res.ok) {
                const data = await res.json();

                setComments(
                    comments.map((comment) =>
                      comment._id === commentId
                        ? {
                            ...comment,
                            likes: data.likes,
                            numberOfLikes: data.likes.length,
                          }
                        : comment
                    )
                  );
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const hanldeEdit = async (comment, editedContent) => {
        setComments(
            comments.map((c) => 
                c._id === comment._id ? { ...c, content: editedContent } : c
            )
        )

    }

    const handleDelete = async (commentId) => {
        setShowModal(false);
        try {
            if(!currentUser){
                navigate('/sign-in');
                return;
            }
            const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
                method: 'DELETE',
            });
            if(res.ok) {
                const data = await res.json();
                setComments(comments.filter((comment) => comment._id !== commentId));
            }
        } catch (error) {
            console.log(error.message);
        }
    }

  return (
    <div className='max-w-4xl mx-auto w-full'>
        {currentUser ? 
        (
            <div className="flex items-center gap-1 my-5 text-gray-500 text-md">
                <p>Signed in as:</p>
                <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt="" />
                <Link to={'/dashboard?tab=profile'} className='text-sm text-blue-700 hover:underline'>
                    @{currentUser.username}
                </Link>
            </div>
        ) : (
            <div className="text-md text-black my-5 flex gap-1">
                You must be signed  in to comment.
                <Link className='text-blue-700 hover:underline' to={'/sign-in'}>
                    Sign In
                </Link>
            </div>
        )}

        {currentUser && (
            <form onSubmit={handleSubmit} className=''>
                <Textarea
                    placeholder='Add a comment...'
                    rows='3'
                    maxLength='200'
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                    className='rounded-none h-60 focus:bg-white p-5'
                />
                <div className="flex justify-between items-center mt-5 gap-4
                    max-semi-sm:flex-col max-semi-sm:items-start
                ">
                    <p className='text-gray-500 text-md'>{200 - comment.length} characters remaining</p>
                    {/* <Button outline gradientDuoTone='pinkToOrange' type='submit'>
                        Submit
                    </Button> */}

                    <button className='p-3 font-semibold w-40 border text-black border-black 
                        hover:bg-black hover:text-white transition-all
                        max-semi-sm:w-full' 
                        type='submit'
                    >
                        Submit
                    </button>
                </div>
                { commentError && (
                    <Alert color='failure' className='mt-5'>
                        {commentError}
                    </Alert>
                )}
            </form>    
        )}
        {comments.length === 0 ? (
            <p className='text-sm my-5'>No comments yet!</p>
        ) : (
            <>
                <div className="text-sm my-5 flex items-center gap-1">
                    <p>Comments</p>
                    <div className="border border-gray-400 py-1 px-2 rounded-sm">
                        <p>{comments.length}</p>
                    </div>
                </div>
                {comments.map(comment => (
                    <Comment
                        key={comment._id}
                        comment={comment}
                        onLike={handleLike}
                        onEdit={hanldeEdit}
                        onDelete={(commentId) => {
                            setShowModal(true);
                            setCommentToDelete(commentId);
                        }}
                    />
                ))}
            </>
        )}

        <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
            <Modal.Header />
            <Modal.Body>
            <div className="text-center">
                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure to delete this comment ?</h3>
                <div className="flex justify-between gap-4">
                <Button color='failure' onClick={() => handleDelete(commentToDelete)}>Yes, I'm sure</Button>
                <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                </div>
            </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}

export default CommentSection

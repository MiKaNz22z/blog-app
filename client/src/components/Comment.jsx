import React, { useEffect, useState } from 'react'
import moment from 'moment';
import 'moment/locale/vi';
import { FaThumbsUp, FaReply, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { LuCrown } from "react-icons/lu";
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

function Comment({ comment, onLike, onEdit, onDelete, onReply, replies = [], depth = 0 }) {
    const [user, setUser] = useState({});
    const [parentUser, setParentUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { currentUser } = useSelector(state => state.user);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [replyContent, setReplyContent] = useState('');
    
    // Set locale to Vietnamese
    moment.locale('vi');
    
    useEffect(() =>{
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();
                if(res.ok) {
                    setUser(data)
                }
            } catch (err) {
                console.error(err.message);
            }
        } 
        getUser();
    }, [comment])

    useEffect(() => {
        const getParentUser = async () => {
            if (comment.parentId) {
                try {
                    const res = await fetch(`/api/comment/${comment.parentId}`);
                    const data = await res.json();
                    if (res.ok) {
                        const parentUserRes = await fetch(`/api/user/${data.userId}`);
                        const parentUserData = await parentUserRes.json();
                        if (parentUserRes.ok) {
                            setParentUser(parentUserData);
                        }
                    }
                } catch (err) {
                    console.error(err.message);
                }
            }
        }
        getParentUser();
    }, [comment.parentId])

    const hanldeEdit = () => {
      setIsEditing(true);
      setEditedContent(comment.content);
    }

    const handleSave = async () => {
      try {
        const res = await fetch(`/api/comment/editComment/${comment._id}`,{
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: editedContent })
        });
        if(res.ok) {
          setIsEditing(false);
          onEdit(comment, editedContent);
        }
      } catch(err){
        console.error(err.message);
      }
    }

    const handleReply = async () => {
      if (!replyContent.trim()) {
        return;
      }

      try {
        const res = await fetch('/api/comment/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: replyContent,
            postId: comment.postId,
            userId: currentUser._id,
            parentId: comment._id
          })
        });

        const data = await res.json();
        
        if(res.ok) {
          setIsReplying(false);
          setReplyContent('');
          if (onReply) {
            onReply(comment._id, data);
          }
        } else {
          console.error(data.message || 'Có lỗi xảy ra khi gửi trả lời');
        }
      } catch(err) {
        console.error('Lỗi khi gửi trả lời:', err.message);
      }
    }

    const toggleCollapse = () => {
      setIsCollapsed(!isCollapsed);
    }

    return (
      <div className='flex flex-col'>
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
          <div className="flex-shrink-0 mr-3">
            <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt={user.username} />
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-1">
                <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : 'anonymous user'}</span>
                {user.isAdmin && (
                    <LuCrown className="text-yellow-500 inline-block" />
                )}
                <span className='text-gray-500 text-xs ml-1'>
                    {moment(comment.createdAt).fromNow()}
                </span>
                {parentUser && (
                  <span className='text-gray-500 text-xs ml-1'>
                    · Trả lời <span className='font-medium'>@{parentUser.username}</span>
                  </span>
                )}
            </div>
            {
              isEditing ? (
                <>
                  <Textarea
                    className='mb-2'
                    rows='3'
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 text-sm">
                    <Button type='button' size='sm' gradientDuoTone='pinkToOrange' onClick={handleSave}>Lưu</Button>
                    <Button type='button' size='sm' gradientDuoTone='pinkToOrange' outline onClick={() => setIsEditing(false)}>Hủy</Button>
                  </div>
                </>
              ) : (
                <>
                  <p className='text-gray-500 pb-2'>{comment.content}</p>
                  <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                    <button type='button' onClick={() => onLike(comment._id)} className={`text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'}`}>
                      <FaThumbsUp className='text-sm'/>
                    </button>
                    <p className='text-gray-500'>
                      {
                        comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "like" : "likes")
                      }
                    </p>
                    {currentUser && (
                      <button
                        type='button'
                        onClick={() => setIsReplying(true)}
                        className='text-gray-400 hover:text-blue-500 flex items-center gap-1'
                      >
                        <FaReply className='text-sm'/>
                        Trả lời
                      </button>
                    )}
                    {
                      currentUser && (comment.userId === currentUser._id || currentUser.isAdmin) && (
                        <>
                          <button
                            type='button'
                            onClick={hanldeEdit}
                            className='text-gray-400 hover:text-blue-500'
                          >
                            Sửa
                          </button>
                          <button
                            type='button'
                            onClick={() => onDelete(comment._id)}
                            className='text-gray-400 hover:text-red-500'
                          >
                            Xóa
                          </button>
                        </>
                      )
                    }
                    {replies.length > 0 && (
                      <button
                        type='button'
                        onClick={toggleCollapse}
                        className='text-gray-400 hover:text-blue-500 flex items-center gap-1'
                      >
                        {isCollapsed ? (
                          <>
                            <FaChevronDown className='text-sm'/>
                            <span>Hiện {replies.length} trả lời</span>
                          </>
                        ) : (
                          <>
                            <FaChevronUp className='text-sm'/>
                            <span>Ẩn trả lời</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </>
              )
            }
            
            {isReplying && (
              <div className='mt-2'>
                <Textarea
                  className='mb-2'
                  rows='3'
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder='Viết bình luận của bạn...'
                />
                <div className="flex justify-end gap-2 text-sm">
                  <Button type='button' size='sm' gradientDuoTone='pinkToOrange' onClick={handleReply}>Gửi</Button>
                  <Button type='button' size='sm' gradientDuoTone='pinkToOrange' outline onClick={() => setIsReplying(false)}>Hủy</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {!isCollapsed && replies.length > 0 && (
          <div className={`${depth < 2 ? 'ml-12 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''}`}>
            {replies.map((reply) => (
              <Comment
                key={reply._id}
                comment={reply}
                onLike={onLike}
                onEdit={onEdit}
                onDelete={onDelete}
                onReply={onReply}
                replies={reply.replies || []}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
}

export default Comment

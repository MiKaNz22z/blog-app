import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";

import { HiOutlineExclamationCircle } from 'react-icons/hi'

function DashProfile() {
  const { currentUser, error, loading } = useSelector(state => state.user);
  const [ imageFile, setImageFile ] = useState(null); 
  const [ imageFileUrl, setImageFileUrl ] = useState(null);
  const [ imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
  const [ imageFileUploadError, setImageFileUploadError] = useState(null);
  const [ imageFileUploading, setImageFileUploading ] = useState(false);
  const [ updateUserSuccess, setUpadateUserSuccess ] = useState(null);
  const [ updateUserError, setUpadateUserError ] = useState(null);
  const [ showModal, setShowModal ] = useState(false);
  const [ formData, setFormData ] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB
        setImageFileUploadError('Dung lượng ảnh tối đa là 4MB');
        setImageFile(null);
        setImageFileUrl(null);
        return;
      }
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  useEffect(() => {
    if(imageFile) {
      uploadImage();
    }
  }, [imageFile])

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if 
    //       request.resource.size < 2 * 1024 * 1024 && 
    //       request.resource.contentType.matches('image/.*');
    //     }
    //   }
    // }
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = new getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },

      (error) => {
        setImageFileUploadError('Could not upload image (File must be less than 2MB)');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL })
          setImageFileUploading(false);
        })
      }
    )
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(Object.keys(formData).length === 0) {
      setUpadateUserError('No changes made')
      return;
    }
    if(imageFileUploading) {
      setUpadateUserError('Please wait for image to upload')
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if(!res.ok) {
        dispatch(updateFailure(data.message));
        setUpadateUserError(data.message)
      } else {
        dispatch(updateSuccess(data));
        setUpadateUserSuccess("User's profile updated successfully");
      }
    } catch(error) {
      dispatch(updateFailure(error.message))
      setImageFileUploadError(error.message)
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: "DELETE",
      });

      const data = await res.json();
      if(!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data))
      }
    } catch(error) {
      dispatch(deleteUserFailure(error.message))
    }
  }
  
  const handleSignout = async () => {
    try {
      const res = await fetch('api/user/signout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
      })
      const data = await res.json();
      if(!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch(error) {
      console.log(error.message);
    }
  }

  return (
    <div className="max-w-6xl w-4/5 mx-auto p-6 mt-[60px] bg-white rounded-lg shadow flex flex-col md:flex-row gap-8">
      {/* Left: Avatar & Change Password */}
      <div className="md:w-1/3 flex flex-col items-center gap-6 border-b md:border-b-0 md:border-r pb-8 md:pb-0 md:pr-[40px] border-gray-200">
        <div className="relative w-[200px] h-[200px] aspect-square cursor-pointer shadow-md overflow-hidden rounded-full bg-gray-200">
          <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}
            onClick={() => filePickerRef.current.click()}
          />
          {imageFileUploadProgress && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: { width: '100%', height: '100%' },
                  path: { stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})` },
                }}
              />
            </div>
          )}
        </div>
        <Button type="button" outline gradientDuoTone="pinkToOrange" onClick={() => filePickerRef.current.click()} className="w-full">Chọn ảnh</Button>
        {imageFileUploadError && <Alert color='failure' className="w-full">{imageFileUploadError}</Alert>}
        {/* Change Password */}
        <div className="w-full flex flex-col gap-2 mt-4">
          <label className="font-semibold">Old Password</label>
          <TextInput type="password" id="oldPassword" placeholder="********" onChange={handleChange} />
          <label className="font-semibold">New Password</label>
          <TextInput type="password" id="password" placeholder="********" onChange={handleChange} />
        </div>
      </div>
      {/* Right: Profile Info */}
      <form onSubmit={handleSubmit} className="md:w-2/3 flex flex-col gap-6">
        <h1 className="text-3xl font-semibold mb-2">Thông tin tài khoản</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="font-semibold">Tên người dùng</label>
              <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} onChange={handleChange}/>
            </div>
            <div className="flex-1">
              <label className="font-semibold">Email</label>
              <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleChange}/>
            </div>
          </div>
        </div>
        <Button type='submit' gradientDuoTone="pinkToOrange" outline disabled={loading || imageFileUploading}>{loading ? 'Đang tải...' : 'Cập nhật'}</Button>
        {(currentUser.isAdmin || currentUser.isAuthor) && (
          <Link to={'/create-post'}>
            <Button type='button' gradientDuoTone='pinkToOrange' className='w-full'>Tạo bài viết</Button>
          </Link>
        )}
        {updateUserSuccess && <Alert color='success'>{updateUserSuccess}</Alert>}
        {updateUserError && <Alert color='failure'>{updateUserError}</Alert>}
        {error && <Alert color='failure'>{error}</Alert>}
        <div className="flex justify-between mt-4 text-red-500">
          <span onClick={() => setShowModal(true)} className='cursor-pointer'>Xóa tài khoản</span>
          <span onClick={handleSignout} className='cursor-pointer'>Đăng xuất</span>
        </div>
      </form>
      {/* Modal giữ nguyên */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Bạn có chắc muốn xóa tài khoản này  ?</h3>
            <div className="flex justify-between gap-4">
              <Button color='failure' onClick={handleDeleteUser}>Có, tôi chắc</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>Không, hủy</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashProfile

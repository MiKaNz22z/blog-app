import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function DashProfile() {
  const { currentUser } = useSelector(state => state.user);
  const [ imageFile, setImageFile ] = useState(null); 
  const [ imageFileUrl, setImageFileUrl ] = useState(null);
  const [ imageFileUploadProgress, setImageFileUploadProgress] = useState(0);
  const [ imageFileUploadError, setImageFileUploadError] = useState(null);
  const filePickerRef = useRef();
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file))
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL)
        })
      }
    )
  } 
  
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
        <div
          className="relative w-32 h-32 min-w-32 min-h-32 aspect-square self-center cursor-pointer shadow-md overflow-hidden rounded-full bg-gray-200"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              'opacity-60'
            }`}
          />
          
          {imageFileUploadProgress && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: '100%', // Đảm bảo thanh tiến trình không chiếm toàn bộ khung hình
                    height: '100%',
                  },
                  path: {
                    stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                  },
                }}
              />
            </div>
          )}
        </div>


        { 
          imageFileUploadError && <Alert color='failure'>
            {imageFileUploadError}
          </Alert>
        }

        <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username}/>
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email}/>
        <TextInput type='password' id='password' placeholder='Password'/>

        <Button type='submit' gradientDuoTone="pinkToOrange" outline>Update</Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign out</span>
      </div>
    </div>

  )
}

export default DashProfile

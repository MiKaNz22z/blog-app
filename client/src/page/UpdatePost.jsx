import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({})
  const [publlishError, setPublishError] = useState(null);
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const nagivate = useNavigate();

  useEffect(() => {
    try {
        const fetchPost = async() => {
            const res = await fetch(`/api/post/getposts?postId=${postId}`);
            const data = await res.json();
            if(!res.ok) {
                console.log(data.message);
                setPublishError(data.message);
                return;
            }
            if(res.ok) {
                setPublishError(null);
                setFormData(data.posts[0]);
            }
        }
        fetchPost();
    } catch (error) {
        console.log(error.message);
    }
  }, [postId])
  
  const handleUploadImage = () => {
    try {
      if(!file) {
        setImageUploadError("Please select an image.");
        return;
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Could not upload image (File must be less than 2MB)");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({...formData, image: downloadURL})  
          })
        }
      );
    } 
    catch (error) {
      setImageUploadError("Could not upload image");
      setImageUploadProgress(null);
      console.log(error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    
    try {
        const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      if(!res.ok) {
        setPublishError(data.message);
        return;
      }
      if(res.ok) {
        setPublishError(null);
        nagivate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong. Please try again later");
    }
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput 
              type="text" 
              placeholder="Title" 
              required id="title" 
              className="flex-1" 
              onChange={(e) => {
                setFormData({...formData, title: e.target.value})
              }}
              value={formData.title}
            />
            <Select  
              onChange={(e) => {
                setFormData({...formData, category: e.target.value})
              }}
              value={formData.category}
            >
                <option value='uncategorized'>Select a category</option>
                <option value='javascript'>Javascript</option>
                <option value='nextJS'>NextJS</option>
                <option value='reactJS'>ReactJS</option>
                <option value='doisong'>Đời sống</option>
                <option value='xahoi'>Xã hội</option>
            </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            <FileInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
            <Button type='button' gradientDuoTone='pinkToOrange' size='sm' outline onClick={handleUploadImage} disabled = {imageUploadProgress}>
              {
                imageUploadProgress ? (
                <div className="w-16 h-1/6">
                  <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress}%`} />
                </div>) : 'Upload Image'
              }
            </Button>
        </div>
        { imageUploadError && <Alert color='failure'>{imageUploadError}</Alert> }
        {formData.image && 
            <img src={formData.image} alt="upload" className="w-full h-72 object-cover"/>
        }
        <ReactQuill 
          required
          value={formData.content}
          theme="snow" 
          placeholder="Write something..." 
          className="h-72 mb-12" 
          onChange={(value) => setFormData({...formData, content: value})}
        />
        <Button type='submit' gradientDuoTone='pinkToOrange'>Update post</Button>
        {publlishError && <Alert className="mt-5" color='failure'>{publlishError}</Alert>}
      </form>
    </div>
  )
}

export default UpdatePost;

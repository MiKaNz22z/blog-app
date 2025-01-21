import { Select, TextInput, Button } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import CardSearch from '../components/CardSearch';

function Search() {
    const [ sidebarData, setsidebarData ] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized',
    })

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    console.log(sidebarData);
    

    useEffect(()=> {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');
        if(searchTermFromUrl || sortFromUrl || categoryFromUrl) {
            setsidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl,
                category: categoryFromUrl,
            })
        } 

        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/post/getposts?${searchQuery}`);
            if(!res.ok){
                setLoading(false);
                return;
            }
            if(res.ok){
                const data = await res.json();
                setPosts(data.posts);
                setLoading(false);
                if (data.posts.length === 9){
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            }
        } 
        fetchPosts();
    },[location.search])

    const handleChannge = (e) => {
        if(e.target.id === 'searchTerm') {
            setsidebarData({...sidebarData, searchTerm: e.target.value});
        }
        if(e.target.id ==='sort') {
            const order = e.target.value || 'desc';
            setsidebarData({...sidebarData, sort: order});
        }
        if(e.target.id === 'category') {
            const category = e.target.value || 'uncategorized';
            setsidebarData({...sidebarData, category});
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }

    const handleShow = async () => {
        const numberOfPosts = posts.length;
        const srartIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('srartIndex', srartIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if(!res.ok){
            return;
        }
        if(res.ok){
            const data = await res.json();
            setPosts([...posts,...data.posts]);
            if (data.posts.length === 9) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        }
    }
  return (
    <div className='flex flex-col md:flex-row'>
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
                <label>Search Term</label>
                <TextInput placeholder='Search...' id='searchTerm' type='text'
                    value={sidebarData.searchTerm}
                    onChange={handleChannge}
                />
            </div>
            <div className="flex items-center gap-2">
                <label className='whitespace-nowrap font-semibold'>
                    Sort:
                </label>
                <Select onChange={handleChannge} value={sidebarData.sort} id='sort'>
                    <option value='desc'>Lastest</option>
                    <option value='asc'>Oldest</option>
                </Select>
            </div>

            <div className="flex items-center gap-2">
                <label className='whitespace-nowrap font-semibold'>
                    Category:
                </label>
                <Select onChange={handleChannge} value={sidebarData.category} id='category'>
                    <option value='uncategorized'>Uncategorized</option>
                    <option value='game'>Game</option>
                    <option value='congnghe'>Công nghệ</option>
                    <option value='suckhoe'>Sức khỏe</option>
                    <option value='doisong'>Đời sống</option>
                    <option value='xahoi'>Xã hội</option>
                    <option value='thethao'>Thể thao</option>
                </Select>
            </div>
            <Button type='submit' outline gradientDuoTone='pinkToOrange'>
                Apply Filters
            </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Post results:</h1>
        <div className="p-7 flex flex-wrap gap-4">
            {
                !loading && posts.length === 0 && <p className='text-xl text-gray-500'>No posts found.</p>
            }
            {
                loading && <p className='text-xl text-gray-500'>Loading...</p>
            }
            {
                !loading && posts && posts.map((post)=>(
                    <CardSearch key={post._id} post={post} />
                ))
            }
            {
                showMore && <button onClick={handleShow} className='text-teal-500 text-lg hover:underline p-7 w-full'>Show more...</button>
            }                       
        </div>
      </div>
    </div>
  )
}

export default Search

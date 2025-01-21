import React from 'react';
import { Link } from 'react-router-dom';

function CategoryList({ posts }) {
    // Lấy tất cả các categories từ posts
    const allCategories = posts.map(post => post.category);

    // Loại bỏ các categories trùng lặp bằng Set
    const uniqueCategories = [...new Set(allCategories)];

    // Nếu có bài viết không có category, thêm 'uncategorized' vào danh sách
    if (uniqueCategories.includes(undefined)) {
        uniqueCategories.push('uncategorized');
    }

    return (
        <div className="flex flex-col gap-3">
            {uniqueCategories.map((category, index) => (
                <Link
                    key={index}
                    to={`/category?category=${category}`}
                    className='text-md text-blue-700 hover:text-gray-700'
                >
                    {category || 'Uncategorized'}
                </Link>
            ))}
        </div>
    );
}

export default CategoryList;
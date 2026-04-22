import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Blog = () => {
  const [blogs, setBlogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const API_BASE_URL =
    import.meta.env.VITE_React_BASE_API_URL || "http://localhost:8000";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/all`);
      const data = await response.json();
      setBlogs(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 animate-fade-in font-sans">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-normal mb-4 font-serif text-gray-900">
          Blog
        </h1>
        <div className="text-gray-500 text-sm breadcrumbs">
          <Link to="/" className="hover:text-gray-800">
            Home
          </Link>
          <span className="mx-2">›</span>
          <span>Blog</span>
        </div>
      </div>

      {/* Blog Grid */}
      {loading ? (
        <div className="flex justify-center py-20">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {blogs.map((post) => (
            <Link
              key={post._id}
              to={`/blog/${post._id}`}
              className="flex flex-col group cursor-pointer"
            >
              <div className="overflow-hidden mb-4 rounded-sm">
                <img
                  src={
                    post.images && post.images.length > 0
                      ? post.images[0]
                      : "https://via.placeholder.com/540x600?text=No+Image"
                  }
                  alt={post.title}
                  className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/540x600?text=Uptownie+Blog";
                  }}
                />
              </div>
              <div className="space-y-2">
                <div className="flex flex-col space-y-1">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-gray-800">
                    {post.author || "ADMIN"}
                  </span>
                  <span className="text-[10px] tracking-widest uppercase text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="text-base font-medium leading-snug text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {post.summary}
                </p>
                <div className="pt-2">
                  <span className="text-sm text-gray-800 border-b border-gray-800 pb-px hover:text-purple-600 hover:border-purple-600 transition-all">
                    Read more
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
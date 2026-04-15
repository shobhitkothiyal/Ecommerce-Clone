import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaFacebookF,
  FaPinterestP,
  FaTwitter,
  FaWhatsapp,
  FaArrowLeft,
} from "react-icons/fa";

const BlogDetails = () => {
  const { id } = useParams();

  const [blog, setBlog] = React.useState(null);
  const [relatedArticles, setRelatedArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const API_BASE_URL =
    import.meta.env.VITE_React_BASE_API_URL || "http://localhost:5000";

  /* State for selected image gallery */
  const [selectedImage, setSelectedImage] = React.useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogDetails();
    fetchRelatedArticles();
  }, [id]);

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`);
      if (!response.ok) throw new Error("Blog not found");
      const data = await response.json();
      setBlog(data);
      // Initialize selected image with the first image
      if (data.images && data.images.length > 0) {
        setSelectedImage(data.images[0]);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      // Fetch all blogs and take first 3 excluding current
      // Ideally backend should have a 'related' endpoint
      const response = await fetch(`${API_BASE_URL}/api/blogs/all?limit=4`);
      const data = await response.json();
      const related = (data.data || []).filter((b) => b._id !== id).slice(0, 3);
      setRelatedArticles(related);
    } catch (e) {
      console.error("Error fetching related:", e);
    }
  };

  if (loading)
    return <div className="flex justify-center py-20">Loading...</div>;
  if (!blog)
    return <div className="flex justify-center py-20">Blog not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 animate-fade-in font-sans">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm breadcrumbs text-center mb-4 uppercase tracking-wider">
        <Link to="/" className="hover:text-gray-900">
          Home
        </Link>
        <span className="mx-2">{` > `}</span>
        <Link to="/blog" className="hover:text-gray-900">
          Blog
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-xs font-bold tracking-widest uppercase text-gray-800 mb-4">
          BLOG
        </p>
        <h1 className="text-3xl md:text-5xl font-normal mb-4 font-serif text-gray-900 leading-tight">
          {blog.title}
        </h1>
        <p className="text-gray-500 text-sm uppercase tracking-wide">
          by <span className="text-gray-800 font-medium">{blog.author}</span> on{" "}
          {new Date(blog.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Content */}
      <div className="space-y-12 max-w-7xl mx-auto mb-16">
        {/* Main Image */}
        {selectedImage && (
          <div className="w-full h-auto mb-4 rounded-lg overflow-hidden">
            <img
              src={selectedImage}
              alt={blog.title}
              className="w-full object-cover max-h-[600px] transition-all duration-300"
            />
          </div>
        )}

        {/* Image Thumbnails Gallery */}
        {blog.images && blog.images.length > 1 && (
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {blog.images.map((img, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`min-w-[100px] w-[100px] h-[100px] rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedImage === img
                    ? "border-indigo-600 opacity-100 scale-105"
                    : "border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="text-gray-800 leading-relaxed text-base md:text-lg mb-8 whitespace-pre-wrap">
          {blog.content}
        </div>

        {/* Social Share */}
        <div className="flex items-center justify-end space-x-6 py-8 border-b border-gray-200">
          <span className="text-sm font-bold text-gray-900">Share:</span>
          <FaFacebookF className="text-gray-500 hover:text-blue-600 cursor-pointer text-lg" />
          <FaPinterestP className="text-gray-500 hover:text-red-600 cursor-pointer text-lg" />
          <FaTwitter className="text-gray-500 hover:text-blue-400 cursor-pointer text-lg" />
          <FaWhatsapp className="text-gray-500 hover:text-green-500 cursor-pointer text-lg" />
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto mb-16 ">
        <Link
          to="/blog"
          className="flex items-center text-gray-600 hover:text-black group"
        >
          <FaArrowLeft className="mr-2 text-sm transition-transform group-hover:-translate-x-1" />
          <div className="text-left">
            <span className="block text-xs uppercase tracking-widest text-gray-400 mb-1">
              BACK TO BLOGS
            </span>
          </div>
        </Link>
      </div>

      {/* Related Articles */}
      <div className="text-center mb-12 border-t border-gray-100 pt-12">
        <h2 className="text-2xl font-normal font-serif text-gray-900 mb-12">
          Related Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {relatedArticles.map((article) => (
            <div
              key={article._id}
              className="flex flex-col group cursor-pointer"
            >
              <Link to={`/blog/${article._id}`}>
                <div className="overflow-hidden mb-4 rounded-sm">
                  <img
                    src={
                      article.images && article.images.length > 0
                        ? article.images[0]
                        : "https://via.placeholder.com/540x600?text=No+Image"
                    }
                    alt={article.title}
                    className="w-full h-48 object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-col space-y-1">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-800">
                      {article.author || "BLOG"}
                    </span>
                    <span className="text-[10px] tracking-widest uppercase text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium leading-snug text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="pt-2">
                    <span className="text-xs text-gray-800 border-b border-gray-800 pb-px hover:text-purple-600 hover:border-purple-600 transition-all">
                      Read more
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
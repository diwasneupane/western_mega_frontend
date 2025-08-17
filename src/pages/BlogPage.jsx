import React from 'react'
import { Calendar, Clock, Tag, Eye, ArrowRight, MessageCircle, Heart, Share } from 'lucide-react'
import { motion } from 'framer-motion'
function BlogPage() {
    const blogPosts = [
        {
            id: 1,
            title: 'New Online Learning Platform Launched',
            excerpt: 'We\'re excited to announce our new interactive online learning platform with enhanced features for better student engagement and seamless course delivery.',
            category: 'News',
            date: '2024-12-15',
            readTime: '3 min read',
            views: 245,
            likes: 18,
            comments: 5,
            featured: true
        },
        {
            id: 2,
            title: 'Students Win National Coding Competition',
            excerpt: 'Our computer science students secured first place in the National Programming Contest, bringing pride to our institution with their exceptional skills.',
            category: 'Achievement',
            date: '2024-12-10',
            readTime: '5 min read',
            views: 189,
            likes: 32,
            comments: 12,
            featured: false
        },
        {
            id: 3,
            title: 'Annual Tech Fest 2024 Announced',
            excerpt: 'Join us for our biggest tech event of the year featuring workshops, competitions, and guest speakers from industry leaders and tech innovators.',
            category: 'Event',
            date: '2024-12-20',
            readTime: '2 min read',
            views: 156,
            likes: 24,
            comments: 8,
            featured: false
        },
        {
            id: 4,
            title: 'New Scholarship Program for Merit Students',
            excerpt: 'Announcing our new merit-based scholarship program designed to support exceptional students in pursuing their academic dreams without financial barriers.',
            category: 'Announcement',
            date: '2024-12-05',
            readTime: '4 min read',
            views: 298,
            likes: 45,
            comments: 15,
            featured: false
        },
        {
            id: 5,
            title: 'Industry Partnership with Tech Giants',
            excerpt: 'Western Mega College partners with leading technology companies to provide students with real-world experience and internship opportunities.',
            category: 'Partnership',
            date: '2024-11-28',
            readTime: '6 min read',
            views: 321,
            likes: 67,
            comments: 23,
            featured: false
        }
    ]

    const categories = [
        { name: 'All', color: 'bg-blue-600', count: blogPosts.length },
        { name: 'News', color: 'bg-blue-500', count: blogPosts.filter(post => post.category === 'News').length },
        { name: 'Achievement', color: 'bg-green-500', count: blogPosts.filter(post => post.category === 'Achievement').length },
        { name: 'Event', color: 'bg-purple-500', count: blogPosts.filter(post => post.category === 'Event').length },
        { name: 'Announcement', color: 'bg-orange-500', count: blogPosts.filter(post => post.category === 'Announcement').length }
    ]

    const getCategoryColor = (category) => {
        const colors = {
            'News': 'bg-blue-100 text-blue-700',
            'Achievement': 'bg-green-100 text-green-700',
            'Event': 'bg-purple-100 text-purple-700',
            'Announcement': 'bg-orange-100 text-orange-700',
            'Partnership': 'bg-indigo-100 text-indigo-700'
        }
        return colors[category] || 'bg-gray-100 text-gray-700'
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="px-4 py-6 bg-gradient-to-r from-blue-600 to-green-500 text-white">
                <motion.div
                    className="max-w-md mx-auto"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl font-bold mb-2">News & Updates</h1>
                    <p className="opacity-90">Stay updated with the latest happenings</p>
                </motion.div>
            </section>

            {/* Featured Post */}
            {blogPosts.filter(post => post.featured).map(post => (
                <section key={post.id} className="px-4 py-6 bg-white border-b border-gray-100">
                    <motion.div
                        className="max-w-md mx-auto"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-3">
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                                🔥 Featured
                            </span>
                        </div>

                        {/* Featured Image Placeholder */}
                        <div className="h-48 bg-gradient-to-br from-blue-100 via-green-100 to-blue-50 rounded-2xl mb-4 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <MessageCircle className="w-16 h-16 mx-auto mb-2" />
                                <span className="text-lg font-medium">Featured Story</span>
                                <div className="text-sm mt-1 opacity-75">600x300</div>
                            </div>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="cursor-pointer"
                        >
                            <div className="flex items-center space-x-2 mb-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                                    {post.category}
                                </span>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{formatDate(post.date)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <Eye className="w-4 h-4" />
                                        <span>{post.views}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Heart className="w-4 h-4" />
                                        <span>{post.likes}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>{post.comments}</span>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <span>Read More</span>
                                    <ArrowRight className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>
            ))}

            {/* Category Filter */}
            <section className="px-4 py-4 bg-white border-b border-gray-100">
                <div className="max-w-md mx-auto">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {categories.map((category, index) => (
                            <motion.button
                                key={category.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${index === 0
                                    ? `${category.color} text-white`
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {category.name} ({category.count})
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Posts List */}
            <section className="px-4 py-6">
                <motion.div
                    className="max-w-md mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="space-y-4">
                        {blogPosts.filter(post => !post.featured).map((post, index) => (
                            <motion.article
                                key={post.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Post Image Placeholder */}
                                <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                                    <div className="text-center text-gray-400">
                                        <MessageCircle className="w-8 h-8 mx-auto mb-1" />
                                        <span className="text-sm">Article Image</span>
                                        <div className="text-xs mt-1 opacity-75">400x200</div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    {/* Post Meta */}
                                    <div className="flex items-center space-x-2 mb-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                                            {post.category}
                                        </span>
                                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(post.date)}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{post.readTime}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <h3 className="font-bold text-gray-900 mb-2 leading-tight">{post.title}</h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

                                    {/* Post Actions */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Eye className="w-3 h-3" />
                                                <span>{post.views}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Heart className="w-3 h-3" />
                                                <span>{post.likes}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <MessageCircle className="w-3 h-3" />
                                                <span>{post.comments}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-1 rounded-lg hover:bg-gray-100"
                                            >
                                                <Share className="w-4 h-4 text-gray-400" />
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
                                            >
                                                <span>Read</span>
                                                <ArrowRight className="w-3 h-3" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    {/* Load More Button */}
                    <motion.div
                        className="text-center mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white border border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all"
                        >
                            Load More Articles
                        </motion.button>
                    </motion.div>
                </motion.div>
            </section>
        </div>
    )
}

export default BlogPage
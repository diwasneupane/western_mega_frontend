import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Lightbulb, Users, Target, Award, Globe } from 'lucide-react'

function AboutPage() {
    const stats = [
        { number: '500+', label: 'Students', color: 'blue' },
        { number: '50+', label: 'Courses', color: 'purple' },
        { number: '25+', label: 'Faculty', color: 'green' },
        { number: '95%', label: 'Success Rate', color: 'orange' }
    ]

    const values = [
        {
            icon: Lightbulb,
            title: 'Innovation',
            description: 'Embracing cutting-edge technology and modern teaching methodologies to prepare students for tomorrow.',
            color: 'blue'
        },
        {
            icon: Heart,
            title: 'Excellence',
            description: 'Commitment to the highest standards of education and student success through dedicated support.',
            color: 'purple'
        },
        {
            icon: Users,
            title: 'Community',
            description: 'Building a supportive environment where everyone can thrive and reach their full potential.',
            color: 'green'
        },
        {
            icon: Target,
            title: 'Purpose',
            description: 'Focused on empowering students with knowledge and skills for meaningful career growth.',
            color: 'orange'
        }
    ]

    const achievements = [
        {
            icon: Award,
            title: 'Accredited Institution',
            description: 'Recognized by national education boards'
        },
        {
            icon: Globe,
            title: 'Global Recognition',
            description: 'Partnerships with international universities'
        },
        {
            icon: Users,
            title: 'Alumni Network',
            description: '5000+ successful graduates worldwide'
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <motion.div
                    className="max-w-md mx-auto text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants}>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            About <span className="text-blue-600">Western Mega College</span>
                        </h1>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Established with a vision to provide world-class education, we are committed to nurturing future leaders and innovators through excellence in teaching and learning.
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="px-4 py-8 bg-white">
                <motion.div
                    className="max-w-md mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h2
                        className="text-2xl font-bold text-center text-gray-900 mb-8"
                        variants={itemVariants}
                    >
                        Our Impact in Numbers
                    </motion.h2>

                    <div className="grid grid-cols-2 gap-4">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center p-6 bg-gray-50 rounded-2xl"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className={`text-3xl font-bold mb-2 text-${stat.color}-600`}>
                                    {stat.number}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Mission Section */}
            <section className="px-4 py-12 bg-gradient-to-r from-blue-50 to-purple-50">
                <motion.div
                    className="max-w-md mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="bg-white rounded-3xl p-8 shadow-lg"
                        variants={itemVariants}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Our Mission</h2>
                        <p className="text-gray-600 text-center leading-relaxed mb-6">
                            "To empower students with knowledge, skills, and values that enable them to excel in their chosen fields and contribute meaningfully to society."
                        </p>

                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Our Vision</h3>
                            <p className="text-sm text-gray-700">
                                To be a leading educational institution recognized for academic excellence, innovation in teaching, and producing graduates who make a positive impact in the world.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Values Section */}
            <section className="px-4 py-12 bg-white">
                <motion.div
                    className="max-w-md mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h2
                        className="text-2xl font-bold text-center text-gray-900 mb-8"
                        variants={itemVariants}
                    >
                        Our Core Values
                    </motion.h2>

                    <div className="space-y-4">
                        {values.map((value, index) => {
                            const Icon = value.icon
                            return (
                                <motion.div
                                    key={index}
                                    className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02, shadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className={`w-12 h-12 bg-${value.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                                            <Icon className={`w-6 h-6 text-${value.color}-600`} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>
            </section>

            {/* Achievements Section */}
            <section className="px-4 py-12 bg-gray-50">
                <motion.div
                    className="max-w-md mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h2
                        className="text-2xl font-bold text-center text-gray-900 mb-8"
                        variants={itemVariants}
                    >
                        Our Achievements
                    </motion.h2>

                    <div className="space-y-4">
                        {achievements.map((achievement, index) => {
                            const Icon = achievement.icon
                            return (
                                <motion.div
                                    key={index}
                                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                                            <p className="text-sm text-gray-600">{achievement.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>
            </section>

            {/* Contact Section */}
            <section className="px-4 py-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <motion.div
                    className="max-w-md mx-auto text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h2
                        className="text-2xl font-bold mb-4"
                        variants={itemVariants}
                    >
                        Join Our Community
                    </motion.h2>
                    <motion.p
                        className="mb-8 opacity-90"
                        variants={itemVariants}
                    >
                        Ready to start your educational journey with us? Get in touch and discover what Western Mega College can offer you.
                    </motion.p>
                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold shadow-lg"
                    >
                        Contact Us
                    </motion.button>
                </motion.div>
            </section>
        </div>
    )
}

export default AboutPage

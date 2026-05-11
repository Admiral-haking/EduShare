'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Howl } from 'howler';

// صداها
const clickSound = new Howl({ src: ['/assets/audio/click.mp3'] });
const hoverSound = new Howl({ src: ['/assets/audio/hover.mp3'] });

const ParticleCanvas = () => {
    const canvasRef = useRef(null);
    const mouse = useRef({ x: 0, y: 0 });
    const [theme, setTheme] = useState('dark'); // مدیریت تم

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        const handleMouseMove = (e) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        // افکت اسکرول برای تغییر سرعت پارتیکل‌ها
        const handleScroll = () => {
            const scrollY = window.scrollY;
            particles.forEach((particle) => {
                particle.speedY += scrollY * 0.0001; // تغییر سرعت با اسکرول
            });
        };
        window.addEventListener('scroll', handleScroll);

        let hue = 0;
        const gradientBackground = () => {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            if (theme === 'dark') {
                gradient.addColorStop(0, `hsl(${hue}, 50%, 10%)`);
                gradient.addColorStop(1, `hsl(${hue + 60}, 50%, 20%)`);
            } else {
                gradient.addColorStop(0, `hsl(${hue}, 50%, 80%)`);
                gradient.addColorStop(1, `hsl(${hue + 60}, 50%, 90%)`);
            }
            hue = (hue + 0.5) % 360;
            return gradient;
        };

        class Particle {
            constructor(x, y, speedX, speedY, color, size) {
                this.x = x;
                this.y = y;
                this.speedX = speedX;
                this.speedY = speedY;
                this.color = color;
                this.size = size;
                this.baseSize = size;
                this.hue = Math.random() * 360; // برای تغییر رنگ
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                const dx = this.x - mouse.current.x;
                const dy = this.y - mouse.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    this.speedX += dx / 100;
                    this.speedY += dy / 100;
                }

                this.size = this.baseSize + Math.sin(Date.now() * 0.005 + this.x) * 2;
                this.hue = (this.hue + 1) % 360; // تغییر رنگ پویا
                this.color = `hsl(${this.hue}, 100%, 50%)`;

                if (this.x + this.size > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y + this.size > canvas.height || this.y < 0) this.speedY *= -1;
            }

            draw(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.closePath();
            }
        }

        const particles = [];
        for (let i = 0; i < 100; i++) {
            const size = Math.random() * 5 + 2;
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const speedX = Math.random() * 3 - 1.5;
            const speedY = Math.random() * 3 - 1.5;
            const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            particles.push(new Particle(x, y, speedX, speedY, color, size));
        }

        let animationFrameId;
        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = gradientBackground();
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach((particle) => {
                particle.update();
                particle.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <>
            <canvas ref={canvasRef} className="w-full h-full absolute top-0 left-0" />
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="fixed top-4 right-4 p-2 bg-gray-800 text-white rounded"
            >
                {theme === 'dark' ? 'روشن' : 'تاریک'}
            </button>
        </>
    );
};

const TeamPage = () => {
    const [isHovered, setIsHovered] = useState(false);

    const cardVariants = {
        hover: { scale: 1.05, rotateX: 10, rotateY: 10, transition: { duration: 0.3 } },
        initial: { scale: 1, rotateX: 0, rotateY: 0 },
    };

    const teamMembers = [
        {
            name: 'John Doe',
            role: 'Frontend Developer',
            img: '/assets/images/member1.jpg',
            description: 'متخصص رابط کاربری با تجربه بالا در React و TailwindCSS.',
            social: { github: 'https://github.com/johndoe', linkedin: 'https://linkedin.com/in/johndoe' },
        },
        {
            name: 'Jane Smith',
            role: 'Backend Developer',
            img: '/assets/images/member2.jpg',
            description: 'کارشناس بک‌اند با تمرکز بر Node.js و پایگاه داده‌ها.',
            social: { github: 'https://github.com/janesmith', linkedin: 'https://linkedin.com/in/janesmith' },
        },
        {
            name: 'Mark Taylor',
            role: 'Full Stack Developer',
            img: '/assets/images/member3.jpg',
            description: 'توسعه‌دهنده تمام‌عیار با مهارت در هر دو حوزه فرانت و بک.',
            social: { github: 'https://github.com/marktaylor', linkedin: 'https://linkedin.com/in/marktaylor' },
        },
    ];

    return (
        <div className="relative w-full min-h-screen overflow-x-hidden">
            <ParticleCanvas />
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center text-white">
                <motion.div
                    className="logo mb-6"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <img
                        src="/assets/images/avengers-logo.jpg"
                        alt="The Avengers Logo"
                        className={`w-48 mx-auto transition-transform duration-500 ${
                            isHovered ? 'scale-110' : 'scale-100'
                        }`}
                        onClick={() => clickSound.play()}
                    />
                </motion.div>
                <motion.h1
                    className="text-6xl font-bold mb-4 text-shadow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    Meet The Avengers
                </motion.h1>
                <motion.p
                    className="text-2xl mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    Our highly skilled development team that brings innovative solutions to life.
                </motion.p>
                <div className="team-members mt-8 flex flex-wrap justify-center gap-12">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={index}
                            className="member text-center w-60 relative"
                            variants={cardVariants}
                            initial="initial"
                            whileHover="hover"
                            onMouseEnter={() => {
                                setIsHovered(true);
                                hoverSound.play();
                            }}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <motion.img
                                src={member.img}
                                alt={member.name}
                                className="w-24 h-24 rounded-full mb-3 shadow-lg mx-auto"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3 }}
                            />
                            <h3 className="text-lg text-white">{member.name}</h3>
                            <p className="text-sm text-gray-300">{member.role}</p>
                            <p className="text-sm text-gray-400 mt-2">{member.description}</p>
                            <div className="social-links mt-4 flex justify-center gap-4">
                                <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/icons/github.png" alt="GitHub" className="w-6 h-6" />
                                </a>
                                <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                                    <img src="/assets/icons/linkedin.png" alt="LinkedIn" className="w-6 h-6" />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamPage;
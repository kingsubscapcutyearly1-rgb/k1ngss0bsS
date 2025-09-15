import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  views: number;
  image: string;
}

import { useState } from 'react';

const Blog: React.FC = () => {
  // Blog posts data (would be fetched from API in real app)
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'How to Save $3000+ Per Year on Software Subscriptions',
      excerpt: 'Discover the proven strategies that smart entrepreneurs use to cut their software costs by over 50% without losing functionality.',
      author: 'Ahmad Hassan',
      date: '2024-08-20',
      category: 'Cost Saving',
      readTime: '5 min read',
      views: 2847,
      image: '/assets/images/AI.jpg'
    },
    {
      id: '2',
      title: 'ChatGPT Plus vs Alternatives: Complete Comparison 2024',
      excerpt: 'An in-depth comparison of ChatGPT Plus with other AI writing tools. Which one offers the best value for money?',
      author: 'Sarah Khan',
      date: '2024-08-18',
      category: 'AI Tools',
      readTime: '8 min read',
      views: 1923,
      image: '/assets/images/AI.jpg'
    },
    {
      id: '3',
      title: 'Top 10 Design Tools Every Entrepreneur Needs in 2024',
      excerpt: 'From Canva Pro to Adobe Creative Suite - here are the essential design tools that will transform your business.',
      author: 'Mike Johnson',
      date: '2024-08-15',
      category: 'Design',
      readTime: '6 min read',
      views: 3451,
      image: '/assets/images/AI.jpg'
    },
    {
      id: '4',
      title: 'Is Buying Shared Accounts Legal? Everything You Need to Know',
      excerpt: 'Understanding the legal aspects of shared premium accounts and how to stay compliant while saving money.',
      author: 'Legal Team',
      date: '2024-08-12',
      category: 'Legal',
      readTime: '7 min read',
      views: 1654,
      image: '/assets/images/AI.jpg'
    },
    {
      id: '5',
      title: 'SEO Tools Comparison: Semrush vs Ahrefs vs Cheaper Alternatives',
      excerpt: 'Which SEO tool gives you the best bang for your buck? We compare the top players and their affordable alternatives.',
      author: 'SEO Expert',
      date: '2024-08-10',
      category: 'SEO',
      readTime: '10 min read',
      views: 2756,
      image: '/assets/images/AI.jpg'
    },
    {
      id: '6',
      title: 'Building a $10K/Month Business with Premium Tools at 50% OFF',
      excerpt: 'Case study: How one entrepreneur scaled their business using our premium tool subscriptions.',
      author: 'Success Stories',
      date: '2024-08-08',
      category: 'Success Story',
      readTime: '12 min read',
      views: 4892,
      image: '/assets/images/AI.jpg'
    }
  ];

  const categories = ['All', 'Cost Saving', 'AI Tools', 'Design', 'SEO', 'Legal', 'Success Story'];

  // State for filtering and pagination
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');

  // Filter posts by category
  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  // Pagination logic
  const totalPages = Math.ceil((filteredPosts.length - 1) / postsPerPage);
  const paginatedPosts = filteredPosts.slice(1 + (currentPage - 1) * postsPerPage, 1 + currentPage * postsPerPage);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Knowledge Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn how to save money, maximize productivity, and grow your business with the right tools and strategies.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <Badge 
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer hover:bg-primary hover:text-white transition-colors px-4 py-2 ${selectedCategory === category ? 'bg-primary text-white' : ''}`}
              onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
              tabIndex={0}
              aria-label={`Filter by ${category}`}
              role="button"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <Card className="mb-12 overflow-hidden animate-fade-in">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-video md:aspect-auto">
                <img 
                  src={filteredPosts[0].image} 
                  alt={`Featured: ${filteredPosts[0].title}`}
                  className="w-full h-full object-cover" loading="lazy"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <Badge className="mb-4 w-fit">{filteredPosts[0].category}</Badge>
                <h2 className="text-3xl font-bold mb-4">{filteredPosts[0].title}</h2>
                <p className="text-muted-foreground mb-6 text-lg">{filteredPosts[0].excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {filteredPosts[0].author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(filteredPosts[0].date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {filteredPosts[0].views.toLocaleString()} views
                  </div>
                </div>
                <Link to={`/blog/${filteredPosts[0].id}`} tabIndex={0} aria-label={`Read article: ${filteredPosts[0].title}`}>
                  <Button className="w-fit">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow animate-fade-in">
              <Link to={`/blog/${post.id}`} tabIndex={0} aria-label={`Read article: ${post.title}`}> 
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy"
                  />
                </div>
              </Link>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.views.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} aria-label="Previous page">Previous</Button>
            <span className="px-2">Page {currentPage} of {totalPages}</span>
            <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} aria-label="Next page">Next</Button>
          </div>
        )}

        {/* Newsletter Signup */}
        <Card className="mt-16 bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="text-center p-8">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get the latest money-saving tips, tool reviews, and exclusive deals delivered to your inbox.
            </p>
            <form
              className="flex flex-col md:flex-row gap-2 max-w-md mx-auto"
              onSubmit={e => {
                e.preventDefault();
                if (!newsletterEmail.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
                  setNewsletterStatus('Please enter a valid email address.');
                  return;
                }
                setNewsletterStatus('Subscribed!');
                setNewsletterEmail('');
              }}
              aria-label="Newsletter signup"
            >
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-2 rounded-md border bg-background focus:outline-primary"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                required
                aria-label="Email address"
              />
              <Button type="submit">Subscribe</Button>
            </form>
            {newsletterStatus && (
              <div className="mt-2 text-sm text-success">{newsletterStatus}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Blog;
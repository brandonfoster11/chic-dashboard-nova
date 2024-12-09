import { StyleCard } from "@/components/StyleCard";

const Blog = () => {
  const posts = [
    {
      title: "The Future of AI in Fashion",
      excerpt: "Discover how artificial intelligence is revolutionizing the way we dress and shop.",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050",
      date: "March 15, 2024",
      category: "Technology",
    },
    {
      title: "Spring Fashion Trends 2024",
      excerpt: "Stay ahead of the curve with our comprehensive guide to this season's must-have styles.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
      date: "March 10, 2024",
      category: "Trends",
    },
    {
      title: "Sustainable Fashion Guide",
      excerpt: "Learn how to build a sustainable wardrobe without compromising on style.",
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
      date: "March 5, 2024",
      category: "Sustainability",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 animate-fade-up">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Style Blog</h1>

          <div className="grid gap-8">
            {posts.map((post) => (
              <StyleCard
                key={post.title}
                title={post.title}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className="md:w-2/3 space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.category}</span>
                    </div>
                    <p className="text-muted-foreground">{post.excerpt}</p>
                    <button className="text-primary hover:underline">
                      Read more →
                    </button>
                  </div>
                </div>
              </StyleCard>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Blog;
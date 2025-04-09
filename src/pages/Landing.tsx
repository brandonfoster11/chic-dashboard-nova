import { useNavigate } from "react-router-dom";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { motion } from "framer-motion";

const Landing = () => {
  const navigate = useNavigate();

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const featureVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { duration: 0.5 } 
    },
    hover: { 
      y: -10,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-90 text-gray-dark-80">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div 
          className="flex flex-col-reverse lg:flex-row items-center gap-12 py-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="flex-1 space-y-8" variants={itemVariants}>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Your AI-Powered
              <span className="text-primary block">Personal Stylist</span>
            </h1>
            <p className="text-lg text-gray-dark-60 max-w-xl">
              Discover outfits tailored to your style, instantly. No stress. Just confidence.
            </p>
            <div className="space-x-4">
              <NeumorphicButton 
                size="lg" 
                variant="neumorphic"
                onClick={() => navigate("/register")}
                withMotion
              >
                Style Me for Free
              </NeumorphicButton>
              <NeumorphicButton 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/wardrobe")}
                withMotion
              >
                Explore Styles
              </NeumorphicButton>
            </div>
          </motion.div>
          <motion.div 
            className="flex-1"
            variants={itemVariants}
          >
            <motion.div
              className="rounded-lg overflow-hidden shadow-neumorphic-card"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Fashion AI"
                className="w-full max-w-lg mx-auto"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 py-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {[
            {
              icon: "🎯",
              title: "AI Recommendations",
              description: "Get outfit suggestions that match your mood, season, and upcoming events."
            },
            {
              icon: "🧥",
              title: "Virtual Wardrobe",
              description: "Upload, organize, and manage your clothing digitally for easy outfit planning."
            },
            {
              icon: "📈",
              title: "Style Analytics",
              description: "See how your style evolves with visual insights and wardrobe trends."
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              custom={index}
              whileHover="hover"
            >
              <NeumorphicCard
                className="text-center p-6"
                variant="elevated"
                hover="glow"
                padding="lg"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-dark-90">{feature.title}</h3>
                <p className="text-gray-dark-60">
                  {feature.description}
                </p>
              </NeumorphicCard>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="py-16 text-center rounded-lg mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <NeumorphicCard
            className="max-w-4xl mx-auto"
            variant="elevated"
            hover="glow"
            padding="lg"
            animate
          >
            <div className="space-y-8 py-4">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                Ready to Transform Your Style?
              </h2>
              <p className="text-xl text-gray-dark-70">
                Join thousands of fashion lovers already styling smarter with AI.
              </p>
              <div className="space-x-4">
                <NeumorphicButton 
                  size="lg" 
                  variant="neumorphic"
                  onClick={() => navigate("/register")}
                  withMotion
                >
                  Get Started Now
                </NeumorphicButton>
                <NeumorphicButton 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate("/tour")}
                  withMotion
                >
                  Take a Tour
                </NeumorphicButton>
              </div>
            </div>
          </NeumorphicCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;

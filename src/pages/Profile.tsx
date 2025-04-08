import { Input } from "@/components/ui/input";
import { Camera, Edit2, User } from "lucide-react";
import { NeumorphicStyleCard } from "@/components/NeumorphicStyleCard";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { motion } from "framer-motion";
import { useState } from "react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-gray-90">
      <main className="container py-12 space-y-8">
        <motion.div 
          className="max-w-4xl mx-auto space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="relative w-32 h-32 mx-auto mb-6"
            variants={itemVariants}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-80 shadow-neumorphic-card">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <NeumorphicButton
              size="icon"
              className="absolute bottom-0 right-0 rounded-full"
              variant="neumorphic"
              withMotion
            >
              <Camera className="w-4 h-4" />
            </NeumorphicButton>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold text-center text-gray-dark-90 mb-8">
              Your Profile
            </h1>
          </motion.div>

          <motion.div className="space-y-6" variants={itemVariants}>
            <NeumorphicStyleCard title="Personal Information" animate delay={0.1}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-dark-70">Full Name</label>
                  <Input 
                    defaultValue="Alex Johnson" 
                    className="bg-gray-100 border-gray-80 focus:border-primary focus:ring-1 focus:ring-primary"
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-dark-70">Email</label>
                  <Input 
                    defaultValue="alex@example.com" 
                    type="email" 
                    className="bg-gray-100 border-gray-80 focus:border-primary focus:ring-1 focus:ring-primary"
                    disabled={!isEditing}
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <NeumorphicButton 
                    variant="neumorphic" 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    withMotion
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </NeumorphicButton>
                </div>
              </div>
            </NeumorphicStyleCard>

            <NeumorphicStyleCard title="Style Preferences" animate delay={0.2}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-dark-80">Preferred Styles</span>
                  <NeumorphicButton variant="outline" size="sm">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </NeumorphicButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Minimalist", "Casual", "Modern"].map((style, index) => (
                    <motion.div
                      key={style}
                      className="px-3 py-1 bg-gray-100 text-gray-dark-80 rounded-full text-sm shadow-neumorphic-inset"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + (index * 0.1) }}
                      whileHover={{ y: -2, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                    >
                      {style}
                    </motion.div>
                  ))}
                </div>
              </div>
            </NeumorphicStyleCard>

            <NeumorphicStyleCard title="Account Statistics" animate delay={0.3}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: "24", label: "Outfits Created" },
                  { value: "156", label: "Items in Wardrobe" },
                  { value: "92%", label: "Style Match Rate" }
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="text-center p-4 bg-gray-100 rounded-lg shadow-neumorphic-inset"
                    whileHover={{ y: -5, boxShadow: "0 8px 15px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-gray-dark-60">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </NeumorphicStyleCard>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
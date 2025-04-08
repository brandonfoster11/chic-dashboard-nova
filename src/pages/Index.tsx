import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Wand2, 
  ShirtIcon, 
  ImageIcon, 
  TrendingUp, 
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { motion } from "framer-motion";
import { typography, spacing, layout, animations } from "@/lib/design-system";

const Index = () => {
  const navigate = useNavigate();

  const analyticsData = [
    { name: "Jan", outfits: 20 },
    { name: "Feb", outfits: 35 },
    { name: "Mar", outfits: 45 },
    { name: "Apr", outfits: 30 },
    { name: "May", outfits: 49 },
    { name: "Jun", outfits: 60 },
  ];

  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className={`${layout.page} animate-fade-up`}>
      <motion.h1 
        className={`${typography.h1} mb-8`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome back!
      </motion.h1>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <NeumorphicCard variant="default" hover="glow" animate>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <ShirtIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className={typography.h2}>156</h3>
              <p className={typography.muted}>Items in Wardrobe</p>
            </div>
          </NeumorphicCard>
        </motion.div>
        
        <motion.div variants={item}>
          <NeumorphicCard variant="default" hover="glow" animate delay={0.1}>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className={typography.h2}>24</h3>
              <p className={typography.muted}>Generated Outfits</p>
            </div>
          </NeumorphicCard>
        </motion.div>
        
        <motion.div variants={item}>
          <NeumorphicCard variant="default" hover="glow" animate delay={0.2}>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className={typography.h2}>92%</h3>
              <p className={typography.muted}>Style Match Rate</p>
            </div>
          </NeumorphicCard>
        </motion.div>
        
        <motion.div variants={item}>
          <NeumorphicCard variant="default" hover="glow" animate delay={0.3}>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Wand2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className={typography.h2}>15</h3>
              <p className={typography.muted}>AI Suggestions</p>
            </div>
          </NeumorphicCard>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <NeumorphicCard variant="elevated" padding="lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className={typography.h3}>Outfit Generation Trends</h2>
              <NeumorphicButton 
                variant="neumorphic" 
                size="sm"
                onClick={() => navigate("/analytics")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Details
              </NeumorphicButton>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="outfits" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ strokeWidth: 2 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </NeumorphicCard>
        </motion.div>

        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <NeumorphicCard variant="default" hover="scale">
            <h2 className={`${typography.h3} mb-4`}>Quick Actions</h2>
            <div className="space-y-4">
              <NeumorphicButton 
                className="w-full justify-start" 
                variant="glow"
                withMotion
                onClick={() => navigate("/create-outfit")}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Generate New Outfit
              </NeumorphicButton>
              <NeumorphicButton 
                className="w-full justify-start" 
                variant="neumorphic"
                withMotion
                onClick={() => navigate("/wardrobe")}
              >
                <ShirtIcon className="mr-2 h-4 w-4" />
                Add Items to Wardrobe
              </NeumorphicButton>
            </div>
          </NeumorphicCard>

          <NeumorphicCard variant="default">
            <h2 className={`${typography.h3} mb-4`}>Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm p-2 hover:bg-accent/50 rounded-md transition-colors">
                <span>Generated summer casual outfit</span>
                <span className={typography.subtle}>2h ago</span>
              </div>
              <div className="flex items-center justify-between text-sm p-2 hover:bg-accent/50 rounded-md transition-colors">
                <span>Added 3 new items to wardrobe</span>
                <span className={typography.subtle}>5h ago</span>
              </div>
              <div className="flex items-center justify-between text-sm p-2 hover:bg-accent/50 rounded-md transition-colors">
                <span>Updated style preferences</span>
                <span className={typography.subtle}>1d ago</span>
              </div>
            </div>
          </NeumorphicCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
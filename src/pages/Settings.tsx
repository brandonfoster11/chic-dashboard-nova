import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { NeumorphicStyleCard } from "@/components/NeumorphicStyleCard";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { motion } from "framer-motion";
import { useState } from "react";
import { Save, Lock, Bell, Eye, EyeOff, Trash2, LogOut, HelpCircle } from "lucide-react";

const Settings = () => {
  const [isDirty, setIsDirty] = useState(false);
  
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

  const handleSwitchChange = () => {
    setIsDirty(true);
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
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl font-bold text-gray-dark-90 mb-2">Settings</h1>
            <p className="text-gray-dark-60 mb-8">Customize your StyleAI experience</p>
          </motion.div>

          <motion.div className="space-y-6" variants={containerVariants}>
            <NeumorphicStyleCard title="Notifications" animate delay={0.1}>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 hover:bg-gray-80 rounded-lg transition-colors">
                  <div className="flex items-start space-x-3">
                    <Bell className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-dark-80">Email Notifications</p>
                      <p className="text-sm text-gray-dark-60">
                        Receive updates about your outfits and recommendations
                      </p>
                    </div>
                  </div>
                  <Switch onCheckedChange={handleSwitchChange} />
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-gray-80 rounded-lg transition-colors">
                  <div className="flex items-start space-x-3">
                    <Bell className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-dark-80">Weekly Style Report</p>
                      <p className="text-sm text-gray-dark-60">
                        Get a weekly summary of your style choices
                      </p>
                    </div>
                  </div>
                  <Switch onCheckedChange={handleSwitchChange} />
                </div>
              </div>
            </NeumorphicStyleCard>

            <NeumorphicStyleCard title="Privacy" animate delay={0.2}>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 hover:bg-gray-80 rounded-lg transition-colors">
                  <div className="flex items-start space-x-3">
                    <Eye className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-dark-80">Profile Visibility</p>
                      <p className="text-sm text-gray-dark-60">
                        Make your profile visible to other users
                      </p>
                    </div>
                  </div>
                  <Switch onCheckedChange={handleSwitchChange} />
                </div>
                <div className="flex items-center justify-between p-3 hover:bg-gray-80 rounded-lg transition-colors">
                  <div className="flex items-start space-x-3">
                    <Lock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-dark-80">Share Style Analytics</p>
                      <p className="text-sm text-gray-dark-60">
                        Allow us to use your style data for improving recommendations
                      </p>
                    </div>
                  </div>
                  <Switch onCheckedChange={handleSwitchChange} />
                </div>
              </div>
            </NeumorphicStyleCard>

            <NeumorphicStyleCard title="Account" animate delay={0.3}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-dark-70">Current Password</label>
                  <Input 
                    type="password" 
                    placeholder="Enter your current password" 
                    className="bg-gray-100 border-gray-80 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-dark-70">New Password</label>
                  <Input 
                    type="password" 
                    placeholder="Enter your new password" 
                    className="bg-gray-100 border-gray-80 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-dark-70">Confirm New Password</label>
                  <Input 
                    type="password" 
                    placeholder="Confirm your new password" 
                    className="bg-gray-100 border-gray-80 focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <NeumorphicButton 
                    variant="neumorphic" 
                    size="sm"
                    onClick={() => setIsDirty(false)}
                    withMotion
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Update Password
                  </NeumorphicButton>
                </div>
              </div>
            </NeumorphicStyleCard>

            <NeumorphicStyleCard title="Danger Zone" animate delay={0.4}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-dark-80">Delete Account</p>
                    <p className="text-sm text-gray-dark-60">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <NeumorphicButton 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </NeumorphicButton>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-dark-80">Log Out</p>
                    <p className="text-sm text-gray-dark-60">
                      Sign out of your account on this device
                    </p>
                  </div>
                  <NeumorphicButton 
                    variant="outline" 
                    size="sm"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </NeumorphicButton>
                </div>
              </div>
            </NeumorphicStyleCard>
          </motion.div>

          {isDirty && (
            <motion.div 
              className="fixed bottom-6 right-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <NeumorphicButton 
                variant="neumorphic" 
                size="lg"
                onClick={() => setIsDirty(false)}
                withMotion
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </NeumorphicButton>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Settings;
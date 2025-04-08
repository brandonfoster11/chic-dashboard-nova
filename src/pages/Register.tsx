import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "@/lib/validations/auth";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { motion } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Auto-focus the name field on component mount
  useEffect(() => {
    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
    if (nameInput) {
      nameInput.focus();
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setAuthError(null);
      await register(values.email, values.password);
      
      toast({
        title: "Registration successful",
        description: "Welcome to StyleAI! Let's set up your profile.",
        duration: 3000,
      });
      
      navigate("/onboarding");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to register";
      setAuthError(errorMessage);
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  // Define staggered animation variants for form fields
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto flex flex-col items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="mt-2 text-gray-dark-60">
            Start your fashion journey today
          </p>
        </div>
        
        <NeumorphicCard variant="elevated" hover="none" padding="lg" animate>
          <Form {...form}>
            <motion.form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {authError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          className="bg-gray-100 border-gray-80"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="you@example.com" 
                          type="email" 
                          className="bg-gray-100 border-gray-80"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            className="bg-gray-100 border-gray-80 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-dark-60" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-dark-60" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="••••••••"
                            type={showConfirmPassword ? "text" : "password"}
                            className="bg-gray-100 border-gray-80 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-dark-60" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-dark-60" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="pt-2">
                <NeumorphicButton
                  type="submit"
                  className="w-full"
                  variant="neumorphic"
                  disabled={isLoading}
                  withMotion
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </NeumorphicButton>
              </motion.div>
            </motion.form>
          </Form>
        </NeumorphicCard>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-dark-60">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/lib/validations/auth";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormValues & { rememberMe: boolean }>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Auto-focus the email field on component mount
  useEffect(() => {
    const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
    if (emailInput) {
      emailInput.focus();
    }
    
    // Load remembered email if it exists
    const rememberedEmail = localStorage.getItem('email');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (rememberedEmail && rememberMe) {
      form.setValue('email', rememberedEmail);
      form.setValue('rememberMe', true);
    }
  }, [form]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (values: LoginFormValues & { rememberMe: boolean }) => {
    try {
      setAuthError(null);
      
      // Store remember me preference
      if (values.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('email', values.email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('email');
      }
      
      await login(values.email, values.password);
      toast({
        title: "Login successful",
        description: "Welcome back to StyleAI!",
        duration: 3000,
      });
      navigate("/dashboard");
    } catch (err) {
      setAuthError("Invalid email or password. Please try again.");
      console.error(err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto flex flex-col items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-gray-dark-60">
            Sign in to your account to continue
          </p>
        </div>
        
        <NeumorphicCard variant="elevated" hover="none" padding="lg" animate>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {authError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              
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
                        autoComplete="email"
                        className="bg-gray-100 border-gray-80"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                          autoComplete="current-password"
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
              
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="rememberMe"
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        Remember me
                      </label>
                    </div>
                  )}
                />
                
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              
              <div className="pt-2">
                <NeumorphicButton
                  type="submit"
                  className="w-full"
                  variant="neumorphic"
                  disabled={isLoading}
                  withMotion
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </NeumorphicButton>
              </div>
            </form>
          </Form>
        </NeumorphicCard>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-dark-60">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
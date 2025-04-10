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
import { AlertCircle, Eye, EyeOff, InfoIcon, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { NeumorphicCard } from "@/components/ui/neumorphic-card";
import { NeumorphicButton } from "@/components/ui/neumorphic-button";
import { motion } from "framer-motion";
import { checkDatabaseStatus, getDbStatusMessage } from "@/utils/db-status";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [dbStatus, setDbStatus] = useState<{isConnected: boolean; hasPermissions: boolean} | null>(null);
  const [showDbStatus, setShowDbStatus] = useState(false);
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

    // Check database status
    checkDatabaseStatus().then(status => {
      setDbStatus(status);
      if (!status.isConnected || !status.hasPermissions) {
        setShowDbStatus(true);
      }
    });
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
      
      console.log('Login: Attempting login with email:', values.email);
      await login(values.email, values.password);
      
      console.log('Login: Login successful, redirecting to dashboard');
      toast({
        title: "Login successful",
        description: "Welcome back to StyleAI!",
        duration: 3000,
      });
      navigate("/dashboard");
    } catch (err) {
      console.error('Login: Login failed:', err);
      
      // Check database status after login failure
      const status = await checkDatabaseStatus();
      setDbStatus(status);
      setShowDbStatus(true);
      
      // Provide a more specific error message if available
      let errorMessage = "Invalid email or password. Please try again.";
      if (err instanceof Error && err.message) {
        errorMessage = err.message;
      }
      
      setAuthError(errorMessage);
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
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
          <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
            <p className="text-sm font-medium">
              <strong>Test Account Available:</strong> Use <code>test@example.com</code> / <code>Password123!</code> to log in
            </p>
          </div>
        </div>
        
        {/* Database Status Information */}
        {showDbStatus && dbStatus && (
          <div className={`p-4 rounded-md border ${
            dbStatus.isConnected && dbStatus.hasPermissions 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                {dbStatus.isConnected && dbStatus.hasPermissions ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <InfoIcon className="h-5 w-5 text-yellow-500" />
                )}
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Database Status</h3>
                <div className="mt-1 text-sm">
                  <p>Connection: {dbStatus.isConnected ? 'Connected ✓' : 'Disconnected ✗'}</p>
                  <p>Permissions: {dbStatus.hasPermissions ? 'Available ✓' : 'Unavailable ✗'}</p>
                  {(!dbStatus.isConnected || !dbStatus.hasPermissions) && (
                    <p className="mt-1 font-medium">Please use the test account credentials above.</p>
                  )}
                </div>
                <button 
                  onClick={() => setShowDbStatus(false)}
                  className="mt-2 text-xs text-yellow-600 hover:text-yellow-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
        
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
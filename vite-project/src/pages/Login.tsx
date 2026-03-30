import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getDefaultProfileIdForUser } from "@/hooks/use-profiles";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function Login() {
  const [, setLocation] = useLocation();
  const { user, login } = useAuth();

  const [submitting, setSubmitting] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    const profileId = getDefaultProfileIdForUser(user.id);
    setLocation(profileId ? `/dashboard/${profileId}` : "/profile/new");
  }, [user, setLocation]);

  const onSubmit = async (values: LoginValues) => {
    try {
      setSubmitting(true);
      await login(values);
      toast({
        title: "Welcome back",
        description: "You’re signed in. Create your emergency profile anytime.",
      });
      // Redirect happens in the useEffect once `user` is available.
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast({
        title: "Sign in failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">Sign in</h1>
            <p className="text-muted-foreground mt-2">Access your account to manage your emergency profile.</p>
          </div>

          <Card className="shadow-xl shadow-black/5 border-border/50 rounded-2xl overflow-hidden">
            <CardHeader className="bg-secondary/30 border-b border-border/40 pb-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-primary" />
                Login Details
              </CardTitle>
              <CardDescription>Use the email you signed up with.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-semibold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-12 rounded-xl bg-background"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="font-semibold">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Your password"
                    className="h-12 rounded-xl bg-background"
                    {...form.register("password")}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all font-semibold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>

                <div className="pt-2 text-center text-sm text-muted-foreground">
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    className="font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                    onClick={() => setLocation("/signup")}
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}


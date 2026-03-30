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
import { Loader2, ShieldPlus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getDefaultProfileIdForUser } from "@/hooks/use-profiles";

const signupSchema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupValues = z.infer<typeof signupSchema>;

export function Signup() {
  const [, setLocation] = useLocation();
  const { user, signup } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    const profileId = getDefaultProfileIdForUser(user.id);
    setLocation(profileId ? `/dashboard/${profileId}` : "/profile/new");
  }, [user, setLocation]);

  const onSubmit = async (values: SignupValues) => {
    try {
      setSubmitting(true);
      await signup({ email: values.email, password: values.password });
      toast({
        title: "Account created",
        description: "You're signed in. Create your emergency profile next.",
      });
      // Redirect happens in the useEffect once `user` is available.
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed";
      toast({
        title: "Sign up failed",
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
              <ShieldPlus className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">Create account</h1>
            <p className="text-muted-foreground mt-2">
              Sign up so you can quickly access your profile in the future.
            </p>
          </div>

          <Card className="shadow-xl shadow-black/5 border-border/50 rounded-2xl overflow-hidden">
            <CardHeader className="bg-secondary/30 border-b border-border/40 pb-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldPlus className="w-5 h-5 text-primary" />
                Your details
              </CardTitle>
              <CardDescription>Use a real email so you can log in later.</CardDescription>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-semibold">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Create a password"
                      className="h-12 rounded-xl bg-background"
                      {...form.register("password")}
                    />
                    {form.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-semibold">
                      Confirm password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      className="h-12 rounded-xl bg-background"
                      {...form.register("confirmPassword")}
                    />
                    {form.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all font-semibold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Sign up <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>

                <div className="pt-2 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="font-semibold text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                    onClick={() => setLocation("/login")}
                  >
                    Log in
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


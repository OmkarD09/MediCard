import { useParams } from "wouter";
import { Layout } from "@/components/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCreateProfile, useUpdateProfile, useProfile } from "@/hooks/use-profiles";
import { useEffect } from "react";
import { HeartPulse, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  bloodGroup: z.string().min(1, "Blood group is required"),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const params = useParams();
  const isEdit = params.id && params.id !== "new";
  
  const { data: profile, isLoading: isFetching } = useProfile(isEdit ? params.id! : "");
  const createMutation = useCreateProfile();
  const updateMutation = useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      bloodGroup: "",
      allergies: "",
      medicalConditions: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    },
  });

  useEffect(() => {
    if (profile && isEdit) {
      form.reset({
        fullName: profile.fullName,
        bloodGroup: profile.bloodGroup,
        allergies: profile.allergies || "",
        medicalConditions: profile.medicalConditions || "",
        emergencyContactName: profile.emergencyContactName || "",
        emergencyContactPhone: profile.emergencyContactPhone || "",
      });
    }
  }, [profile, isEdit, form]);

  const onSubmit = (data: ProfileFormValues) => {
    if (isEdit) {
      updateMutation.mutate({ id: params.id!, data });
    } else {
      createMutation.mutate({ data });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEdit && isFetching) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

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
              <HeartPulse className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              {isEdit ? "Update Your Profile" : "Create Medical Profile"}
            </h1>
            <p className="text-muted-foreground mt-2">
              Fill in your crucial information so first responders know exactly what to do.
            </p>
          </div>

          <Card className="shadow-xl shadow-black/5 border-border/50 rounded-2xl overflow-hidden">
            <CardHeader className="bg-secondary/30 border-b border-border/40 pb-6">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>
                This information will be publicly visible to anyone who scans your QR code.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="font-semibold">Full Name <span className="text-destructive">*</span></Label>
                    <Input 
                      id="fullName" 
                      placeholder="Jane Doe" 
                      className="h-12 rounded-xl bg-background"
                      {...form.register("fullName")} 
                    />
                    {form.formState.errors.fullName && (
                      <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup" className="font-semibold">Blood Group <span className="text-destructive">*</span></Label>
                    <Select 
                      value={form.watch("bloodGroup")} 
                      onValueChange={(value) => form.setValue("bloodGroup", value, { shouldValidate: true })}
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-background">
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"].map((bg) => (
                          <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.bloodGroup && (
                      <p className="text-sm text-destructive">{form.formState.errors.bloodGroup.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="allergies" className="font-semibold text-destructive">Known Allergies</Label>
                    <Textarea 
                      id="allergies" 
                      placeholder="Penicillin, Peanuts, Latex (leave blank if none)" 
                      className="min-h-[100px] rounded-xl bg-background border-destructive/20 focus-visible:ring-destructive/30"
                      {...form.register("allergies")} 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalConditions" className="font-semibold">Medical Conditions</Label>
                    <Textarea 
                      id="medicalConditions" 
                      placeholder="Asthma, Type 1 Diabetes, Hypertension..." 
                      className="min-h-[100px] rounded-xl bg-background"
                      {...form.register("medicalConditions")} 
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactName" className="font-semibold">Contact Name</Label>
                      <Input 
                        id="emergencyContactName" 
                        placeholder="John Doe (Husband)" 
                        className="h-12 rounded-xl bg-background"
                        {...form.register("emergencyContactName")} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactPhone" className="font-semibold">Contact Phone</Label>
                      <Input 
                        id="emergencyContactPhone" 
                        type="tel"
                        placeholder="+1 (555) 000-0000" 
                        className="h-12 rounded-xl bg-background"
                        {...form.register("emergencyContactPhone")} 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isPending} 
                    className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all font-semibold"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Saving Profile...
                      </>
                    ) : (
                      isEdit ? "Save Changes" : "Generate Emergency Profile"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}

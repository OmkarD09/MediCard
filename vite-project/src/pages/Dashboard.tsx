import { useParams, Link } from "wouter";
import { Layout } from "@/components/Layout";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/use-profiles";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  Share2, 
  Edit, 
  User, 
  Phone, 
  AlertTriangle, 
  Activity, 
  Loader2, 
  Droplet
} from "lucide-react";
import { motion } from "framer-motion";

export function Dashboard() {
  const params = useParams();
  const id = params.id!;
  const { data: profile, isLoading, isError } = useProfile(id);
  const { toast } = useToast();

  const emergencyUrl = `${window.location.origin}${import.meta.env.BASE_URL}emergency/${id}`;

  const downloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;
    
    // Quick hack to download SVG as PNG using Canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const xml = new XMLSerializer().serializeToString(svg);
    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';
    const image64 = b64Start + svg64;

    img.onload = function() {
      // Add padding and white background
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        
        const a = document.createElement("a");
        a.download = `MediCard-QR-${profile?.fullName.replace(/\s+/g, '-')}.png`;
        a.href = canvas.toDataURL("image/png");
        a.click();
        
        toast({
          title: "Downloaded Successfully",
          description: "Your QR code image has been saved to your device.",
        });
      }
    };
    img.src = image64;
  };

  const shareProfile = async () => {
    try {
      await navigator.clipboard.writeText(emergencyUrl);
      toast({
        title: "Link Copied!",
        description: "Emergency profile link copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (isError || !profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center max-w-md">
          <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground mb-8">The requested medical profile does not exist or has been removed.</p>
          <Link href="/profile/new">
            <Button size="lg" className="rounded-full w-full">Create New Profile</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-5xl px-4 py-10 md:py-16">
        
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your emergency profile and QR code.
            </p>
          </div>
          <Link href={`/profile/${profile.id}/edit`}>
            <Button variant="outline" className="rounded-full gap-2">
              <Edit className="w-4 h-4" /> Edit Profile
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* QR Code Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <Card className="rounded-3xl border-border/50 shadow-xl shadow-primary/5 overflow-hidden">
              <div className="bg-primary/5 p-8 flex flex-col items-center justify-center border-b border-border/50">
                <div className="bg-white p-4 rounded-2xl shadow-sm ring-1 ring-black/5 mb-6">
                  <QRCodeSVG 
                    id="qr-code"
                    value={emergencyUrl} 
                    size={200} 
                    level="H"
                    includeMargin={false}
                    fgColor="#0f172a" 
                  />
                </div>
                <h3 className="font-bold text-foreground text-center">Your Medical QR</h3>
                <p className="text-xs text-muted-foreground text-center mt-1">
                  Keep this on your lock screen or print it for your wallet.
                </p>
              </div>
              <div className="p-4 bg-card grid grid-cols-2 gap-3">
                <Button variant="secondary" className="w-full gap-2 rounded-xl" onClick={downloadQR}>
                  <Download className="w-4 h-4" /> Save
                </Button>
                <Button variant="secondary" className="w-full gap-2 rounded-xl" onClick={shareProfile}>
                  <Share2 className="w-4 h-4" /> Share
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Quick Info Preview Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8"
          >
            <h3 className="text-lg font-semibold mb-4 px-2">Information Preview</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="rounded-2xl shadow-md shadow-black/5 hover:shadow-lg transition-shadow border-border/50">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-1">Full Name</div>
                    <div className="font-bold text-lg text-foreground">{profile.fullName}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md shadow-black/5 hover:shadow-lg transition-shadow border-destructive/20 relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-destructive" />
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                    <Droplet className="w-6 h-6 fill-destructive/20" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground mb-1">Blood Group</div>
                    <div className="font-display font-black text-2xl text-destructive tracking-tight">{profile.bloodGroup}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md shadow-black/5 hover:shadow-lg transition-shadow border-border/50 sm:col-span-2">
                <CardContent className="p-6 flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" /> Allergies
                    </div>
                    {profile.allergies ? (
                      <p className="font-medium text-foreground">{profile.allergies}</p>
                    ) : (
                      <p className="text-muted-foreground italic text-sm">None reported</p>
                    )}
                  </div>
                  
                  <div className="hidden sm:block w-px bg-border self-stretch" />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                      <Activity className="w-4 h-4 text-primary" /> Medical Conditions
                    </div>
                    {profile.medicalConditions ? (
                      <p className="font-medium text-foreground">{profile.medicalConditions}</p>
                    ) : (
                      <p className="text-muted-foreground italic text-sm">None reported</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-md shadow-black/5 hover:shadow-lg transition-shadow border-border/50 sm:col-span-2 bg-secondary/20">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-muted-foreground mb-1">Emergency Contact</div>
                    {profile.emergencyContactName ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-foreground">{profile.emergencyContactName}</div>
                          <div className="text-sm font-medium text-primary">{profile.emergencyContactPhone}</div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic text-sm">No emergency contact provided</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center sm:text-left">
              <Link href={`/emergency/${id}`} target="_blank">
                <Button variant="link" className="text-primary hover:text-primary/80 font-medium">
                  View Public Emergency Page →
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

type Profile = {
  id: string;
  fullName: string;
  bloodGroup: string;
  allergies?: string;
  medicalConditions?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  ownerUserId?: string;
};

type ProfileInput = Omit<Profile, "id">;

const STORAGE_KEY = "medicard_profiles";
const USER_PROFILE_INDEX_KEY = "medicard_user_profile_index";

function readProfiles(): Record<string, Profile> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as Record<string, Profile>;
  } catch {
    return {};
  }
}

function writeProfiles(profiles: Record<string, Profile>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

function readUserProfileIndex(): Record<string, string> {
  const raw = localStorage.getItem(USER_PROFILE_INDEX_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function writeUserProfileIndex(index: Record<string, string>) {
  localStorage.setItem(USER_PROFILE_INDEX_KEY, JSON.stringify(index));
}

export function getDefaultProfileIdForUser(userId: string): string | null {
  const index = readUserProfileIndex();
  return index[userId] ?? null;
}

export function useProfile(id: string) {
  return useQuery({
    queryKey: ["profile", id],
    enabled: !!id && id !== "new",
    retry: 1,
    queryFn: async () => {
      const profiles = readProfiles();
      return profiles[id] ?? null;
    },
  });
}

export function useCreateProfile() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ data }: { data: ProfileInput }) => {
      const id = crypto.randomUUID();
      const created: Profile = { ...data, id, ownerUserId: user?.id };
      const profiles = readProfiles();
      profiles[id] = created;
      writeProfiles(profiles);

      if (user?.id) {
        const index = readUserProfileIndex();
        index[user.id] = id;
        writeUserProfileIndex(index);
      }

      return created;
    },
    onSuccess: (data) => {
        toast({
          title: "Profile Created",
          description: "Your emergency health profile is ready.",
        });
        queryClient.invalidateQueries({ queryKey: ["profile", data.id] });
        setLocation(`/dashboard/${data.id}`);
    },
    onError: (error: Error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to create profile",
          variant: "destructive",
        });
    },
  });
}

export function useUpdateProfile() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProfileInput }) => {
      const profiles = readProfiles();
      if (!profiles[id]) {
        throw new Error("Profile not found");
      }

      const updated: Profile = { ...profiles[id], ...data, id };
      profiles[id] = updated;
      writeProfiles(profiles);
      return updated;
    },
    onSuccess: (data) => {
        toast({
          title: "Profile Updated",
          description: "Your emergency health profile has been saved.",
        });
        queryClient.invalidateQueries({ queryKey: ["profile", data.id] });
        setLocation(`/dashboard/${data.id}`);
    },
    onError: (error: Error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to update profile",
          variant: "destructive",
        });
    },
  });
}

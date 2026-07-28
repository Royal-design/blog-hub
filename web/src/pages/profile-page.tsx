import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import {
  AtSign,
  Camera,
  Check,
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  User,
  UserCircle,
  X,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { ErrorState } from "@/components/common/error-state"
import { FormInput } from "@/components/forms/form-input"
import { FormTextarea } from "@/components/forms/form-textarea"
import { PageLoader } from "@/components/loaders/page-loader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { profileService } from "@/services/profile.service"
import { getErrorMessage } from "@/utils/error"

interface ProfileFormValues {
  first_name: string
  last_name: string
  username: string
  bio: string
}

export function ProfilePage() {
  const queryClient = useQueryClient()
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: profileService.getProfile,
    staleTime: 60_000,
  })

  const form = useForm<ProfileFormValues>({
    values: {
      first_name: profileQuery.data?.first_name || "",
      last_name: profileQuery.data?.last_name || "",
      username: profileQuery.data?.username || "",
      bio: profileQuery.data?.bio || "",
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: (formData: FormData) => profileService.updateProfile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      toast.success("Profile updated successfully!")
      setAvatarFile(null)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  if (profileQuery.isLoading) {
    return <PageLoader />
  }

  if (profileQuery.isError) {
    return (
      <ErrorState
        description={getErrorMessage(profileQuery.error)}
        onRetry={() => void profileQuery.refetch()}
      />
    )
  }

  const profile = profileQuery.data

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size must be less than 5MB.")
        return
      }
      setAvatarFile(file)
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)
    }
  }

  const handleClearAvatar = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAvatarFile(null)
    setAvatarPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (values: ProfileFormValues) => {
    const formData = new FormData()
    formData.append("first_name", values.first_name)
    formData.append("last_name", values.last_name)
    formData.append("username", values.username)
    formData.append("bio", values.bio)

    if (avatarFile) {
      formData.append("avatar", avatarFile)
    }

    updateProfileMutation.mutate(formData)
  }

  const displayAvatar = avatarPreview || profile?.avatar

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      {/* Top Hero Banner & Profile Overview */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl">
        {/* Decorative Background Mesh / Gradient */}
        <div className="h-44 sm:h-52 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/30" />
          <div className="absolute -bottom-10 -right-10 size-60 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute top-4 right-6 flex items-center gap-2">
            <Badge className="bg-white/20 text-white backdrop-blur-md border-white/20 px-3 py-1 font-semibold text-xs shadow-sm">
              <ShieldCheck className="size-3.5 mr-1" /> Verified Author
            </Badge>
          </div>
        </div>

        {/* Profile Card Header Info */}
        <div className="px-6 sm:px-10 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            
            {/* Avatar Container with Plus Button Overlay */}
            <div className="relative group">
              <div className="relative size-28 sm:size-36 rounded-full border-4 border-white dark:border-slate-900 shadow-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 transition-transform duration-300 group-hover:scale-[1.02]">
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt={profile?.first_name || "Profile"}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="size-full grid place-items-center bg-primary/10 text-primary">
                    <UserCircle className="size-20" aria-hidden />
                  </div>
                )}
                {/* Upload Hover Overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                  title="Upload profile picture"
                >
                  <Camera className="size-7" />
                  <span className="text-[11px] font-extrabold mt-1 uppercase tracking-wider">
                    Change
                  </span>
                </button>
              </div>

              {/* Plus Icon Action Badge Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg border-2 border-white dark:border-slate-900 hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                title="Add new avatar picture"
              >
                <Plus className="size-5 stroke-[2.5]" />
              </button>

              {/* Reset Avatar button if custom file selected */}
              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleClearAvatar}
                  className="absolute top-0 right-0 grid size-7 place-items-center rounded-full bg-rose-600 text-white shadow-md border-2 border-white dark:border-slate-900 hover:bg-rose-700 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  title="Remove selected picture"
                >
                  <X className="size-3.5 stroke-[3]" />
                </button>
              )}

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Profile Meta info */}
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {profile?.first_name} {profile?.last_name}
                </h1>
                {avatarFile && (
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-bold text-xs">
                    <CheckCircle2 className="size-3 mr-1" /> New Avatar Selected
                  </Badge>
                )}
              </div>
              <p className="text-sm font-semibold text-primary flex items-center justify-center sm:justify-start gap-1">
                <AtSign className="size-3.5 inline" />
                {profile?.username}
              </p>
              <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                <Mail className="size-3.5 inline" />
                {profile?.email}
              </p>
            </div>
          </div>

          {profile?.bio && (
            <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/60">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic max-w-2xl">
                "{profile.bio}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modern Edit Profile Form Section */}
      <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="size-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-extrabold tracking-tight">
                Update Profile Info
              </CardTitle>
              <CardDescription className="text-xs font-medium text-muted-foreground">
                Personalize your public profile details and avatar image
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form
            id="profile-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Quick Avatar Upload Notice banner */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="relative size-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                  {displayAvatar ? (
                    <img src={displayAvatar} alt="" className="size-full object-cover" />
                  ) : (
                    <User className="size-full p-2 text-slate-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Profile Picture</h4>
                  <p className="text-[11px] text-muted-foreground">
                    {avatarFile ? avatarFile.name : "Click the plus (+) icon on avatar to upload"}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl font-bold text-xs gap-1.5"
              >
                <Plus className="size-4 stroke-[2.5] text-primary" />
                Upload New Image
              </Button>
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormInput
                control={form.control}
                name="first_name"
                label="First Name"
                placeholder="John"
                disabled={updateProfileMutation.isPending}
              />
              <FormInput
                control={form.control}
                name="last_name"
                label="Last Name"
                placeholder="Doe"
                disabled={updateProfileMutation.isPending}
              />
            </div>

            {/* Username */}
            <FormInput
              control={form.control}
              name="username"
              label="Username"
              placeholder="johndoe"
              disabled={updateProfileMutation.isPending}
            />

            {/* Author Bio */}
            <FormTextarea
              control={form.control}
              name="bio"
              label="Author Biography"
              placeholder="Write a brief intro about yourself..."
              rows={4}
              maxLength={250}
              disabled={updateProfileMutation.isPending}
            />

            {/* Action Bar / Submit Button */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <Button
                type="submit"
                form="profile-form"
                size="lg"
                disabled={updateProfileMutation.isPending}
                className="w-full sm:w-auto font-extrabold rounded-2xl px-8 shadow-lg shadow-primary/25 hover:shadow-primary/35 transition-all duration-200"
              >
                {updateProfileMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin stroke-[2.5]" />
                    Saving Changes...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="size-4 stroke-[2.5]" />
                    Save Profile Changes
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

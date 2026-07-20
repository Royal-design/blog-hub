import { useQuery } from "@tanstack/react-query"
import { UserCircle } from "lucide-react"

import { ErrorState } from "@/components/common/error-state"
import { PageLoader } from "@/components/loaders/page-loader"
import { profileService } from "@/services/profile.service"
import { getErrorMessage } from "@/utils/error"

export function ProfilePage() {
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: profileService.getProfile,
    staleTime: 60_000,
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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-4">
          {profile?.avatar ? (
            <img
              src={profile.avatar}
              alt=""
              className="size-20 rounded-full object-cover"
            />
          ) : (
            <div className="grid size-20 place-items-center rounded-full bg-primary/10 text-primary">
              <UserCircle className="size-10" aria-hidden />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold">
              {profile?.first_name} {profile?.last_name}
            </h1>
            <p className="text-sm text-muted-foreground">@{profile?.username}</p>
          </div>
        </div>
        {profile?.bio ? (
          <p className="mt-6 leading-7 text-muted-foreground">{profile.bio}</p>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            Profile details are ready for editing once the profile form is added.
          </p>
        )}
      </div>
    </div>
  )
}

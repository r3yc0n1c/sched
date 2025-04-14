"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from 'react-redux';
import { setInstantMeeting, setScheduledMeeting, clearScheduledMeeting } from '@/store/meetingsSlice';
import { Logo } from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, Trash2, User } from "lucide-react";

export default function SchedulePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const { instantMeeting, scheduledMeetings } = useSelector((state) => state.meetings);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  const handleProfile = () => {
    // TODO: Implement profile page navigation
    console.log('Navigate to profile page');
  };

  const generateMeetLink = () => {
    const randomId = Math.random().toString(36).substring(2, 15);
    return `https://meet.google.com/${randomId}`;
  };

  const handleInstantMeeting = () => {
    const meetLink = generateMeetLink();
    const now = new Date();
    dispatch(setInstantMeeting({
      link: meetLink,
      createdAt: now.toISOString(),
    }));
  };

  const handleScheduleMeeting = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const date = formData.get("date");
    const time = formData.get("time");
    
    const meetLink = generateMeetLink();
    const scheduledDate = new Date(`${date}T${time}`);
    
    dispatch(setScheduledMeeting({
      name,
      link: meetLink,
      date: scheduledDate.toISOString(),
    }));

    // Reset the form
    e.target.reset();
  };

  const handleDeleteMeeting = (meetLink) => {
    dispatch(clearScheduledMeeting(meetLink));
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background lg:py-6 py-12 px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex lg:flex-col justify-between items-center mb-8">
            <Skeleton className="h-8 w-[200px]" />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-9 w-[200px]" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-[150px]" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const firstName = session.user?.name?.split(' ')[0] || 'User';

  return (
    <div className="min-h-screen bg-background lg:py-6 py-12 px-4 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Logo />
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user?.image} alt={firstName} />
                    <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{firstName}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleProfile}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="lg:space-y-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Instant Meeting</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleInstantMeeting} className="w-full">
                Create Instant Meeting
              </Button>
              {instantMeeting && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Created at: {format(new Date(instantMeeting.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                  <a
                    href={instantMeeting.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {instantMeeting.link}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule Meeting</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleScheduleMeeting} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">Meeting Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter meeting name"
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Date</label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Time</label>
                  <input
                    type="time"
                    name="time"
                    required
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Schedule Meeting
                </Button>
              </form>

              {scheduledMeetings.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-medium text-foreground">Scheduled Meetings</h3>
                  {scheduledMeetings.map((meeting) => (
                    <div key={meeting.link} className="p-4 bg-muted rounded-md relative group">
                      <button
                        onClick={() => handleDeleteMeeting(meeting.link)}
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-background transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </button>
                      <h4 className="font-medium text-foreground">{meeting.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(meeting.date), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                      <a
                        href={meeting.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                        {meeting.link}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
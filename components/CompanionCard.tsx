"use client";
import { removeBookmark, addBookmark } from "@/lib/actions/companion.actions";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface CompanionCardProps {
  id: string;
  name: string;
  topic: string;
  subject: string;
  duration: number;
  color: string;
  bookmarked: boolean;
}

const CompanionCard = ({
  id,
  name,
  topic,
  subject,
  duration,
  color,
  bookmarked,
}: CompanionCardProps) => {
  const pathname = usePathname();
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [isSavingBookmark, setIsSavingBookmark] = useState(false);
  const [bookmarkError, setBookmarkError] = useState("");

  const handleBookmark = async () => {
    setIsSavingBookmark(true);
    setBookmarkError("");
    try {
      if (isBookmarked) {
        await removeBookmark(id, pathname);
      } else {
        await addBookmark(id, pathname);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      setBookmarkError(error instanceof Error && error.message === "Sign in to save companions."
        ? error.message
        : "Couldn't update this bookmark. Please try again.");
    } finally {
      setIsSavingBookmark(false);
    }
  };
  return (
    <article className="companion-card">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="subject-icon" style={{ backgroundColor: color }}>
            <Image src={`/icons/${subject}.svg`} alt="" width={24} height={24} />
          </div>
          <div className="subject-badge">{subject}</div>
        </div>
        <button
          type="button"
          className="companion-bookmark"
          onClick={handleBookmark}
          disabled={isSavingBookmark}
          aria-label={isBookmarked ? `Remove ${name} from bookmarks` : `Bookmark ${name}`}
          aria-pressed={isBookmarked}
          title={isBookmarked ? "Remove bookmark" : "Save companion"}
        >
          <Image
            src={isBookmarked ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"}
            alt=""
            width={15}
            height={17}
          />
        </button>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-foreground">{name}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{topic}</p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Image src="/icons/clock.svg" alt="" width={15} height={15} />
          <span>{duration} min</span>
        </div>
        <Link href={`/companions/${id}`} className="btn-primary min-h-10 px-4">
          Start lesson
        </Link>
      </div>
      {bookmarkError && <p role="alert" className="text-xs font-medium text-destructive">{bookmarkError}</p>}
    </article>
  );
};

export default CompanionCard;

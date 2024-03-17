import { BookmarkIcon } from "lucide-react";
import { type FC } from "react";

export const BookmarkInteraction: FC = () => {
  return (
    <button
      className="flex w-full items-center p-2 hover:cursor-pointer hover:bg-primary/10"
      onClick={(e) => {
        e.stopPropagation();
      }}
      type="button"
    >
      <BookmarkIcon className="mr-1 p-[2px]" />
      <span className="text-sm font-semibold">Bookmark tweet</span>
    </button>
  );
};

import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface item {
  id: number;
  category: string;
  message: string;
  status: string;
}

interface props {
  item: item;
}

const SidePopUp: React.FC<props> = (props) => {
  console.log(props);
  return (
    <div>
      <Sheet key={props.item.id}>
        <SheetTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all active:scale-95 px-3 py-1 rounded-md cursor-pointer">
          read more
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{props.item.category}</SheetTitle>
            <SheetDescription>{props.item.message}</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SidePopUp;

// Heading Component for re-usability

// created an interface for headings

import { cn } from "@/lib/utils";

interface HeadingProps {
    title: string;
    description?: string;
    isSubheading?: boolean;
}


const Headings = ({ title, description, isSubheading = false }: HeadingProps) => {
  return (
    <div>
        <h2 
        className={cn(
            "text-2xl md:text-3xl text-gray-800 font-semibold font-sans",
            isSubheading && "text-lg md:text-xl"
        )}>
            {title}
        </h2>
        <h2>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </h2>
    </div>
  )
}

export default Headings
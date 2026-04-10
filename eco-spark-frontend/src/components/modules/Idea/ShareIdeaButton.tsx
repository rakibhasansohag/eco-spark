"use client"

import { Share2, Link as LinkIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ShareIdeaButtonProps {
  ideaId: string
  title: string
}

export function ShareIdeaButton({ ideaId, title }: ShareIdeaButtonProps) {
  const getIdeaUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href
    }
    return `https://ecosparkhub.com/ideas/${ideaId}`
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getIdeaUrl())
    toast.success("Link copied to clipboard")
  }

  const handleShare = (platform: "twitter" | "facebook" | "linkedin") => {
    const url = getIdeaUrl()
    const text = encodeURIComponent(`Check out this sustainability idea: ${title}`)
    const encodedUrl = encodeURIComponent(url)
    
    let shareUrl = ""
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer")
    }
  }

  const handleNativeShare = async () => {
    const url = getIdeaUrl()
    if (navigator.share) {
      try {
        await navigator.share({
          title: "EcoSpark Hub Idea",
          text: `Check out this sustainability idea: ${title}`,
          url,
        })
      } catch (err) {
        console.error("Error sharing", err)
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 h-8">
          <Share2 className="size-3.5" />
          <span>Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleNativeShare} className="sm:hidden">
          <Share2 className="mr-2 size-4" />
          <span>Share via...</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleCopyLink} className="hidden sm:flex">
          <LinkIcon className="mr-2 size-4" />
          <span>Copy Link</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="hidden sm:flex" />

        <DropdownMenuItem onClick={() => handleShare("twitter")}>
          <span>Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("facebook")}>
          <span>Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("linkedin")}>
          <span>LinkedIn</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

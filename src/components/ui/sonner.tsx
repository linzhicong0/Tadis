"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: [
            "group toast group-[.toaster]:border-gray-700 group-[.toaster]:shadow-lg",
            "group-[.toaster]:bg-background group-[.toaster]:text-foreground",
            "data-[type=success]:group-[.toaster]:bg-green-500 data-[type=success]:group-[.toaster]:text-white",
            "data-[type=info]:group-[.toaster]:bg-blue-500 data-[type=info]:group-[.toaster]:text-white",
            "data-[type=error]:group-[.toaster]:bg-red-500 data-[type=error]:group-[.toaster]:text-white",
            "data-[type=warning]:group-[.toaster]:bg-yellow-500 data-[type=warning]:group-[.toaster]:text-white",
          ].join(" "),
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

type Area = {
  x: number
  y: number
  width: number
  height: number
}

type Props = {
  imageSrc: string
  aspectRatio?: number
  onComplete: (croppedBlob: Blob) => void
  onCancel: () => void
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height
      const ctx = canvas.getContext("2d")!

      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      ctx.drawImage(
        image,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      )

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Canvas toBlob failed"))
          }
        },
        "image/png",
        1.0
      )
    }
    image.onerror = reject
    // Do NOT set crossOrigin for blob: URLs — it causes CORS issues
    image.src = imageSrc
  })
}

export default function ImageCropper({ imageSrc, aspectRatio, onComplete, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)
  const [selectedAspect, setSelectedAspect] = useState<number | undefined>(aspectRatio)

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleDone = async () => {
    if (!croppedAreaPixels) return
    setProcessing(true)
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels)
      onComplete(blob)
    } finally {
      setProcessing(false)
    }
  }

  // Replace your aspectOptions array with this:
const aspectOptions = [
  { label: "Free", value: undefined },
  { label: "1:1", value: 1 },
  { label: "16:9", value: 16 / 9 },
  { label: "9:16", value: 9 / 16 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:4", value: 3 / 4 },
  { label: "3:2", value: 3 / 2 },
  { label: "2:3", value: 2 / 3 },
]

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        {/* Aspect ratio selector */}
        <div className="flex gap-2 flex-wrap">
          {aspectOptions.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setSelectedAspect(opt.value)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                selectedAspect === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Cropper */}
        <div className="relative w-full h-[350px] bg-black rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={selectedAspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Zoom</span>
            <span>{Math.round(zoom * 100)}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" className="bg-transparent" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleDone} disabled={processing}>
            {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
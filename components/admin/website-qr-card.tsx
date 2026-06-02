"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const websiteUrl = "https://foreverfauxwreaths.co.uk";

export function WebsiteQrCard() {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  const fileName = useMemo(() => "forever-faux-wreaths-qr-code.png", []);

  useEffect(() => {
    let active = true;

    async function generateQrCode() {
      try {
        const dataUrl = await QRCode.toDataURL(websiteUrl, {
          width: 320,
          margin: 2,
          color: {
            dark: "#3f3a37",
            light: "#FFFDF9",
          },
        });

        if (active) {
          setQrDataUrl(dataUrl);
        }
      } finally {
        if (active) {
          setIsGenerating(false);
        }
      }
    }

    void generateQrCode();

    return () => {
      active = false;
    };
  }, []);

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = fileName;
    link.click();
  };

  return (
    <Card className="border-cream-300 bg-white">
      <div className="p-6 border-b border-cream-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-charcoal-700">Website QR Code</h2>
            <p className="mt-1 text-sm text-charcoal-500">
              Scan or download a QR code that opens the live website.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href={websiteUrl} target="_blank" rel="noreferrer">
              Open Site
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <div className="p-6 flex flex-col items-center gap-4">
        <div className="relative flex h-56 w-56 items-center justify-center rounded-2xl border border-cream-200 bg-cream-50">
          {isGenerating ? (
            <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
          ) : qrDataUrl ? (
            <Image
              src={qrDataUrl}
              alt="QR code for Forever Faux Wreaths website"
              fill
              className="rounded-2xl object-contain p-3"
              unoptimized
            />
          ) : (
            <p className="px-4 text-center text-sm text-charcoal-500">
              QR code could not be generated.
            </p>
          )}
        </div>

        <div className="w-full rounded-xl bg-cream-50 p-4 text-sm text-charcoal-600">
          <p className="font-medium text-charcoal-700">Destination</p>
          <p className="mt-1 break-all">{websiteUrl}</p>
        </div>

        <Button
          onClick={handleDownload}
          disabled={!qrDataUrl}
          className="w-full bg-sage-400 hover:bg-sage-500 text-white"
        >
          <Download className="mr-2 h-4 w-4" />
          Download QR Code
        </Button>
      </div>
    </Card>
  );
}

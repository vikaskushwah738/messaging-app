"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from "@/message.json";

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-4 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl">Dive into the word of anonymous Conversation</h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">Explore Mystery Message - Where your identify remains a secret</p>
      </section>
      <Carousel
        plugins={[Autoplay({ delay: 2000 })]}
        className="w-full max-w-xs">
        <CarouselContent>
          {
            messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>
                      {message.title}
                    </CardHeader>
                    <CardContent className="text-lg aspect-square items-center justify-center p-6">
                      <samp className="text-lg font-semibold">
                        {message.content}
                      </samp>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
}

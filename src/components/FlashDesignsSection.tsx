import { FlashDesign } from '@/types/database';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface FlashDesignsSectionProps {
  designs: FlashDesign[];
  onSelectDesign: (design: FlashDesign) => void;
}

export function FlashDesignsSection({ designs, onSelectDesign }: FlashDesignsSectionProps) {
  return (
    <section id="flash" className="py-16">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-zinc-100 mb-2">Flash Collection</h2>
        <p className="text-zinc-400">Exclusive ready-to-ink designs by our resident artists</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {designs.map((design) => (
          <Card
            key={design.id}
            className="group relative bg-zinc-900/50 border-zinc-800 hover:border-red-700/50 overflow-hidden transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
            <CardHeader className="p-0">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={design.image_url}
                  alt={design.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </CardHeader>
            <CardContent className="relative z-20 p-4 -mt-16">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="bg-zinc-800/80 border-zinc-700 text-zinc-300">
                  {design.style}
                </Badge>
                <Badge variant="outline" className="bg-zinc-800/80 border-zinc-700 text-zinc-300">
                  {design.size}
                </Badge>
              </div>
              <CardTitle className="text-lg text-zinc-100 mb-1">{design.name}</CardTitle>
              <p className="text-sm text-zinc-500 line-clamp-2">{design.description}</p>
            </CardContent>
            <CardFooter className="relative z-20 p-4 pt-0 flex items-center justify-between">
              <span className="text-xl font-bold text-red-500">${design.price}</span>
              <Button
                size="sm"
                onClick={() => onSelectDesign(design)}
                className="bg-red-700 hover:bg-red-600 text-white"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Book This
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}

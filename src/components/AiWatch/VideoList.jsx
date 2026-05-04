import React from 'react';
import { ListVideo, PlayCircle } from 'lucide-react';

export const VideoList = ({ searchResults, onVideoSelect }) => {
  return (
    <div className="w-full flex flex-col justify-start h-[600px]">
      <div className="border-b border-white/10 pb-4 mb-6 flex justify-between items-end w-full shrink-0">
        <div>
          <h2 className="text-xl font-black italic tracking-widest text-white uppercase flex items-center gap-3">
            <ListVideo size={24} className="text-[#FDB912]" /> 
            Sistem Sonuçları
          </h2>
          <p className="text-xs text-gray-500 font-mono tracking-widest uppercase mt-2">
            {searchResults.length} Hedef Tespit Edildi
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar w-full flex-1">
        {searchResults.map((video) => (
          <div 
            key={video.id} 
            onClick={() => onVideoSelect(video)}
            className="flex flex-col sm:flex-row gap-4 bg-[#111] border border-white/5 hover:border-[#FDB912]/40 rounded-xl p-4 transition-all cursor-pointer group/card hover:bg-white/5 w-full"
          >
            <div className="w-full sm:w-40 aspect-video bg-black rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden shrink-0">
              {video.thumbnail && (
                <img src={video.thumbnail} alt="thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/card:opacity-100 transition-opacity" />
              )}
              <PlayCircle size={28} className="text-white/70 group-hover/card:text-[#FDB912] transition-colors z-10 drop-shadow-lg group-hover/card:scale-110" />
              
              <div className="absolute bottom-2 right-2 bg-black/90 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-white/20 z-10 font-mono tracking-wider">
                {video.duration}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0"></div>
            </div>

            <div className="flex flex-col justify-center flex-1">
              <h4 className="text-sm font-bold text-white group-hover/card:text-[#FDB912] transition-colors line-clamp-2 mb-2" dangerouslySetInnerHTML={{ __html: video.title }} />
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-mono text-gray-400 bg-black px-2 py-1 rounded border border-white/10">
                  {video.channel}
                </span>
                <span className="text-xs font-mono text-gray-500 flex items-center gap-1 text-[#FDB912] bg-[#FDB912]/10 px-2 py-1 rounded border border-[#FDB912]/20">
                  <PlayCircle size={12} /> İzle
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
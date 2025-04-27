import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Save, Trash2, CloudLightning, Send, Image, Video, X, Camera, Film } from 'lucide-react';

export default function TweetComposer() {
  const [tweetText, setTweetText] = useState('');
  const [savedTweets, setSavedTweets] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDetailView, setIsDetailView] = useState(false);
  const [selectedTweet, setSelectedTweet] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [activeMediaTab, setActiveMediaTab] = useState('image'); // 'image' or 'video'
  
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  
  const MAX_CHARS = 280;
  const MAX_MEDIA_FILES = 4;
  const charsRemaining = MAX_CHARS - tweetText.length;
  const isLimitReached = charsRemaining < 0;
  const canAddMoreMedia = mediaFiles.length < MAX_MEDIA_FILES;

  const handleSaveTweet = () => {
    if ((tweetText.trim() === '' && mediaFiles.length === 0) || isLimitReached) return;
    
    setIsSaving(true);
    
    // Simulate saving delay
    setTimeout(() => {
      const newTweet = {
        id: Date.now(),
        text: tweetText,
        date: new Date().toLocaleString(),
        media: [...mediaFiles]
      };
      
      setSavedTweets([newTweet, ...savedTweets]);
      setTweetText('');
      setMediaFiles([]);
      setIsSaving(false);
    }, 800);
  };
  
  const handleFileSelect = (e, type) => {
    if (!canAddMoreMedia) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    // Create a preview URL
    const fileUrl = URL.createObjectURL(file);
    
    setMediaFiles([...mediaFiles, {
      id: Date.now(),
      type: type, // 'image' or 'video'
      url: fileUrl,
      name: file.name
    }]);
    
    // Reset the input
    e.target.value = null;
  };
  
  const removeMedia = (id) => {
    setMediaFiles(mediaFiles.filter(file => file.id !== id));
  };
  
  const handleDeleteTweet = (id) => {
    setSavedTweets(savedTweets.filter(tweet => tweet.id !== id));
    if (selectedTweet && selectedTweet.id === id) {
      setIsDetailView(false);
      setSelectedTweet(null);
    }
  };
  
  const viewTweetDetail = (tweet) => {
    setSelectedTweet(tweet);
    setIsDetailView(true);
  };
  
  return (
    <div className="bg-gray-100 min-h-screen w-full font-sans">
      <div className="w-full mx-auto">
        {/* Header with decorative elements */}
        <header className="mb-8 text-center relative p-6">
          <div className="absolute -top-2 -left-4">
            <LeafSVG color="#94a3b8" rotate="30" size="40" />
          </div>
          <div className="absolute top-6 right-2">
            <LeafSVG color="#cbd5e1" rotate="-20" size="24" />
          </div>
          <h1 className="text-4xl font-light text-slate-800 mb-2">Organic Tweets</h1>
          <p className="text-slate-500 mx-auto">
            Compose your thoughts in a calming environment
          </p>
        </header>
        
        {isDetailView ? (
          <TweetDetailView 
            tweet={selectedTweet} 
            onBack={() => setIsDetailView(false)} 
            onDelete={handleDeleteTweet} 
          />
        ) : (
          <>
            {/* Composer card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm mb-8 relative overflow-hidden">
              <div className="absolute -top-10 right-4 opacity-20">
                <CloudSVG color="#E5CCAA" size="100" />
              </div>
              
              <div className="relative">
                <textarea
                  value={tweetText}
                  onChange={(e) => setTweetText(e.target.value)}
                  placeholder="What's happening?"
                  className={`w-full p-4 h-32 rounded-2xl bg-gray-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] 
                    text-slate-700 text-lg resize-none focus:outline-none focus:ring-2 
                    ${isLimitReached ? 'focus:ring-red-200 border-red-200' : 'focus:ring-peach-200 border-transparent'}`}
                />
                
                {/* Media preview area */}
                {mediaFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {mediaFiles.map(file => (
                      <div key={file.id} className="relative rounded-xl overflow-hidden bg-gray-50 aspect-video">
                        {file.type === 'image' ? (
                          <img src={file.url} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100">
                            <Video size={32} className="text-slate-400" />
                            <span className="ml-2 text-sm text-slate-500 truncate max-w-xs">{file.name}</span>
                          </div>
                        )}
                        <button 
                          onClick={() => removeMedia(file.id)}
                          className="absolute top-2 right-2 bg-slate-800 bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-full bg-slate-100 p-1">
                      <button 
                        onClick={() => {
                          setActiveMediaTab('image');
                          imageInputRef.current?.click();
                        }}
                        disabled={!canAddMoreMedia}
                        className={`p-2 rounded-full ${!canAddMoreMedia ? 'text-slate-300' : 'text-slate-500 hover:bg-peach-100'}`}
                      >
                        <Image size={18} />
                        <input 
                          type="file" 
                          ref={imageInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileSelect(e, 'image')}
                        />
                      </button>
                      
                      <button 
                        onClick={() => {
                          setActiveMediaTab('video');
                          videoInputRef.current?.click();
                        }}
                        disabled={!canAddMoreMedia}
                        className={`p-2 rounded-full ${!canAddMoreMedia ? 'text-slate-300' : 'text-slate-500 hover:bg-peach-100'}`}
                      >
                        <Film size={18} />
                        <input 
                          type="file" 
                          ref={videoInputRef}
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleFileSelect(e, 'video')}
                        />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setTweetText('');
                        setMediaFiles([]);
                      }}
                      disabled={tweetText === '' && mediaFiles.length === 0}
                      className={`p-2 rounded-full ${tweetText === '' && mediaFiles.length === 0 ? 'text-slate-300' : 'text-slate-400 hover:bg-slate-100'}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`text-sm font-medium ${isLimitReached ? 'text-red-500' : charsRemaining <= 20 ? 'text-orange-500' : 'text-slate-400'}`}>
                      {charsRemaining}
                    </div>
                    
                    <button
                      onClick={handleSaveTweet}
                      disabled={tweetText.trim() === '' || isLimitReached || isSaving}
                      className={`px-5 py-2 rounded-full flex items-center gap-2 transition-all ${
                        tweetText.trim() === '' || isLimitReached
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-peach-300 text-white hover:bg-peach-400'
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                          <span>Saving</span>
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          <span>Save Tweet</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Saved tweets */}
            <div className="bg-white rounded-3xl p-6 shadow-sm relative">
              <h2 className="text-xl font-light text-slate-700 mb-4 flex items-center gap-2">
                <MessageCircle size={20} className="text-slate-400" />
                Saved Tweets
              </h2>
              
              {savedTweets.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <CloudLightning size={24} className="text-slate-300" />
                  </div>
                  <p className="text-slate-400">No tweets saved yet</p>
                  <p className="text-sm text-slate-300 mt-1">Your saved tweets will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedTweets.map(tweet => (
                    <TweetCard 
                      key={tweet.id} 
                      tweet={tweet} 
                      onDelete={handleDeleteTweet}
                      onClick={() => viewTweetDetail(tweet)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TweetCard({ tweet, onDelete, onClick }) {
  // Truncate long tweets for the card view
  const displayText = tweet.text.length > 140 
    ? tweet.text.substring(0, 140) + '...'
    : tweet.text;
  
  const hasMedia = tweet.media && tweet.media.length > 0;
  
  return (
    <div 
      className="p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors relative group overflow-hidden"
    >
      <div className="flex justify-between">
        <div className="flex-1 cursor-pointer" onClick={onClick}>
          {tweet.text && <p className="text-slate-700 mb-2">{displayText}</p>}
          
          {/* Media previews */}
          {hasMedia && (
            <div className={`mb-2 grid ${tweet.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
              {tweet.media.slice(0, 2).map(file => (
                <div key={file.id} className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video">
                  {file.type === 'image' ? (
                    <img src={file.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100">
                      <Video size={20} className="text-slate-400" />
                    </div>
                  )}
                  
                  {tweet.media.length > 2 && file === tweet.media[1] && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white font-medium">
                      +{tweet.media.length - 2} more
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <p className="text-xs text-slate-400">{tweet.date}</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(tweet.id);
            }}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function TweetDetailView({ tweet, onBack, onDelete }) {
  if (!tweet) return null;
  
  const hasMedia = tweet.media && tweet.media.length > 0;
  
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm relative">
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-slate-500 hover:bg-gray-200"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <div className="pt-8 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-peach-200 flex items-center justify-center text-slate-700 font-medium">
              {(tweet.text && tweet.text[0]?.toUpperCase()) || (hasMedia ? 
                (tweet.media[0].type === 'image' ? <Camera size={18} /> : <Film size={18} />) 
                : 'T')}
            </div>
            <div>
              <h3 className="font-medium text-slate-800">Tweet</h3>
              <p className="text-xs text-slate-400">{tweet.date}</p>
            </div>
          </div>
          
          <button
            onClick={() => onDelete(tweet.id)}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        {tweet.text && (
          <div className="p-4 bg-gray-50 rounded-2xl mb-4">
            <p className="text-slate-700 whitespace-pre-wrap">{tweet.text}</p>
          </div>
        )}
        
        {/* Media display */}
        {hasMedia && (
          <div className={`mb-4 grid ${tweet.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
            {tweet.media.map(file => (
              <div key={file.id} className="relative rounded-xl overflow-hidden bg-gray-100">
                {file.type === 'image' ? (
                  <div className="aspect-video">
                    <img src={file.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-video flex flex-col items-center justify-center p-4 bg-slate-100">
                    <Video size={32} className="text-slate-400 mb-2" />
                    <span className="text-sm text-slate-500 text-center truncate max-w-full">{file.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-end gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
            <Send size={16} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// SVG Components
function LeafSVG({ color = "#94A3B8", rotate = "0", size = "24" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M12.0002 22C16.8732 22 21.0002 17.873 21.0002 13C21.0002 8.12701 12.0002 2 12.0002 2C12.0002 2 3.00018 8.12701 3.00018 13C3.00018 17.873 7.12719 22 12.0002 22Z" fill={color} fillOpacity="0.2" />
      <path d="M12 22C12 22 12 11 12 7C12 3 12 2 12 2C12 2 3 8.127 3 13C3 17.873 7.127 22 12 22Z" fill={color} fillOpacity="0.3" />
    </svg>
  );
}

function CloudSVG({ color = "#F1F5F9", size = "64" }) {
  return (
    <svg width={size} height={Math.round(parseInt(size) * 0.6)} viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M52 8.00001C49.25 8.00001 46.7 8.85001 44.55 10.35C42.15 4.30001 36.45 0 29.75 0C21.2 0 14.15 6.60001 13.1 15C5.80001 15.85 0 22.1 0 29.75C0 37.85 6.60001 44.45 14.7 44.45H52C58.65 44.45 64 39.1 64 32.45C64 25.8 58.65 20.45 52 20.45C52 20.45 52.4 10.9 52 8.00001Z" fill={color} />
    </svg>
  );
}

// Add these CSS variables to make the colors work
const style = document.createElement('style');
style.textContent = `
  :root {
    --color-peach-100: #FDF2E9;
    --color-peach-200: #FBEADB;
    --color-peach-300: #F4B183;
    --color-peach-400: #E59C6B;
    --color-peach-600: #D2691E;
    
    --color-mint-100: #E6F0ED;
    --color-mint-200: #D1E0DB;
    --color-mint-600: #3D7A68;
    
    --color-slate-50: #F8FAFC;
    --color-slate-100: #F1F5F9;
    --color-slate-200: #E2E8F0;
    --color-slate-400: #94A3B8;
    --color-slate-500: #64748B;
    --color-slate-600: #475569;
    --color-slate-700: #334155;
    --color-slate-800: #1E293B;
  }
  
  .bg-peach-100 { background-color: var(--color-peach-100); }
  .bg-peach-200 { background-color: var(--color-peach-200); }
  .bg-peach-300 { background-color: var(--color-peach-300); }
  .bg-peach-400 { background-color: var(--color-peach-400); }
  .text-peach-600 { color: var(--color-peach-600); }
  
  .bg-mint-100 { background-color: var(--color-mint-100); }
  .bg-mint-200 { background-color: var(--color-mint-200); }
  .text-mint-600 { color: var(--color-mint-600); }
  
  .text-white { color: white; }
  .text-red-500 { color: #EF4444; }
  .text-orange-500 { color: #F97316; }
  .border-red-200 { border-color: #FECACA; }
  .focus\:ring-red-200:focus { --tw-ring-color: #FECACA; }
  .focus\:ring-peach-200:focus { --tw-ring-color: #FBEADB; }
`;
document.head.appendChild(style);
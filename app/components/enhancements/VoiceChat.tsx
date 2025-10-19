
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Loader2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function VoiceChat() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcript, setTranscript] = useState('');
  const [volume, setVolume] = useState(1);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript(transcriptText);

          if (event.results[current].isFinal) {
            handleVoiceCommand(transcriptText);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }

      // Initialize Speech Synthesis
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      setTranscript('');
    }
  };

  const handleVoiceCommand = async (text: string) => {
    setIsProcessing(true);
    setIsListening(false);
    recognitionRef.current?.stop();

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Send to AI (Gemini API)
      const response = await fetch('/api/chat/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          voice: true
        })
      });

      const data = await response.json();
      const aiMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Speak the response
      speakText(data.response);
    } catch (error) {
      console.error('Voice chat error:', error);
    } finally {
      setIsProcessing(false);
      setTranscript('');
    }
  };

  const speakText = (text: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = volume;
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Voice Chat with AI</h2>
        <p className="text-muted-foreground">
          Talk to your AI assistant using voice commands
        </p>
      </div>

      {/* Messages */}
      <Card className="p-4 h-[400px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Click the microphone button to start talking
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg p-3',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent'
                  )}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Live Transcript */}
      {(isListening || isProcessing) && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {isListening && (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Listening...</span>
              </>
            )}
            {isProcessing && (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Processing...</span>
              </>
            )}
          </div>
          {transcript && (
            <p className="text-sm text-muted-foreground italic">{transcript}</p>
          )}
        </Card>
      )}

      {/* Controls */}
      <div className="flex gap-4 items-center justify-center">
        <Button
          size="lg"
          variant={isListening ? 'destructive' : 'default'}
          className="h-16 w-16 rounded-full"
          onClick={toggleListening}
          disabled={isProcessing || isSpeaking}
        >
          {isListening ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>

        <Button
          size="lg"
          variant={isSpeaking ? 'destructive' : 'outline'}
          className="h-16 w-16 rounded-full"
          onClick={stopSpeaking}
          disabled={!isSpeaking}
        >
          {isSpeaking ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Volume Control */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Volume2 className="w-5 h-5 text-muted-foreground" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm font-medium w-12 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </Card>

      {/* Features Info */}
      <Card className="p-4 bg-accent/50">
        <h4 className="font-semibold mb-2">Voice Commands</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• "Show me today's jobs"</li>
          <li>• "What's the weather forecast?"</li>
          <li>• "Calculate estimate for 5000 sq ft parking lot"</li>
          <li>• "Where is employee [name]?"</li>
          <li>• "Show me pending invoices"</li>
        </ul>
      </Card>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quotes = [
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  }
];

export const QuoteOfTheDay = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  };

  useEffect(() => {
    getRandomQuote();
  }, []);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Quote className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
          <div className="flex-1">
            <blockquote className="text-lg font-medium leading-relaxed mb-3">
              "{currentQuote.text}"
            </blockquote>
            <div className="flex items-center justify-between">
              <cite className="text-sm text-muted-foreground font-medium">
                — {currentQuote.author}
              </cite>
              <Button
                variant="ghost"
                size="sm"
                onClick={getRandomQuote}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
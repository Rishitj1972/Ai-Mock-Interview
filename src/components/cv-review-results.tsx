import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Star, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

interface CVReviewResultsProps {
  results: {
    score: number;
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
}

export default function CVReviewResults({ results }: CVReviewResultsProps) {
  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            Overall CV Score
          </CardTitle>
          <div className="text-4xl font-bold text-primary">{results.score}/100</div>
        </CardHeader>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {results.strengths.map((strength, index) => (
              <Badge key={index} variant="secondary" className="mr-2 mb-2">
                {strength}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Areas for Improvement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <AlertCircle className="h-5 w-5" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {results.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                {improvement}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Lightbulb className="h-5 w-5" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {results.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500">💡</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Target, TrendingUp, Lightbulb } from "lucide-react";
import type { RoleBasedCVAnalysisResult, JobRole } from "@/lib/cv-analysis";

interface CVReviewResultsProps {
  results: RoleBasedCVAnalysisResult;
  jobRole?: JobRole;
}

export default function CVReviewResults({ results, jobRole }: CVReviewResultsProps) {
  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>CV Analysis Score</span>
            <span className="text-3xl font-bold text-blue-600">{results.score}/100</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${results.score}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Role Alignment Card - Only show if jobRole is provided */}
      {jobRole && results.roleAlignment && (
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <Target className="h-5 w-5" />
              Role Alignment: {jobRole.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={results.roleAlignment.matchPercentage >= 70 ? "default" : "destructive"}>
                {results.roleAlignment.matchPercentage}% Match
              </Badge>
              <Badge variant="outline">
                {jobRole.industry} | {jobRole.level} Level
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Missing Key Skills
                </h4>
                <div className="space-y-1">
                  {results.roleAlignment.missingSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="mr-1 mb-1 text-red-600 border-red-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Recommended Sections
                </h4>
                <ul className="space-y-1">
                  {results.roleAlignment.recommendedSections.map((section, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      {section}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Industry Insights Card - Only show if available */}
      {results.industryInsights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <TrendingUp className="h-5 w-5" />
              Industry Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  results.industryInsights.demandLevel === 'High' ? 'text-green-600' :
                  results.industryInsights.demandLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {results.industryInsights.demandLevel}
                </div>
                <p className="text-sm text-gray-500">Market Demand</p>
              </div>
              {results.industryInsights.salaryRange && (
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {results.industryInsights.salaryRange}
                  </div>
                  <p className="text-sm text-gray-500">Salary Range</p>
                </div>
              )}
              <div className="text-center">
                <div className="text-sm">
                  <p className="font-semibold mb-1">Trending Skills:</p>
                  <div className="flex flex-wrap justify-center gap-1">
                    {results.industryInsights.trendingSkills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Strengths Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {results.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Areas for Improvement Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <XCircle className="h-5 w-5" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {results.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">⚠</span>
                <span className="text-gray-700">{improvement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Suggestions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <Lightbulb className="h-5 w-5" />
            Actionable Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {results.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">💡</span>
                <span className="text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
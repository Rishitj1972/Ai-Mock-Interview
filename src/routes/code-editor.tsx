import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SLUGS from '@/data/codewars-slugs.json';

// Types
interface Problem {
  id: number;
  title: string;
  description: string;
  examples: Array<{ input: string; output: string }>;
  starterCode: {
    javascript: string;
    python: string;
    java: string;
  };
  slug?: string;
}

interface Language {
  id: string;
  name: string;
  judge0Id: number;
}

type JobRole = 'Software Developer' | 'Data Scientist';

// We'll use a curated set of Codewars slugs (imported as SLUGS) and fetch kata details live.
// Provide starter templates for languages (used when Codewars doesn't provide starter code).
const STARTER_TEMPLATES: Record<string, Record<string, string>> = {
  javascript: {
  default: `// Write your JavaScript solution here\n// Example: print to verify runner\nconsole.log("Hello, world!");\n`,
  },
  python: {
  default: `# Write your Python solution here\n# Example: print to verify runner\nprint("Hello, world!")\n`,
  },
  java: {
  default: `// Write your Java solution here\n// Example: simple main that prints to verify runner\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, world!");\n  }\n}\n`,
  }
};

const LANGUAGES: Language[] = [
  { id: 'javascript', name: 'JavaScript', judge0Id: 63 },
  { id: 'python', name: 'Python', judge0Id: 71 },
  { id: 'java', name: 'Java', judge0Id: 62 }
];

const CodeEditorPage = () => {
  const [jobRole, setJobRole] = useState<string>('');
  const [experience, setExperience] = useState<string>('');
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [output, setOutput] = useState<string>('');
  const [functionName, setFunctionName] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [generatedTests, setGeneratedTests] = useState<Array<{ input: string; output: string }>>([]);
  const [isGeneratingTests, setIsGeneratingTests] = useState<boolean>(false);
  // Resizable left pane state
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [leftPercent, setLeftPercent] = useState<number>(50); // default 50%
  const [isDragging, setIsDragging] = useState(false);
  const [isLarge, setIsLarge] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  // update isLarge on resize
  useEffect(() => {
    const onResize = () => setIsLarge(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.round((x / rect.width) * 100);
      const clamped = Math.max(20, Math.min(80, pct));
      setLeftPercent(clamped);
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging]);

  const handleGenerateProblems = async () => {
    if (!jobRole || !experience) return;

    const expYears = parseInt(experience);
    // Map experience to difficulty
    let difficulty = 'easy';
    if (expYears <= 2) difficulty = 'easy';
    else if (expYears <= 5) difficulty = 'medium';
    else difficulty = 'hard';

    // Get slug list for role & difficulty
    const roleSlugs: string[] | undefined = (SLUGS as any)[jobRole]?.[difficulty];
    if (!roleSlugs || roleSlugs.length === 0) return;

  // Deduplicate slugs and pick up to two random unique slugs
  const uniqueRoleSlugs = Array.from(new Set(roleSlugs));
  const shuffled = uniqueRoleSlugs.sort(() => 0.5 - Math.random());
  const selectedSlugs = shuffled.slice(0, Math.min(2, shuffled.length));

    // Fetch kata details from Codewars for each slug
    const DEFAULT_UNIQUE_EXAMPLES: Array<{ input: string; output: string }> = [
      { input: "AAAABBBCCDAABBB", output: "['A','B','C','D','A','B']" },
      { input: "ABBCcAD", output: "['A','B','C','c','A','D']" },
      { input: "[1,2,2,3,3]", output: "[1,2,3]" }
    ];

    const kataPromises = selectedSlugs.map(async (slug) => {
      try {
        const res = await axios.get(`https://www.codewars.com/api/v1/code-challenges/${slug}`);
        const data = res.data;

        // By default try to extract examples from the kata description if present.
        // For the well-known "Unique In Order" kata (slug: "unique-in-order")
        // provide three common examples so the UI shows concise, ordered samples.
        let examples: Array<{ input: string; output: string }> = [];
        try {
          const lowerName = (data && data.name) ? String(data.name).toLowerCase() : '';
          if (slug === 'unique-in-order' || /unique\s*in\s*order/i.test(lowerName)) {
            examples = DEFAULT_UNIQUE_EXAMPLES;
          }
        } catch (e) {
          // ignore and leave examples empty
        }

        return {
          id: data.id,
          slug,
          title: data.name,
          description: data.description || data.name,
          examples,
          starterCode: {
            javascript: STARTER_TEMPLATES.javascript.default,
            python: STARTER_TEMPLATES.python.default,
            java: STARTER_TEMPLATES.java.default,
          }
        } as Problem;
      } catch (err) {
        return null;
      }
    });

  const kataResults = (await Promise.all(kataPromises)).filter(Boolean) as Problem[];
    // Ensure fetched problems are unique by id (filter accidental duplicates)
    const seen = new Set<number>();
    const uniqueProblems = kataResults.filter(p => {
      if (!p || seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

    setProblems(uniqueProblems);
    if (uniqueProblems.length > 0) {
      const firstProblem = uniqueProblems[0];
      setSelectedProblem(firstProblem);
      setCode(firstProblem.starterCode[language as keyof Problem['starterCode']] || '');
      // default function name from slug when available
      const defName = firstProblem.slug ? firstProblem.slug.replace(/-/g, '_') : '';
      setFunctionName(defName);
      
      // Automatically generate test cases for the first problem immediately
      setTimeout(() => generateTestCases(firstProblem), 1000);
    }
  };

  const handleProblemSelect = (problem: Problem) => {
    setSelectedProblem(problem);
    const starterCode = problem.starterCode[language as keyof Problem['starterCode']] || '';
    setCode(starterCode);
    setOutput('');
    setFunctionName(problem.slug ? problem.slug.replace(/-/g, '_') : '');
    
    // Automatically generate test cases when problem is selected
    setTimeout(() => generateTestCases(), 500);
  };  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (selectedProblem) {
      const starterCode = selectedProblem.starterCode[newLanguage as keyof Problem['starterCode']] || '';
      setCode(starterCode);
    }
  };

  const generateTestCases = async (targetProblem?: Problem, retryCount = 0) => {
    const problemToUse = targetProblem || selectedProblem;
    const funcName = functionName.trim() || (problemToUse?.slug ? problemToUse.slug.replace(/-/g, '_') : '');
    
    if (!problemToUse || !funcName) return;

    setIsGeneratingTests(true);
    try {
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
      if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured. Set VITE_GEMINI_API_KEY in .env');
      }

      const prompt = `Based on this coding problem, generate exactly 3 test cases with input and expected output:

Problem: ${problemToUse.title}
Description: ${problemToUse.description}
Function name: ${funcName}

Please respond with ONLY a JSON array in this exact format:
[
  {"input": "test_input_1", "output": "expected_output_1"},
  {"input": "test_input_2", "output": "expected_output_2"},
  {"input": "test_input_3", "output": "expected_output_3"}
]

Make sure inputs are appropriate for the problem and outputs are correct. For array inputs, use proper array notation.`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Extract JSON from the response
      const jsonMatch = generatedText.match(/\[\s*{[\s\S]*}\s*\]/);
      if (jsonMatch) {
        const testCases = JSON.parse(jsonMatch[0]);
        setGeneratedTests(testCases);
        
        // Update the selected problem with generated test cases
        if (problemToUse) {
          const updatedProblem = { ...problemToUse, examples: testCases };
          setSelectedProblem(updatedProblem);
        }
        
        // Clear any previous error messages
        setOutput('');
      } else {
        throw new Error('Failed to parse test cases from Gemini response');
      }

    } catch (error: any) {
      console.error('Failed to generate test cases:', error);
      
      // Handle rate limiting with retry
      if (error.response?.status === 429 && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`Rate limited, retrying in ${delay}ms...`);
        setTimeout(() => {
          generateTestCases(targetProblem, retryCount + 1);
        }, delay);
        return; // Don't set isGeneratingTests to false yet
      }
      
      // For other errors or max retries reached
      if (error.response?.status === 429) {
        setOutput(`Rate limit exceeded. Please wait a moment and try selecting another problem.`);
      } else {
        setOutput(`Error generating test cases: ${error.message}`);
      }
      
      setIsGeneratingTests(false);
    }
  };

  const runCode = async () => {
    if (!code.trim()) return;

    setIsRunning(true);
    setOutput('Running...');

    try {
      const languageConfig = LANGUAGES.find(lang => lang.id === language);
      
      if (!languageConfig) {
        throw new Error('Language not supported');
      }

      // Submit to Judge0 API
      const JUDGE0_URL = import.meta.env.VITE_JUDGE0_URL || '';
      const JUDGE0_KEY = import.meta.env.VITE_JUDGE0_KEY || '';
      const JUDGE0_HOST = import.meta.env.VITE_JUDGE0_HOST || '';

      if (!JUDGE0_URL) {
        throw new Error('Judge0 URL not configured. Set VITE_JUDGE0_URL in .env');
      }

      // Build headers. If using RapidAPI, include RapidAPI headers when key/host provided.
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (JUDGE0_KEY) {
        // Prefer explicit host if provided
        if (JUDGE0_HOST) headers['X-RapidAPI-Host'] = JUDGE0_HOST;
        // RapidAPI key header (many Judge0 RapidAPI wrappers expect this)
        headers['X-RapidAPI-Key'] = JUDGE0_KEY;
      }

      // Try multiple common Judge0 endpoint variants because some RapidAPI wrappers
      // expose slightly different paths (base64 flag vs wait query). Try each until one works.
  const base = JUDGE0_URL.replace(/\/+$/, '');

      // Try the configured base first, then a couple of known RapidAPI Judge0 hosts
      const knownJudge0Bases = [base];
      if (JUDGE0_KEY) {
        // common RapidAPI Judge0 wrapper host — adding as fallback may help if the wrapper
        // you used is different from your configured host
        knownJudge0Bases.push('https://judge0-ce.p.rapidapi.com');
        knownJudge0Bases.push('https://judge0-extra.p.rapidapi.com');
      }

      let submissionRes: any = null;
      const attempts: Array<{ url: string; status?: number; data?: any; error?: string }> = [];

      for (const candidateBase of Array.from(new Set(knownJudge0Bases))) {
  const cleaned = candidateBase.replace(/\/+$/, '');
        const candidateUrls = [
          `${cleaned}/submissions?base64_encoded=false&wait=true`,
          `${cleaned}/submissions?wait=true`,
          `${cleaned}/submissions?base64_encoded=true&wait=true`,
          `${cleaned}/submissions`
        ];

        // Build attempt-specific headers: ensure X-RapidAPI-Host matches the host of candidateBase when using RapidAPI key
        const attemptHeadersBase: Record<string, string> = { ...headers };
        if (JUDGE0_KEY) {
          try {
            const parsedHost = new URL(cleaned).hostname;
            attemptHeadersBase['X-RapidAPI-Host'] = parsedHost;
            attemptHeadersBase['X-RapidAPI-Key'] = JUDGE0_KEY;
          } catch (parseErr) {
            // fallback to configured host header if URL parsing fails
            if (JUDGE0_HOST) attemptHeadersBase['X-RapidAPI-Host'] = JUDGE0_HOST;
          }
        }

        for (const url of candidateUrls) {
          try {
            // If JS and problem has examples/generated tests, wrap code in test harness
            let submissionSource = code;
            if (language === 'javascript' && selectedProblem && selectedProblem.examples && selectedProblem.examples.length > 0 && functionName) {
              const tests = selectedProblem.examples.map(ex => ({ input: ex.input, expected: ex.output }));
              const harness = `
// Test harness
function runTests(fn, tests) {
  console.log('TEST_RESULTS_START');
  const results = [];
  for (const test of tests) {
    try {
      let input = test.input;
      // Try to parse input as JSON if it looks like an array or object
      try {
        if (input.startsWith('[') || input.startsWith('{') || input.startsWith('"')) {
          input = JSON.parse(test.input);
        }
      } catch (e) {
        // Keep as string if JSON parsing fails
      }
      
      const result = fn(input);
      const expected = test.expected;
      
      // Compare result with expected (convert both to strings for comparison)
      const pass = JSON.stringify(result) === JSON.stringify(expected);
      results.push({
        input: test.input,
        expected: expected,
        result: result,
        pass: pass
      });
    } catch (error) {
      results.push({
        input: test.input,
        expected: test.expected,
        error: error.message,
        pass: false
      });
    }
  }
  
  console.log(JSON.stringify(results, null, 2));
  console.log('TEST_RESULTS_END');
}

// Debug: Check what's available in global scope
console.log('Available functions:', Object.getOwnPropertyNames(globalThis).filter(name => typeof globalThis[name] === 'function'));
console.log('Looking for function:', '${functionName}');

// Try to run tests
try {
  let userFn = null;
  
  // Try multiple ways to find the function
  if (typeof ${functionName} === 'function') {
    userFn = ${functionName};
    console.log('Found function via direct reference');
  } else if (typeof globalThis.${functionName} === 'function') {
    userFn = globalThis.${functionName};
    console.log('Found function via globalThis');
  } else if (typeof window !== 'undefined' && typeof window.${functionName} === 'function') {
    userFn = window.${functionName};
    console.log('Found function via window');
  }
  
  if (userFn) {
    console.log('Running tests for function:', '${functionName}');
    runTests(userFn, ${JSON.stringify(tests)});
  } else {
    console.log('ERROR: Function ${functionName} not found');
    console.log('Available functions:', Object.getOwnPropertyNames(globalThis).filter(name => typeof globalThis[name] === 'function'));
  }
} catch (e) {
  console.log('ERROR: ' + e.message);
}
`;
              submissionSource = code + '\n' + harness;
            }

            const res = await axios.post(
              url,
              {
                source_code: submissionSource,
                language_id: languageConfig.judge0Id
              },
              { headers: attemptHeadersBase, timeout: 20000 }
            );

            attempts.push({ url, status: res.status, data: res.data });
            submissionRes = res;
            // stop on successful HTTP response
            if (submissionRes && submissionRes.status >= 200 && submissionRes.status < 300) {
              break;
            }
          } catch (e: any) {
            // capture axios error details
            const status = e.response?.status;
            const data = e.response?.data;
            const errMsg = e.message || String(e);
            attempts.push({ url, status, data, error: errMsg });
            // continue to next candidate
          }
        }

        if (submissionRes) break;
      }

      if (!submissionRes) {
        // All attempts failed — present a helpful debug summary and try Piston fallback.
        const summary = attempts.map(a => {
          const lines: string[] = [];
          lines.push(`URL: ${a.url}`);
          if (a.status) lines.push(`  status: ${a.status}`);
          if (a.error) lines.push(`  error: ${a.error}`);
          if (a.data) lines.push(`  data: ${typeof a.data === 'string' ? a.data : JSON.stringify(a.data)}`);
          return lines.join('\n');
        }).join('\n\n');

        // Try a public fallback (Piston). Allow override via VITE_PISTON_URL.
        const PISTON_URL = import.meta.env.VITE_PISTON_URL || 'https://emkc.org/api/v2/piston/execute';

        // Map our language ids to common Piston language identifiers
        const pistonMap: Record<string, string> = {
          javascript: 'javascript',
          python: 'python3',
          java: 'java'
        };
        const pistonLang = pistonMap[language] || pistonMap.javascript;

        try {
          // Derive base and runtimes endpoint from provided PISTON_URL
          const pistonBase = PISTON_URL.replace(/\/+$/, '').replace(/\/execute$/i, '');
          const runtimesUrl = `${pistonBase}/runtimes`;

          let versionToUse: string | undefined = undefined;
          try {
            const rres = await axios.get(runtimesUrl, { timeout: 10000 });
            const runtimes = Array.isArray(rres.data) ? rres.data : (rres.data?.runtimes || []);
            const found = runtimes.find((rt: any) => {
              if (!rt) return false;
              const lang = rt.language || rt.name || rt.lang;
              const aliases = rt.aliases || rt.alias || [];
              return lang === pistonLang || aliases.includes?.(pistonLang);
            });
            // runtime shape may vary; try common fields
            if (found) {
              versionToUse = found.version || (Array.isArray(found.versions) ? found.versions[0] : undefined) || (found.versions?.[0]?.version);
            }
          } catch (rErr) {
            // ignore; we'll try to post with no version later (but Piston requires it)
          }

          if (!versionToUse) {
            // If we didn't find a version, try a small set of common versions for common languages
            const commonDefaults: Record<string, string> = { python3: '3.10.6', javascript: '16.13.0', java: '17.0.1' };
            versionToUse = commonDefaults[pistonLang] || commonDefaults.javascript;
          }

          // Call Piston execute with required version field. Some Piston deployments
          // expect a `files` array instead of `source`. Try `source` first, then retry
          // with `files` payload if the API complains.
          const executeUrl = PISTON_URL.includes('/execute') ? PISTON_URL : `${pistonBase}/execute`;

          let pistonRes: any = null;
          try {
            pistonRes = await axios.post(
              executeUrl,
              { language: pistonLang, version: String(versionToUse), source: code },
              { timeout: 20000 }
            );
          } catch (firstErr: any) {
            const firstData = firstErr.response?.data;
            const firstMsg = (firstData && (firstData.message || JSON.stringify(firstData))) || firstErr.message || String(firstErr);

            // If API complains about `files is required` or similar, retry with files array
            const needFiles = String(firstMsg).toLowerCase().includes('files is required') || String(firstMsg).toLowerCase().includes('files');
            if (needFiles) {
              // pick sensible filename by language
              const filename = pistonLang.startsWith('python') ? 'main.py' : (pistonLang === 'javascript' ? 'index.js' : 'Main.java');
              try {
                pistonRes = await axios.post(
                  executeUrl,
                  { language: pistonLang, version: String(versionToUse), files: [{ name: filename, content: code }] },
                  { timeout: 20000 }
                );
              } catch (secondErr: any) {
                // both attempts failed; include both errors in diagnostics
                const secondData = secondErr.response?.data || secondErr.message || String(secondErr);
                setOutput('Judge0 failed:\n\n' + summary + '\n\nPiston fallback attempt 1 error:\n' + firstMsg + '\n\nPiston fallback attempt 2 error:\n' + JSON.stringify(secondData));
                setIsRunning(false);
                return;
              }
            } else {
              // not a files-related error — show the error
              setOutput('Judge0 failed:\n\n' + summary + '\n\nPiston fallback error:\n' + firstMsg);
              setIsRunning(false);
              return;
            }
          }

          const pdata = pistonRes.data || {};
          const pistonOut = pdata.output || pdata.run?.stdout || pdata.run?.output || JSON.stringify(pdata);

          setOutput('Judge0 failed:\n\n' + summary + '\n\nPiston fallback result:\n' + pistonOut);
          setIsRunning(false);
          return;
        } catch (pErr: any) {
          // Fallback failed as well — show combined diagnostics
          const pistonErr = pErr.response?.data || pErr.message || String(pErr);
          setOutput('Error: All Judge0 submission attempts failed:\n\n' + summary + '\n\nPiston fallback also failed:\n' + JSON.stringify(pistonErr));
          setIsRunning(false);
          return;
        }
      }

      // Different wrappers may nest the execution result differently; try common fields.
      const result = submissionRes.data || {};
      // Some wrappers return the submission directly; others wrap inside `result`.
      const exec = result; // default
      const stdout = exec.stdout || exec.stdout_text || exec.stdout || '';
      const stderr = exec.stderr || exec.stderr_text || exec.stderr || '';
      const compile_output = exec.compile_output || exec.compile_output_text || '';

      // If nothing standard present, show whole payload for debugging
      if (!stdout && !stderr && !compile_output) {
        // Check if this is a successful execution with no output
        if (exec.status?.id === 3) { // Status 3 = Accepted in Judge0
          setOutput('Code executed successfully but produced no output.');
        } else {
          setOutput(JSON.stringify(result, null, 2));
        }
      } else {
        const outputText = stdout || stderr || compile_output || 'No output';
        
        // Check if output contains test results
        if (outputText.includes('TEST_RESULTS_START') && outputText.includes('TEST_RESULTS_END')) {
          try {
            const startIdx = outputText.indexOf('TEST_RESULTS_START') + 'TEST_RESULTS_START'.length;
            const endIdx = outputText.indexOf('TEST_RESULTS_END');
            const jsonStr = outputText.substring(startIdx, endIdx).trim();
            const testResults = JSON.parse(jsonStr);
            
            // Format test results nicely
            let formattedOutput = '=== TEST RESULTS ===\n\n';
            testResults.forEach((test: any, index: number) => {
              formattedOutput += `Test ${index + 1}: ${test.pass ? '✅ PASS' : '❌ FAIL'}\n`;
              formattedOutput += `  Input: ${test.input}\n`;
              formattedOutput += `  Expected: ${test.expected}\n`;
              if (test.error) {
                formattedOutput += `  Error: ${test.error}\n`;
              } else {
                formattedOutput += `  Got: ${JSON.stringify(test.result)}\n`;
              }
              formattedOutput += '\n';
            });
            
            const passedTests = testResults.filter((t: any) => t.pass).length;
            formattedOutput += `Summary: ${passedTests}/${testResults.length} tests passed`;
            
            setOutput(formattedOutput);
          } catch (e) {
            setOutput(outputText);
          }
        } else {
          // No test results found, but we have output - check if it's just empty execution
          if (exec.status?.id === 3 && !outputText.trim()) {
            setOutput('Code executed successfully but produced no visible output. Make sure your function returns a value and is being called.');
          } else {
            setOutput(outputText);
          }
        }
      }
    } catch (error: any) {
      // Provide a clearer message with request info when available
      let msg = '';
      if (error.response) {
        // axios error with response
        msg = `Request failed with status ${error.response.status} when calling ${error.config?.url || ''}`;
        if (error.response.data) msg += ` - ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        msg = `No response received when calling ${error.config?.url || ''}`;
      } else {
        msg = error.message || String(error);
      }
      setOutput('Error: ' + msg);
    } finally {
      setIsRunning(false);
    }
  };

  // Note: Judge0 API used in runCode

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Practice Coding Problems</h1>
      
      {!selectedProblem ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="jobRole">Job Role</Label>
              <select
                id="jobRole"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Job Role</option>
                <option value="Software Developer">Software Developer</option>
                <option value="Data Scientist">Data Scientist</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                placeholder="Enter years of experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                min="0"
                max="20"
              />
            </div>
            
            <Button onClick={handleGenerateProblems} className="w-full">
              Generate Problems
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div ref={containerRef} className="h-[calc(100vh-200px)] relative">
          {/* Desktop resizable layout */}
          <div className="hidden lg:flex w-full h-full" style={{ gap: '1.5rem' }}>
            <div className="space-y-4 overflow-y-auto" style={{ width: `${leftPercent}%` }}>
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedProblem(null);
                    setProblems([]);
                    setCode('');
                    setOutput('');
                  }}
                >
                  ← Back to Setup
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Available Problems</CardTitle>
                </CardHeader>
                <CardContent>
                  {problems.map((problem, index) => (
                    <Button
                      key={problem.id}
                      variant={selectedProblem?.id === problem.id ? "default" : "outline"}
                      className="w-full mb-2"
                      onClick={() => handleProblemSelect(problem)}
                    >
                      Problem {index + 1}: {problem.title}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {selectedProblem && (
                <Card className="bg-black text-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">{selectedProblem.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <pre className="whitespace-pre-wrap text-sm text-white">{selectedProblem.description}</pre>
                    </div>

                    <h4 className="font-semibold mb-2">Examples:</h4>
                    <ol className="list-decimal list-inside space-y-3">
                      {selectedProblem.examples.map((example, index) => (
                        <li key={index} className="bg-slate-900 p-3 rounded">
                          <div className="mb-1"><strong>Input</strong></div>
                          <pre className="whitespace-pre-wrap text-sm text-white mb-2">{example.input}</pre>
                          <div className="mb-1"><strong>Output</strong></div>
                          <pre className="whitespace-pre-wrap text-sm text-white">{example.output}</pre>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Divider */}
            <div
              onMouseDown={() => setIsDragging(true)}
              className="hidden lg:block bg-gray-200 cursor-col-resize"
              style={{ width: 8, margin: '0 8px' }}
            />

            {/* Right Side - Code Editor (remaining width) */}
            <div className="flex flex-col space-y-4 h-full" style={{ width: `${100 - leftPercent}%` }}>
              <div className="flex gap-2">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>

                <Input
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                  placeholder="Function name (for tests)"
                  className="p-2 w-48"
                />

                <Button onClick={runCode} disabled={isRunning}>
                  {isRunning ? 'Running...' : 'Run Code'}
                </Button>
                
                {isGeneratingTests && (
                  <span className="text-sm text-gray-500 self-center">Generating tests...</span>
                )}
              </div>

              <Card className="flex-1 h-full">
                <CardContent className="p-0 h-full">
                  <div className="h-full">
                    <Editor
                      height="100%"
                      language={language}
                      value={code}
                      onChange={(value) => setCode(value || '')}
                      theme="vs-light"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        readOnly: false,
                        automaticLayout: true,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {output && (
                <Card>
                  <CardHeader>
                    <CardTitle>Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-black text-green-400 p-4 rounded overflow-x-auto">
                      {output}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Mobile stacked layout */}
          <div className="lg:hidden space-y-4 h-full overflow-y-auto">
            <div className="flex gap-2 mb-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedProblem(null);
                  setProblems([]);
                  setCode('');
                  setOutput('');
                }}
              >
                ← Back to Setup
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Available Problems</CardTitle>
              </CardHeader>
              <CardContent>
                {problems.map((problem, index) => (
                  <Button
                    key={problem.id}
                    variant={selectedProblem?.id === problem.id ? "default" : "outline"}
                    className="w-full mb-2"
                    onClick={() => handleProblemSelect(problem)}
                  >
                    Problem {index + 1}: {problem.title}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {selectedProblem && (
              <Card className="bg-slate-800 text-white">
                <CardHeader>
                  <CardTitle className="text-lg text-white">{selectedProblem.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <pre className="whitespace-pre-wrap text-sm text-white">{selectedProblem.description}</pre>
                  </div>

                  <h4 className="font-semibold mb-2">Examples:</h4>
                  <ol className="list-decimal list-inside space-y-3">
                    {selectedProblem.examples.map((example, index) => (
                      <li key={index} className="bg-slate-900 p-3 rounded">
                        <div className="mb-1"><strong>Input</strong></div>
                        <pre className="whitespace-pre-wrap text-sm text-white mb-2">{example.input}</pre>
                        <div className="mb-1"><strong>Output</strong></div>
                        <pre className="whitespace-pre-wrap text-sm text-white">{example.output}</pre>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
              
              <Input
                value={functionName}
                onChange={(e) => setFunctionName(e.target.value)}
                placeholder="Function name (for tests)"
                className="p-2 w-48"
              />

              <Button onClick={runCode} disabled={isRunning} className="flex-1">
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
              
              {isGeneratingTests && (
                <span className="text-sm text-gray-500 self-center">Generating tests...</span>
              )}
            </div>

            <Card>
              <CardContent className="p-0">
                <Editor
                  height="300px"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-light"
                  options={{ minimap: { enabled: false }, automaticLayout: true }}
                />
              </CardContent>
            </Card>

            {output && (
              <Card>
                <CardHeader>
                  <CardTitle>Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-black text-green-400 p-4 rounded overflow-x-auto">{output}</pre>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditorPage;
